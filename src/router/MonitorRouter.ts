import {RoomInfo} from "../model/RoomInfo";
import {AccountInfo} from "../model/AccountInfo";
import {Danmaku, packDmk} from "../model/DmkInfo";
export var monitorRouter = require('express').Router();


var accountInfo = new AccountInfo();

monitorRouter.get('/', function (req, res) {
    res.render('monitor/index');
});

monitorRouter.post(`/login`, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    var param = req.body;
    var ac = param.ac;
    var pw = param.pw;
    accountInfo.login(ac, pw);
    res.send({accountArr: accountInfo.accountArr});
});

monitorRouter.post(`/dmk`, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    var param = req.body;
    var chat = param.chat;

    res.sendStatus({msg: packDmk(param.content, param.user)});
});


monitorRouter.get('/account', function (req, res) {
    console.log(req);
    res.send({accountArr: accountInfo.accountArr});
});

monitorRouter.get('/room', function (req, res) {
    console.log('roomArr');
    var roomArr = [];
    var roomInfo;


    var unirest = require('unirest');
    unirest.post('https://api.weilutv.com/1/topic/56/live/live_list')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .end(function (response) {
            console.log(response.body);
            var lives = response.body.result.lives;
            var hasMore = response.body.result.cursor.hasMore;
            var cursor = response.body.result.cursor.cursor;
            if (response.body.success) {
                for (var i = 0; i < lives.length; i++) {
                    var obj = lives[i];
                    // console.log(lives[0]);
                    roomInfo = new RoomInfo;
                    roomInfo.chat = obj.chat;
                    roomInfo.title = obj.topic.content;
                    roomInfo.mc = obj.user.displayName;
                    roomInfo.rtmp = obj.playUrl;
                    roomArr.push(roomInfo);
                }
            }
            else throw "get /room failed";
            //test
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
    // { success: true,
    //     result:
    //     { cursor: { cursor: '115:15130f3e367e2469f67baa', hasMore: false },
    //         lives: [ [Object], [Object], [Object], [Object], [Object] ] } }
    // var roomArr = ['rtmp://huputv-ws-live.arenacdn.com/prod/NvS4rQzyGQDWEJLi_1000',
    //     'rtmp://huputv-ws-live.arenacdn.com/prod/NvS4rQzyGQDWEJLi_1000'];


});
