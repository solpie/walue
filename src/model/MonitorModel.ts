import {TopicInfo} from "./TopicInfo";
import {RoomInfo} from "./RoomInfo";
import {decodeMsg} from "./DmkInfo";
var unirest = require('unirest');
class SettingModel {
    isShowRecVideo: boolean = false;
}
var unzipUpdate = (updateFile)=> {
    var DecompressZip = require('decompress-zip');
    var unzipper = new DecompressZip(updateFile);

    unzipper.on('error', function (err) {
        console.log('Caught an error');
    });

    unzipper.on('extract', function (log) {
        console.log('Finished extracting');
    });

    unzipper.on('progress', function (fileIndex, fileCount) {
        console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
    });

    unzipper.extract({
        path: './',
        filter: function (file) {
            return file.type !== "SymbolicLink";
        }
    });
}

export class MonitorModel {
    settingModel;
    playerMap;
    wsMap;
    dmkArrMap;

    constructor() {
        this.settingModel = new SettingModel();
        this.playerMap = {};
        this.wsMap = {};
        this.dmkArrMap = {};
    }

    //连接弹幕服务器
    openChatWs(chatWsUrl, onMsgCallback) {
        var wsMap = this.wsMap;
        if (!wsMap[chatWsUrl]) {
            monitorModel.dmkArrMap[chatWsUrl] = "";
            wsMap[chatWsUrl] = new WebSocket(chatWsUrl);
            wsMap[chatWsUrl].binaryType = "arraybuffer";
            wsMap[chatWsUrl].onopen = function (evt) {
                console.log('websocket open');
            };
            wsMap[chatWsUrl].funcArr = [onMsgCallback];
            wsMap[chatWsUrl].onmessage = (evt)=> {
                var dmkContent = decodeMsg(evt.data);
                console.log("onWebSocketMsg", evt, dmkContent);
                if (dmkContent) {
                    monitorModel.dmkArrMap[chatWsUrl] += ":" + dmkContent + '\n';
                    for (var i = 0; i < wsMap[chatWsUrl].funcArr.length; i++) {
                        var func = wsMap[chatWsUrl].funcArr[i];
                        func(monitorModel.dmkArrMap[chatWsUrl]);
                    }
                }
            };
        }
        else {
            onMsgCallback(monitorModel.dmkArrMap[chatWsUrl]);
            wsMap[chatWsUrl].funcArr.push(onMsgCallback);
        }
    }

    getTopicLives(topicArr, callback) {
        var for1 = (idx, topicArr)=> {
            if (idx < topicArr.length) {
                monitorModel.getLive(topicArr[idx].id, (roomArr)=> {
                    topicArr[idx].roomArr = roomArr;
                    for (var k = 0; k < roomArr.length; k++) {
                        var roomInfo = roomArr[k];
                        var urlLen = roomInfo.rtmp.length;
                        roomInfo.shortUrl = roomInfo.rtmp.substr(0, 30)
                            + "..." + roomInfo.rtmp.substr(urlLen - 11, 11);
                    }
                    for1(idx + 1, topicArr);
                });
            }
            else {
                callback(topicArr);
            }
        };
        for1(0, topicArr);
    }

    getTopic(callback?, cursor?, topicArrPre?) {
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
                        topicInfo.topic = obj.title;
                        topicInfo.liveCount = obj.count.live;
                        topicInfo.videoCount = obj.count.video;
                        topicInfo.viewCount = obj.count.view;
                        topicInfo.hasActiveLive = obj.hasActiveLive;
                        // console.log('hasActiveLive', topicInfo.hasActiveLive, topicInfo.id);
                        topicArr.push(topicInfo);
                        // console.log('topic id', obj.id, obj);
                    }
                    // console.log("topic", obj);
                    if (hasMore) {
                        this.getTopic(callback, cursor, topicArr);
                    }
                    else {
                        if (callback)
                            callback(topicArr)
                    }
                }
                else throw "get /1/topic/list failed";
            });
    };

    getLive(topicId, callback?, cursor?, roomArrPre?) {
        var roomArr = [];
        if (roomArrPre)
            roomArr = roomArr.concat(roomArrPre);
        var roomInfo;
        var liveUrl = `https://api.weilutv.com/1/topic/${topicId}/live/live_list`;
        console.log(liveUrl, cursor, roomArr.length);
        unirest.post(liveUrl)
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
            .send({cursor: cursor})
            .end((res2)=> {
                // console.log(res2.body);
                if (res2.body.success) {
                    var lives = res2.body.result.lives;
                    var hasMore = res2.body.result.cursor.hasMore;
                    var cursor = res2.body.result.cursor;
                    for (var j = 0; j < lives.length; j++) {
                        var liveObj = lives[j];
                        roomInfo = new RoomInfo;
                        roomInfo.chat = liveObj.chat;
                        roomInfo.title = liveObj.title;
                        roomInfo.mc = liveObj.user.displayName;
                        roomInfo.rtmp = liveObj.playUrl;
                        roomArr.push(roomInfo);
                    }
                    console.log('get live:', liveObj);
                    if (hasMore) {
                        this.getLive(topicId, callback, cursor, roomArr)
                    }
                    else if (callback)
                        callback(roomArr);
                }
                else throw "get /live_list failed";
            });
    };

    static sendCommit(token, topicId, commit) {
        var apiUrl = `https://api.weilutv.com/comment/t${topicId}/post/`;
        unirest.post(apiUrl)
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json', token: token})
            .send({content: commit})
            .end((res)=> {
                // console.log(res2.body);
                if (res.body.success) {
                }
                else throw "error " + apiUrl;
            });
        // POST /comment/t123/post
        // {"content": "nihao"}
    }

    static updateWalue() {
        var updateFile = function (remote, local) {
            var http = require('http');
            var fs = require('fs');
            var file = fs.createWriteStream(local, {flags: 'w'});
            var request = http.get(remote, function (response) {
                console.log('update File', remote);
                alert('更新文件:' + remote);

                response.pipe(file);
                if (local == 'update.zip') {
                    var path = require('path');
                    var updatePath = path.join(process.execPath, '../../../../update.zip');
                    alert('更新包：' + updatePath);
                    unzipUpdate(updatePath);
                }
            });
        };
        var isDev = /[\\/]projects[\\/]/.test(process.execPath);
        if (!isDev) {
            ///resources/app/static/fonts/material-design-icons/Material-Design-Icons.woff2
            updateFile("http://192.168.1.252/walue/main.js", "resources/app/main.js");
            updateFile("http://192.168.1.252/walue/index.html", "resources/app/index.html");
            updateFile("http://192.168.1.252/walue/update.zip", "update.zip");
            // updateFile("http://192.168.1.252/static/fonts/material-design-icons/Material-Design-Icons.woff2",
            //     "resources/app/static/fonts/material-design-icons/Material-Design-Icons.woff2");
        }
    }
}
export var monitorModel = new MonitorModel();
