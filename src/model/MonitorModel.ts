import {TopicInfo} from "./TopicInfo";
import {RoomInfo} from "./RoomInfo";
var unirest = require('unirest');
class SettingModel {
    isShowRecVideo: boolean = false;
}
export class MonitorModel {
    settingModel;

    constructor() {
        this.settingModel = new SettingModel();
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
                        topicInfo.topic = obj.content;
                        topicInfo.liveCount = obj.count.live;
                        topicInfo.viewCount = obj.count.view;
                        topicInfo.hasActiveLive = obj.hasActiveLive;
                        console.log('hasActiveLive', topicInfo.hasActiveLive, topicInfo.id);
                        topicArr.push(topicInfo);
                        // console.log('id', obj.id, 'content:', obj.content);
                    }
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

    getLive(topicId, callback?) {
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
}
export var monitorModel = new MonitorModel();