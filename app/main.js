const { app, BrowserWindow } = require('electron')

var win;
function createWindow () {
  win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true
    }
  })
  
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
    win.webContents.executeJavaScript("document.getElementById('status').style.display = 'block';");
  }
})
function excode(){
  fs = require('fs')
  fs.readFile('assets/apps.json', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    if(data != "" || data != null){
      console.log(JSON.parse(data));
    }
  });
  win.webContents.executeJavaScript("console.log('test');");
}
// const saveapp = {
//   path: "E:/Games"
// }
// fs.writeFile('assets/apps.json', JSON.stringify(saveapp), function (err) {
//   if (err) return console.log(err);
//   win.webContents.executeJavaScript("console.log('test');");
// });
