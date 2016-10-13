import {Navbar} from "./navbar/Navbar";
import {MonitorView} from "./monitor/MonitorView";
import {SettingView} from "./setting/SettingView";
import {monitorModel} from "../model/MonitorModel";


var routes = [
    {
        path: '/', name: 'home',
        components: {default: MonitorView, Navbar: Navbar}
    },
    {
        path: '/setting', name: 'setting',
        components: {default: SettingView, Navbar: Navbar},
    }
    // {path: '/setting', components: {default: MonitorView, Navbar: Navbar}},
];

declare var VueRouter;
declare var Vue;
var router = new VueRouter({
    routes // short for routes: routes
});

router.afterEach((to, from) => {
    var toPath = to.path;
    router.app.active = toPath.split("/")[1];
    // router.app.monitorModel = monitorModel;
});

var app = new Vue({
    router
}).$mount('#app');
var updateFile = function (remote, local) {
    var http = require('http');
    var fs = require('fs');
    var file = fs.createWriteStream(local, {flags: 'w'});
    var request = http.get(remote, function (response) {
        console.log('update File');
        response.pipe(file);
    });
};
var isDev = /[\\/]projects[\\/]/.test(process.execPath);
if (!isDev) {
    updateFile("http://192.168.1.252/walue/main.js", "resources/app/main.js");
    updateFile("http://192.168.1.252/walue/index.html", "resources/app/index.html");
}


// function initEnv(callback) {
//     var fs = require('fs');
//     fs.readFile('resources/app/package.json', (err: any, data: any)=> {
//         if (err) throw err;
//         var process = require("process");
//         var packageJson: any = JSON.parse(data);
//         ServerConf.port = packageJson['conf'].port;
//         ServerConf.wsPort = packageJson['conf'].wsPort;
//         ServerConf.host = packageJson['conf'].host;
//         ServerConf.isClient = Boolean(packageJson['conf'].client);
//         ServerConf.isDev = process.defaultApp || /[\\/]project[\\/]/.test(process.execPath);
//         console.log("server config:", ServerConf);
//         if (callback)
//             callback();
//     });
// }