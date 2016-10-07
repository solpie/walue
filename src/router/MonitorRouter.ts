import {RoomInfo} from "../model/RoomInfo";
import {AccountInfo} from "../model/AccountInfo";
export var monitorRouter = require('express').Router();


var accountInfo = new AccountInfo();

monitorRouter.get('/', function (req, res) {
    res.render('monitor/index');
});


monitorRouter.get('/account', function (req, res) {
    console.log(req);
    res.send({accountArr: accountInfo.accountArr});
});

monitorRouter.get('/room', function (req, res) {
    console.log('roomArr');
    // var roomArr = ['rtmp://huputv-ws-live.arenacdn.com/prod/NvS4rQzyGQDWEJLi_1000',
    //     'rtmp://huputv-ws-live.arenacdn.com/prod/NvS4rQzyGQDWEJLi_1000'];
    var roomArr = [];
    var roomInfo;
    roomInfo = new RoomInfo;
    roomInfo.title = 'test';
    roomInfo.mc = 'mc1';
    roomInfo.rtmp = 'rtmp://huputv-ws-live.arenacdn.com/prod/NvS4rQzyGQDWEJLi_1000';
    roomArr.push(roomInfo);

    roomInfo = new RoomInfo;
    roomInfo.title = 'local test';
    roomInfo.mc = 'mp4';
    roomInfo.rtmp = 'file:///D:/test.mp4';
    roomArr.push(roomInfo);

    roomInfo = new RoomInfo;
    roomInfo.title = 'local test';
    roomInfo.mc = 'flv';
    roomInfo.rtmp = 'file:///D:/testflv.flv';
    roomArr.push(roomInfo);

    res.send({roomArr: roomArr, accountArr: accountInfo.accountArr});
});
