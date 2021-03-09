const {  app, BrowserWindow, screen, Tray, Menu, nativeImage, globalShortcut } = require('electron');

const appName = "GameLauncher";
const iconPath = 'frontend/assets/img/icon.png';

var win;
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
      nodeIntegration: true,
      contextIsolation: true
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
    { label: 'Exit Menu', type: 'normal' },
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