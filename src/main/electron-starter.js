const electron = require('electron');
const { ipcMain } = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
let liveWindow = null;

ipcMain.on("toggleLiveViewOpen", (event, args) => {
    if (liveWindow == null) {
        liveWindow = new BrowserWindow({width: 800, height: 600});
        const startUrl = process.env.ELECTRON_START_URL || "http://localhost:3000?live"
        liveWindow.loadURL(startUrl);
        liveWindow.webContents.openDevTools();
        liveWindow.setMenu(null);
        liveWindow.once('ready-to-show', () => {
            liveWindow.show()
        })
        liveWindow.on('closed', () => {
            liveWindow = null;
        });
    }
    else {
        liveWindow.close();
    }
    
});

ipcMain.on("toggleLiveViewFullScreen", (event, args) => {
    if(liveWindow != null) {
        liveWindow.setFullScreen(!liveWindow.isFullScreen());
    }
});

ipcMain.on('updateLiveViewTimeDisplay', (event, min, sec) => {
    if (liveWindow != null) {
        liveWindow.webContents.send('updateLiveViewTimeDisplay', min, sec);
    }
});

ipcMain.on('updateLiveViewClueDisplay', (event, clue) => {
    if (liveWindow != null) {
        liveWindow.webContents.send('updateLiveViewClueDisplay', clue);
    }
});

ipcMain.on('updateLiveViewClueCountDisplay', (event, clue1Used, clue2Used, clue3Used) => {
    if (liveWindow != null) {
        liveWindow.webContents.send('updateLiveViewClueCountDisplay', clue1Used, clue2Used, clue3Used);
    }
});

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || "http://localhost:3000?control"
    mainWindow.loadURL(startUrl);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
      })

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.