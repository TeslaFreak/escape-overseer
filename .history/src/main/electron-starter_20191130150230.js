const electron = require('electron');
const chargebee = require("chargebee");
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
let loginWindow = null;
let liveWindow = null;
let videoWindow = null;
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

ipcMain.on("toggleLiveViewOpen", (event, selectedRoomId, args) => {
    if (liveWindow == null) {
        liveWindow = new BrowserWindow({width: 800, height: 600, show: false});
        const startUrl = process.env.ELECTRON_START_URL || "http://localhost:3000/live"
        liveWindow.loadURL(startUrl);
        liveWindow.webContents.openDevTools();
        liveWindow.setMenu(null);
        liveWindow.once('ready-to-show', () => {
            liveWindow.webContents.send('updateSelectedRoomId', selectedRoomId);
            liveWindow.show();
            
                
        })
        liveWindow.on('closed', () => {
            liveWindow = null;
            mainWindow.webContents.send('liveViewClosedManually')
        });
    }
    else {
        liveWindow.close();
    }
    
});

ipcMain.on("attemptLogin", (event, username, password) => {
    console.log('login recieved');
    if(loginWindow != null) {
        if(username != '' && password != '') {
            loginWindow.close();
            createAppWindow();
        }
        else {
            console.log('sending response');
            loginWindow.webContents.send('loginAttemptFailed', 'Bad username or password');
        }
    }
});

ipcMain.on("roomSequence", (event, sequenceNodeId) => {
    if(liveWindow != null) {
        liveWindow.webContents.send('roomSequence', sequenceNodeId);
    }
});

ipcMain.on("toggleLiveViewFullScreen", (event, args) => {
    if(liveWindow != null) {
        liveWindow.setFullScreen(!liveWindow.isFullScreen());
    }
});

ipcMain.on('updateLiveViewTimeDisplay', (event, min, sec, millisec) => {
    if (liveWindow != null) {
        liveWindow.webContents.send('updateLiveViewTimeDisplay', min, sec, millisec);
    }
});

ipcMain.on('updateLiveViewClueDisplay', (event, clue) => {
    if (liveWindow != null) {
        liveWindow.webContents.send('updateLiveViewClueDisplay', clue);
    }
});

ipcMain.on('updateLiveViewClueCountDisplay', (event, usedStatus) => {
    if (liveWindow != null) {
        liveWindow.webContents.send('updateLiveViewClueCountDisplay', usedStatus);
    }
});

ipcMain.on('updateLiveViewSelectedRoomId', (event, newRoomId) => {
    if (liveWindow != null) {
        liveWindow.webContents.send('updateSelectedRoomId', newRoomId);
    }
});

ipcMain.on('playVideoFullscreen', (event) => {
    if (videoWindow == null) {
        playFullscreenVideo();
    }
});



function createAppWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || "http://localhost:3000/control"
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

function createLoginWindow() {
    // Create the browser window.
    loginWindow = new BrowserWindow({width: 475, height: 600, resizable: true, titleBarStyle: 'hidden'});

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || "http://localhost:3000/login"
    loginWindow.loadURL(startUrl);
    loginWindow.once('ready-to-show', () => {
        loginWindow.show()
      })

    // Open the DevTools.
    loginWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    loginWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        loginWindow = null
    })
}

function playFullscreenVideo() {
    // Create the browser window.
    videoWindow = new BrowserWindow({fullscreen: true, frame: false});

    // and load the index.html of the app.
    const url = "http://localhost:3000/fullscreenvideo"
    videoWindow.loadURL(url);
    videoWindow.once('ready-to-show', () => {
        videoWindow.show()
      })

    // Open the DevTools.
    //videoWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    videoWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        videoWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createLoginWindow);

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
        createLoginWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
