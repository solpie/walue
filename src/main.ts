const {app, BrowserWindow, ipcMain} = require('electron');
// if (process.platform == 'win32')
//     process.env['VLC_PLUGIN_PATH'] = require('path').join(__dirname, 'node_modules/wcjs-prebuilt/bin/plugins');
// process.env['VLC_PLUGIN_PATH'] = 'D:\\projects\\walue\\node_modules\\webchimera.js\\plugins';
// process.env['VLC_PLUGIN_PATH'] = 'D:\\projects\\walue\\node_modules\\wcjs-prebuilt\\bin\\plugins';
var path = require('path');
console.log(process.execPath);
console.log('root:',path.join(process.execPath,'../../../..'));
console.log('updateFile:',path.join(process.execPath, '../../../../update.zip'));
var win: any;
var isDev;
isDev = /[\\/]projects[\\/]/.test(process.execPath);
// isDev = false;
var conf = {width: 1600, height: 900};
function onReady() {
    process.env['VLC_PLUGIN_PATH'] = '.\\node_modules\\wcjs-prebuilt\\bin\\plugins';
    // else
    //     process.env['VLC_PLUGIN_PATH'] = require('path').join(process.execPath, '..\\..\\..\\wcjs-prebuilt\\plugins');
    console.log("VLC_PLUGIN_PATH:1 ", process.env['VLC_PLUGIN_PATH']);
    // process.env['VLC_PLUGIN_PATH'] = require('path').join(process.execPath, 'resources\\app\\node_modules\\wcjs-prebuilt\\plugins');
    console.log('onReady');
    openWin();
}

function openWin(serverConf?: any) {
    win = new BrowserWindow({
        width: 1600, height: 1000,
        // width: 500, height: 540,
        frame: true,
        autoHideMenuBar: false,
        webaudio: false
    });
    // win.setMenu(null);
    win.setMenuBarVisibility(false);
    win.loadURL('file:///resources/app/index.html');
    if (isDev)
        win.toggleDevTools({mode: 'detach'});
    // win.loadURL(`file:///app/reload.html`);
    win.on('closed', function () {
        win = null;
    });
}

app.on('ready', onReady);
app.on('window-all-closed', ()=> {
    console.log('window-all-closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (win === null) {
    }
});