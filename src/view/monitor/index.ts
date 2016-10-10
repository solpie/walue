import {monitor} from "./MonitorView";
import {ServerConf} from "../../Env";
import {WebServer} from "../../Server";
import {MonitorModel} from "../../model/MonitorModel";
var Bar = {template: '<div>bar</div>'};

var routes = [
    {path: '/', component: monitor},
    {path: '/bar', component: Bar}
];
declare var VueRouter;
declare var Vue;
var router = new VueRouter({
    routes // short for routes: routes
});


var webServer;


var app = new Vue({
    router
}).$mount('#app');
// initEnv(()=> {
//     webServer = new WebServer(()=> {
//         var app = new Vue({
//             router
//         }).$mount('#app');
//     });
// });


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