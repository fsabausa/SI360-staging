
const electron = require('electron');
const {ipcMain} = require('electron');

const url = require('url');
const path = require('path');
const{app,BrowserWindow} = electron;
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
let win;
let hasAvailableUpdate = false;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function createWindow(){
    
    win = new BrowserWindow({
        title:"Parent", 
        title :"MainForm",
        useContentSize: true,
        center: true,
        resizable: false,
        fullscreen: true,
        frame: false,
        width:1280,
        height:720 ,
        webPreferences: {
          nodeIntegration: true
        }
    });
    win.loadURL(url.format({
        pathname:path.join(__dirname,"dist/sipos/index.html"),
        protocol:"file",
        slashes:true
    }))     
 /*    win.webContents.openDevTools();  */
    win.on("closed" , () => {
        win = null
    })
    autoUpdater.checkForUpdatesAndNotify();

setInterval(() => {
    console.log(hasAvailableUpdate);
    if(hasAvailableUpdate == false) {
        console.log('inside ' + hasAvailableUpdate);
        autoUpdater.checkForUpdatesAndNotify();
    }
}, 1000);
}

function checkForUpdates(){
    if(hasAvailableUpdate == false) {
        
    }
}



const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

if (isSecondInstance) {
    app.quit()
}
  
ipcMain.on('close-me', (evt, arg) => {
    app.quit()
  })

app.on('ready',createWindow);

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin'){
      app.quit();
  }
});

app.on('activate', () => {
  if(win ===null){
      createWindow();
  }
})


exports.CloseApp =() =>{
app.quit();
}

ipcMain.on('app_version', (event) => {
event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('download-progress', (progressObj) => {
/*     let log_message = "Download speed: " + bytesToSize(progressObj.bytesPerSecond); */
    let _progressPercentage = progressObj.percent;
    let log_message = 'Downloaded ' + Math.round(_progressPercentage) + '%';
    log_message = log_message + ' (' + bytesToSize(progressObj.transferred) + "/" + bytesToSize(progressObj.total) + ')';
    let convertedToInt = parseInt(progressObj.percent);
    sendStatusToWindow(log_message, convertedToInt);
});

function sendStatusToWindow(text,progressBarValue) {
    log.info(text);
    win.webContents.send('message', text);
    win.webContents.send('ProgressBar', progressBarValue);
}
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('update-available', () => {
    hasAvailableUpdate = true;
    win.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
    hasAvailableUpdate = false;
    win.webContents.send('update_downloaded');
});

/* autoUpdater.setFeedURL({
    provider: 'github',
    repo: 'SI360-PreRelease.git',
    owner: 'fsaba0818',
    private: true,
    token: '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'
}) */

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }