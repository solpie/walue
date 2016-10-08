import {WebServer} from "./Server";
import {ServerConf} from "./Env";

const {app, BrowserWindow, ipcMain} = require('electron');
// if (process.platform == 'win32')
//     process.env['VLC_PLUGIN_PATH'] = require('path').join(__dirname, 'node_modules/wcjs-prebuilt/bin/plugins');
// process.env['VLC_PLUGIN_PATH'] = 'D:\\projects\\walue\\node_modules\\webchimera.js\\plugins';
// process.env['VLC_PLUGIN_PATH'] = 'D:\\projects\\walue\\node_modules\\wcjs-prebuilt\\bin\\plugins';

console.log(process.execPath);
var win: any;
var webServer: any;
function onReady() {
    initEnv(()=> {
        if (ServerConf.isDev)
            process.env['VLC_PLUGIN_PATH'] = '.\\node_modules\\wcjs-prebuilt\\bin\\plugins';
        else
            process.env['VLC_PLUGIN_PATH'] = require('path').join(process.execPath, 'resources\\app\\node_modules\\wcjs-prebuilt\\plugins');
        console.log("VLC_PLUGIN_PATH:1 ", process.env['VLC_PLUGIN_PATH']);
        if (!ServerConf.isClient)
            webServer = new WebServer(openWin);
    });
}

function initEnv(callback) {
    var fs = require('fs');
    fs.readFile('resources/app/package.json', (err: any, data: any)=> {
        if (err) throw err;
        var process = require("process");
        var packageJson: any = JSON.parse(data);
        ServerConf.port = packageJson['conf'].port;
        ServerConf.wsPort = packageJson['conf'].wsPort;
        ServerConf.host = packageJson['conf'].host;
        ServerConf.isClient = Boolean(packageJson['conf'].client);
        ServerConf.isDev = process.defaultApp || /[\\/]project[\\/]/.test(process.execPath);
        console.log("server config:", ServerConf);
        if (callback)
            callback();
    });
}
function openServer() {
    webServer = new BrowserWindow({
        // width: 1600, height: 900,
        width: 500, height: 540,
        resizable: false,
        frame: true,
        autoHideMenuBar: false,
        webaudio: false
    });
    webServer.setMenuBarVisibility(false);
    webServer.loadURL('file:///resources/app/server.html');
    webServer.toggleDevTools({mode: 'detach'});
}
function openWin(serverConf?: any) {
    var sender;
    ipcMain.on('open-devtool', (event: any, status: any) => {
        win.toggleDevTools({mode: 'detach'});
    });

    ipcMain.on('devWatch', (event: any, arg: any) => {
        sender = event.sender;
    });

    win = new BrowserWindow({
        width: 1600, height: 900,
        // width: 500, height: 540,
        resizable: false,
        frame: true,
        autoHideMenuBar: false,
        webaudio: false
    });
    // win.setMenu(null);
    win.setMenuBarVisibility(false);
    // win.loadURL('file:///resources/app/reload.html');
    // win.loadURL('file:///resources/app/monitor.html');
    win.loadURL('file:///resources/app/index.html');
    // win.loadURL('file:///resources/app/view/monitor/index.ejs');
    if (ServerConf.isDev)
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
        // onReady();
    }
});