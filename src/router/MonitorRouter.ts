import {RoomInfo} from "../model/RoomInfo";
export var monitorRouter = require('express').Router();

monitorRouter.get('/', function (req, res) {
    res.render('monitor/index');
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
    roomInfo.rtmp = 'file://test.mp4';
    roomArr.push(roomInfo);
    res.send({roomArr: roomArr});
});
