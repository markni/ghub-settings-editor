# ghub-settings-editor

Having a PC game pass (Xbox game pass PC) game you can't add to Logitech G HUB due to permission errors? This little tool can help. 

> Disclaimer: This is only for Windows PC and you will have to find out the path of executable file of the app on your own. Always shut down G Hub before running this script and always backup `C:\Users\your_username\AppData\Local\LGHUB\settings.db` beforehand.

## Before you start

Download and install [Node.js](https://nodejs.org/en/) if you haven't.

## Usage as a CLI tool
You run these commands in cmd or powershell, search them in Windows start menu!

### Installation

```
npm install -g https://github.com/markni/ghub-settings-editor
```

### Add a custom application:
```
ghub add-app --app-path 'C:\WindowsApps\Microsoft.254428597CFE2_1.3266.27842.0_x64__8wekyb3d8bbwe\HaloInfinite.exe' --name 'Halo Infinite' --poster-path 'F:\Posters\halo_infinite_poster.jpg'
```

### Remove a custom application:
```
ghub remove-app --app-path 'C:\WindowsApps\Microsoft.254428597CFE2_1.3266.27842.0_x64__8wekyb3d8bbwe\HaloInfinite.exe'
```

## Usage as a node module
### Installation

```
npm install https://github.com/markni/ghub-settings-editor --save
```

### Usage
```node
const ghub = require('ghub-settings-editor');
ghub.add({applicationPath:'C:\\\\WindowsApps\\\\Microsoft.254428597CFE2_1.3266.27842.0_x64__8wekyb3d8bbwe\\\\HaloInfinite.exe', name:'Halo Infinite', posterPath: 'F:\Posters\halo_infinite_poster.jpg'});
ghub.remove({applicationPath:'C:\\\\WindowsApps\\\\Microsoft.254428597CFE2_1.3266.27842.0_x64__8wekyb3d8bbwe\\\\HaloInfinite.exe'});
```

## Notes

This script is inspired by a manual solution provided by reddit user [baseball-is-praxis
](https://www.reddit.com/r/LogitechG/comments/qdab4s/comment/hi341nm/)