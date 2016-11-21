import {AccountInfo} from "../model/AccountInfo";
import {packDmk} from "../model/DmkInfo";
import {RoomInfo} from "../model/RoomInfo";
import {TopicInfo} from "../model/TopicInfo";
export var monitorRouter = require('express').Router();

var unirest = require('unirest');

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
    res.send({accountArr: accountInfo.userArr});
});

monitorRouter.post(`/dmk`, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    var param = req.body;
    var chat = param.chat;

    res.sendStatus({msg: packDmk(param.content, param.user)});
});


monitorRouter.get('/account', function (req, res) {
    console.log(req);
    res.send({accountArr: accountInfo.userArr});
});


monitorRouter.get('/topic', function (req, res) {
    getTopic((topicInfoArr)=> {
        res.send({topicArr: topicInfoArr});
    });
});

var getTopic = (callback?, cursor?, topicArrPre?)=> {
    var topicArr = [];
    if (topicArrPre)
        topicArr = topicArr.concat(topicArrPre);
    unirest.post('http://api.weilutv.com/1/topic/list')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send({cursor: cursor})
        .end((res1)=> {
            console.log(res1.body);
            var topics = res1.body.result.topics;
            var hasMore = res1.body.result.cursor.hasMore;
            var cursor = res1.body.result.cursor;
            if (res1.body.success) {
                // console.log(topics[0]);
                for (var i = 0; i < topics.length; i++) {
                    var obj = topics[i];
                    var topicInfo = new TopicInfo();
                    topicInfo.id = obj.id;
                    topicInfo.topic = obj.content;
                    topicInfo.liveCount = obj.count.live;
                    topicInfo.viewCount = obj.count.view;
                    topicInfo.hasActiveLive = obj.hasActiveLive;
                    console.log('hasActiveLive', topicInfo.hasActiveLive, topicInfo.id);
                    topicArr.push(topicInfo);
                    // console.log('id', obj.id, 'content:', obj.content);
                }
                if (hasMore) {
                    getTopic(callback, cursor, topicArr);
                }
                else {
                    if (callback)
                        callback(topicArr)
                }
            }
            else throw "get /1/topic/list failed";
        });
};
var getLive = (topicId, callback?)=> {
    var roomArr = [];
    var roomInfo;
    var liveUrl = `https://api.weilutv.com/1/topic/${topicId}/live/live_list`;
    console.log(liveUrl);
    unirest.post(liveUrl)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .end((res2)=> {
            // console.log(res2.body);
            if (res2.body.success) {
                var lives = res2.body.result.lives;
                var hasMore = res2.body.result.cursor.hasMore;
                var cursor = res2.body.result.cursor.cursor;
                for (var j = 0; j < lives.length; j++) {
                    var liveObj = lives[j];
                    roomInfo = new RoomInfo;
                    roomInfo.chat = liveObj.chat;
                    roomInfo.title = liveObj.topic.content;
                    roomInfo.mc = liveObj.user.displayName;
                    roomInfo.rtmp = liveObj.playUrl;
                    roomArr.push(roomInfo);
                }
                if (callback)
                    callback(roomArr);
            }
            else throw "get /live_list failed";
        });
};

monitorRouter.post('/live', function (req, res) {
    getLive(req.body.topicId, (roomArr)=> {
        res.send({roomArr: roomArr});
    });
});

monitorRouter.get('/room', function (req, res) {
    console.log('roomArr');
    var roomArr = [];
    var roomInfo;
    // Yuki 15:17:48
    // POST https://api.weilutv.com/1/topic/{$topicId}/live/live_list
    // {
    //     cursor?: 上次的cursor
    // }
    //
    // GET https://api.weilutv.com/1/live/{$liveId}
    //     里面给的playUrl就是播放地址，chat是弹幕服务器地址
    // getTopic();
    // unirest.post('http://api.weilutv.com/1/topic/list')
    //     .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
    //     .end(function (res1) {
    //         // console.log(res.body);
    //         var topics = res1.body.result.topics;
    //         if (res1.body.success) {
    //             console.log(topics[0]);
    //             for (var i = 0; i < topics.length; i++) {
    //                 var obj = topics[i];
    //                 unirest.post(`https://api.weilutv.com/1/topic/${obj.id}/live/live_list`)
    //                     .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
    //                     .end((res2)=> {
    //                         var lives = res2.body.result.lives;
    //                         var hasMore = res2.body.result.cursor.hasMore;
    //                         var cursor = res2.body.result.cursor.cursor;
    //                         for (var j = 0; j < lives.length; j++) {
    //                             var liveObj = lives[j];
    //                             roomInfo = new RoomInfo;
    //                             roomInfo.chat = liveObj.chat;
    //                             roomInfo.title = liveObj.topic.content;
    //                             roomInfo.mc = liveObj.user.displayName;
    //                             roomInfo.rtmp = liveObj.playUrl;
    //                             roomArr.push(roomInfo);
    //                         }
    //                     });
    //             }
    //         }
    //         else throw "get /room failed";
    //         //test
    //         // roomInfo = new RoomInfo;
    //         // roomInfo.title = 'test';
    //         // roomInfo.mc = 'mc1';
    //         // roomInfo.rtmp = 'rtmp://huputv-ws-live.arenacdn.com/prod/NvS4rQzyGQDWEJLi_1000';
    //         // roomArr.push(roomInfo);
    //         //
    //         // roomInfo = new RoomInfo;
    //         // roomInfo.title = 'local test';
    //         // roomInfo.mc = 'mp4';
    //         // roomInfo.rtmp = 'file:///D:/test.mp4';
    //         // roomArr.push(roomInfo);
    //         //
    //         // roomInfo = new RoomInfo;
    //         // roomInfo.title = 'local test';
    //         // roomInfo.mc = 'flv';
    //         // roomInfo.rtmp = 'file:///D:/testflv.flv';
    //         // roomArr.push(roomInfo);
    //         res.send({roomArr: roomArr, accountArr: accountInfo.accountArr});
    //     });


    // { success: true,
    //     result:
    //     { cursor: { cursor: '115:15130f3e367e2469f67baa', hasMore: false },
    //         lives: [ [Object], [Object], [Object], [Object], [Object] ] } }
    // var roomArr = ['rtmp://huputv-ws-live.arenacdn.com/prod/NvS4rQzyGQDWEJLi_1000',
    //     'rtmp://huputv-ws-live.arenacdn.com/prod/NvS4rQzyGQDWEJLi_1000'];

    res.send({roomArr: roomArr, accountArr: accountInfo.userArr});

});
