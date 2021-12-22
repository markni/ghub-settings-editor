const os = require('os');
const { v4: uuidv4 } = require('uuid');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

let path = `C:\\Users\\${
  os.userInfo().username
}\\AppData\\Local\\LGHUB\\settings.db`;

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path);

const createNewApplication = ({ applicationPath, name, posterPath }) => {
  return {
    applicationId: uuidv4(),
    applicationPath,
    isCustom: true,
    name,
    posterPath,
  };
};

const createNewProfile = ({ applicationId }) => {
  return {
    activeForApplication: true,
    applicationId,
    assignments: [],
    id: uuidv4(),
    name: 'PROFILE_NAME_DEFAULT',
  };
};

const addApp = ({ applicationPath, name, posterPath, fromCli }) => {
  return new Promise((resolve, reject)=>{
    db.serialize(function () {
      db.all('select * from DATA', function (err, dataArr) {
        let file = dataArr[0]['FILE'];
        let json = JSON.parse(file);
        let newApplication = createNewApplication({
          applicationPath,
          name,
          posterPath,
        });
        let newProfile = createNewProfile({
          applicationId: newApplication.applicationId,
        });
        let applications = json['applications']['applications'];

        if (
          !applications.find((app) => app['applicationPath'] === applicationPath)
        ) {
          json['applications']['applications'].push(newApplication);
          json['profiles']['profiles'].push(newProfile);

          let updatedFile = Buffer.from(JSON.stringify(json));

          db.run('UPDATE DATA SET FILE = ?', updatedFile, function (err) {
            if (err) reject(err);
            if (fromCli) {
              console.info(`Profile for <${name}> added successfully`);
              console.info(`Game path: <${applicationPath}>`);
              console.info(`Poster path: <${posterPath}>`);
              resolve();
            }
          });
        } else {
          if (fromCli) {
            console.error(`Entry for <${applicationPath}> already existed.`);
            process.exit(1);
          }
          reject();
        }
      });
    });
  });

};

const removeApp = ({ applicationPath, fromCli }) => {
  return new Promise((resolve, reject)=>{
    db.serialize(function () {
      db.all('select * from DATA', function (err, dataArr) {
        let file = dataArr[0]['FILE'];
        let json = JSON.parse(file);
        let applications = json['applications']['applications'];
        let profiles = json['profiles']['profiles'];

        let removedApps = [];

        /**
         * Remove applications and record their IDs
         */
        for (let i = applications.length - 1; i >= 0; i--) {
          if (applications[i]['applicationPath'] === applicationPath) {
            removedApps.push(applications[i]['id']);
            applications.splice(i, 1);
          }
        }

        /**
         * Remove unlinked profiles of the deleted Applications
         */
        for (let i = profiles.length - 1; i >= 0; i--) {
          if (removedApps.indexOf(profiles[i]['applicationId'])>=0) {
            removedApps.push(applications[i]['id']);
            profiles.splice(i, 1);
          }
        }

        if (removedApps.length){
          let updatedFile = Buffer.from(JSON.stringify(json));

          db.run('UPDATE DATA SET FILE = ?', updatedFile, function (err) {
            if (err) reject(err);
            resolve();
            if (fromCli){
              console.log(`Profiles for <${applicationPath}> have been removed.`);
            }
          });
        } else {
          reject('No matching applications found.');
          if (fromCli){
            console.error('No matching applications found.');
            process.exit(1);
          }
        }

      });
    });
  });
};

const cli = () => {
  // eslint-disable-next-line no-unused-vars
  return yargs(hideBin(process.argv))
    .command(
      'add-app',
      'add a new profile to G Hub',
      (y) => {
        return y
          .option('app-path', {
            type: 'string',
            description: 'The absolute path of target application',
            required: true,
          })
          .option('poster-path', {
            type: 'string',
            description: 'The absolute path of local image file',
            required: true,
          })
          .option('name', {
            type: 'string',
            description: 'The name of target application',
          });
      },
      (argv) => {
        addApp({
          fromCli: true,
          applicationPath: argv['app-path'],
          name: argv['name'],
          posterPath: argv['poster-path'],
        });
      }
    )
    .command(
      'remove-app',
      'remove a profile from G Hub using app path',
      (y) => {
        return y.option('app-path', {
          type: 'string',
          description: 'The absolute path of target application',
          required: true,
        });
      },
      (argv) => {
        removeApp({ applicationPath: argv['app-path'], fromCli: true });
      }
    )
    .demandCommand(1, 1, 'Please select a command from above.')
    .help()
    .locale('en-us').argv;
};

module.exports = { cli, addApp, removeApp };
