const {app, BrowserWindow, screen, Tray, Menu, nativeImage, globalShortcut, Main, ipcMain } = require('electron');
const path = require("path");
const { defaultApp } = require('process');
const exec = require('child_process').execFile;
const fs = require('fs');

const appName = "GameLauncher";
const iconPath = 'frontend/assets/img/icon.png';

var win;
var win_settings;
var win_addGame;
var trayIcon;
var tray;

function init() {
  createWindow();
  registerShortcut();
  createTray();
}

function shutdown() {
  hideWindow();
  tray.destroy();
  globalShortcut.unregisterAll();
  app.quit();
}

function createWindow () {
  win = new BrowserWindow({
    show: false,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });
  let currentScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  win.setBounds(currentScreen.bounds);
  win.loadFile('frontend/index.html');

  win.webContents.on('before-input-event', (event, input) => {
    if (input.key.toLowerCase() === 'escape') {
      hideWindow();
      event.preventDefault();
    }
  });
}

function showWindow() {
  let currentScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  win.setBounds(currentScreen.bounds);
  win.show();
}

function hideWindow() {
  win.hide();
}

function createTray() {
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { type: 'normal', enabled: false, icon: nativeImage.createFromPath(iconPath).resize({width:16}), label: appName},
    { type: 'separator'},
    { label: 'Show ', type: 'normal', click: () => {showWindow()}},
    { label: 'Quit', type: 'normal', click: () => {shutdown()}},
    { type: 'separator'},
    { label: 'Settings ', type: 'normal', click: () => {openWindow_Settings()}},
    { type: 'separator'},
    { label: 'Exit Menu', type: 'normal'}
  ])
  tray.setToolTip(appName);
  tray.setContextMenu(contextMenu);
  tray.set
}

function registerShortcut() {
  globalShortcut.register('CmdOrCtrl+Alt+Z', () => {
    showWindow();
  });
}

app.whenReady().then(init);

// Windows
function openWindow_Settings() {
  if (win_settings != undefined && !win_settings.isDestroyed()) {
    win_settings.destroy();
  }
  win_settings = new BrowserWindow({
    skipTaskbar: true,
    show: false,
    width: 600,
    height: 700,
    parent: win,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });
  win_settings.loadFile("frontend/settings.html");
  win_settings.setTitle(appName + " Settings");
  win_settings.once('ready-to-show', () => {
    win_settings.show()
  });
}

function openWindow_Add_app() {
  if (win_addGame != undefined && !win_addGame.isDestroyed()) {
    win_addGame.destroy();
  }
  win_addGame = new BrowserWindow({
    skipTaskbar: true,
    show: false,
    width: 400,
    height: 400,
    parent: win,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  });
  win_addGame.loadFile("frontend/add_app.html");
  win_addGame.once('ready-to-show', () => {
    win_addGame.show()
  });
}
function closeWindow_Settings(){
  if(!win_settings.isDestroyed()){
    win_settings.destroy();
  }
}
function closeWindow_Add_app(){
  if(!win_addGame.isDestroyed()){
    win_addGame.destroy();
  }
}

app.on('browser-window-blur', () => {
  if (win != null && win != undefined && !win.isDestroyed()){
    if (!win.isFocused()) {
      if (win_settings != undefined && !win_settings.isDestroyed()) {
        if (win_settings.isFocused()) {
          return;
        }
      }
      if (win_addGame != undefined && !win_addGame.isDestroyed()) {
        if (win_addGame.isFocused()) {
          return;
        }
      }
      hideWindow();
    }
  }
});

class LauncherApp {
  constructor(name, path) {
    this.name = name;
    this.path = path;
  }
  save() {
    var content = [];

    fs.readFile('data/data.json', 'utf8' , (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      if(data != "" && data != null){
        var apps = JSON.parse(data);
        content = apps;
        content.push(this);
      }
      else{
        content.push(this);
      }
      content = JSON.stringify(content);
      fs.writeFile('data/data.json', content, err => {
        if (err) {
          console.error(err)
          return
        }
      })
    })
  }
  del() {
    var content = [];

    fs.readFile('data/data.json', 'utf8' , (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      if(data != "" && data != null){
        var apps = JSON.parse(data);
        var pos;
        apps.forEach((app, i) => {
          if(JSON.stringify(app) == JSON.stringify(this)){
            pos = i;
          }
        });
        if(pos == undefined || pos == null || pos == -1){
          console.log("pos: " + pos);
          return
        }
        else{
          apps.splice(pos, 1);
          content = apps;
          content = JSON.stringify(content);
          fs.writeFile('data/data.json', content, err => {
            if (err) {
              console.error(err)
              return
            }
          })
        }
      }
      else{
        return
      }
      
    })
  }
}

function getApps(){
  fs.readFile('data/data.json', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    if(data != "" && data != null){
      return JSON.parse(data);
    }
  })
}

ipcMain.on("toMain", (event, command) => {
  args = command.split(' ');
  if (args.length > 0) {
    switch(args[0]){
      case 'openWindow':
        if (args.length > 1) {
          if (args[1] == "settings") {
            openWindow_Settings();
          }
          else if (args[1] == "add_app") {
            openWindow_Add_app();
          }
        }
        break;
      case 'closeWindow':
      if (args.length > 1) {
        if (args[1] == "settings") {
          closeWindow_Settings();
        }
        else if (args[1] == "add_app") {
          closeWindow_Add_app();
        }
      }
      break;
      case 'DataMgr':
      if (args.length > 2) {
        if (args[1] == "saveapp") {
          new LauncherApp(args[2].split(";")[0], args[2].split(";")[1]).save(); //First Name then Path
          closeWindow_Add_app();
        }
        else if (args[1] == "delapp") {
          new LauncherApp(args[2].split(";")[0], args[2].split(";")[1]).del();
        }
        else if (args[1] == "getapps") {
          event.reply("asynchronous-reply", "replyApps;" + JSON.stringify(getApps()));
        }
      }
      break;
      case 'Execute':
      if (args.length > 1) {
        exec(args[1]);
      }
      break;
      default: console.log("Unkwown Command in Messaging");
    }
  }
});