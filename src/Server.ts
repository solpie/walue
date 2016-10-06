import {ServerConf} from "./Env";
import {monitorRouter} from "./router/MonitorRouter";

var dataObj: any;
/**
 * WebServer
 */
export class WebServer {
    serverConf: any;
    // socketIO: SocketIOSrv;
    _onSetupCallback;

    constructor(callback?: any) {
        this._onSetupCallback = callback;
        this.initEnv();
        this.initNedb();
        this.test();
    }

    test() {
    }

    initNedb() {
        // initDB();
    }


    initEnv(callback?: any) {
        var process = require("process");
        ServerConf.isDev = process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath);
        console.log(process.execPath, ServerConf.isDev);
        var fs = require('fs');
        fs.readFile('resources/app/package.json', (err: any, data: any)=> {
            if (err) throw err;
            dataObj = JSON.parse(data);
            ServerConf.port = dataObj.server.port;
            ServerConf.wsPort = dataObj.server.wsPort;
            ServerConf.host = dataObj.server.host;
            this.initServer();
            // }
            this.serverConf = ServerConf;
            console.log("server config:", ServerConf);
            if (callback)
                callback(dataObj);
        });
    }

    initServer() {
        var express: any = require('express');
        var app = express();
        // view engine setup
        app.set('views', "./resources/app/view");
        app.set('view engine', 'ejs');

        app.use(express.static("./resources/app/static"));//
        // app.use('/static', express.static(_path("./app/static")));//
        app.use(express.static("./resources/app/db"));//

        // var urlencodedParser = bodyParser.urlencoded({
        //     extended: false
        //     , limit: '55mb'
        // });
        // var morgan = require('morgan');
        // app.use(morgan('dev'));                     // log every request to the console
        var bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({extended: false, limit: '55mb'}));// create application/x-www-form-urlencoded parser
        app.use(bodyParser.json({limit: '50mb'}));


        app.all("*", function (req: any, res: any, next: any) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            if (req.method == 'OPTIONS') {
                res.send(200);
            } else {
                next();
            }
        });


        app.get('/', function (req: any, res: any) {
            res.redirect('/monitor');
        });

        app.use('/monitor', monitorRouter);
        // app.use('/panel', panelRouter);
        // app.use('/db', dbRouter);
        // app.use('/m', mobileRouter);
        // app.use('/dmk', dmkRouter);

        app.listen(ServerConf.port, () => {
            this.initSocketIO();
            if (this._onSetupCallback)
                this._onSetupCallback();
            // this.initRtmpServer();
            //and... we're live
            console.log("server on:  ws port:");
        });
    }

    initSocketIO() {
        // this.socketIO = new SocketIOSrv();
    }
}
// export var webServer = new WebServer();