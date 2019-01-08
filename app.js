const {app, BrowserWindow} = require('electron');

/**
 * Happy?
 */
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600});
  win.webContents.openDevTools();
  win.setMenu(null);

  // and load the index.html of the app.
  win.loadFile('index.html');
}

app.on('ready', createWindow);
