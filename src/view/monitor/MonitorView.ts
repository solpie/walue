import { RoomItemView } from "./RoomItem";
import { TopicItemView } from "./TopicItem";
import { descendingProp } from "../../utils/JsFunc";
import { monitorModel } from "../../model/MonitorModel";
import { Navbar } from "../navbar/Navbar";
import { MenuModel } from "../../model/MenuModel";
import { PlayerItemView } from "./PlayerItem";
import { Command } from "../../model/Command";


var monitorVersion = '0.10.12.1';
//////global
export var menuModel = new MenuModel();
export var cmd = new Command();
////
export var $ = require("jquery");
var isInitWCPlayer = false;
export var MonitorView = {
    // camelCase in JavaScript
    props: [
        'accountArr',
        'acOptionArr',
        'actTopic',
        'disActTopic',
        'topicArr',
        'commitContent',
        'curTopicId',
        'vlcPath',
        'playerArr',
        'isShowRecVideo',
        'roomArr'
    ],
    template: require('./monitor.html'),
    components: {
        'playerItem': PlayerItemView,
        'roomItem': RoomItemView,
        'Navbar': Navbar,
        'topicItem': TopicItemView
    },
    watch: {
        isShowRecVideo: 'onIsShowRecVideo'
    },
    created: function () {
        console.log('create!', monitorVersion);
        this.vlcPath = process.env['VLC_PLUGIN_PATH'];
        this.initLoginAcc();
    },
    mounted: function () {
        console.log('mounted!');
        this.isShowRecVideo = monitorModel.settingModel.isShowRecVideo;
        this.getRoomInfo();
        this.getTopicInfo();
    },

    methods: {
        onIsShowRecVideo: function (v) {
            console.log('onIsShowRecVideo', v);
            monitorModel.settingModel.isShowRecVideo = this.isShowRecVideo;
            this.onRefreshTopic();
        },
        onAddRoom: function () {

        },
        onSendCommit: function () {
            console.log('onSendCommit', this.commitContent);
            // MonitorModel.sendCommit();
        },
        onSelectTopic: function (topicId) {
            this.curTopicId = topicId;
            console.log('onSelectTopic', topicId);
            monitorModel.getLive(topicId, (roomArr) => {
                this.roomArr = roomArr;
                for (var i = 0; i < this.roomArr.length; i++) {
                    var roomInfo = this.roomArr[i];
                    var urlLen = roomInfo.rtmp.length;
                    roomInfo.shortUrl = roomInfo.rtmp.substr(0, 30)
                        + "..." + roomInfo.rtmp.substr(urlLen - 11, 11);
                }
                console.log('roomArr', this.roomArr);
                this.initWCPlayer();
            });
        },
        getTopicInfo: function () {
            monitorModel.getTopic((topicInfoArr) => {
                var a = topicInfoArr.sort(descendingProp('liveCount'));
                var actTopic = [];
                var disActTopic = [];
                this.actTopic = actTopic;
                this.disActTopic = disActTopic;
                for (var i = 0; i < a.length; i++) {
                    var topicObj = a[i];
                    if (topicObj.hasActiveLive) {
                        actTopic.push(topicObj);
                    }
                    else
                        disActTopic.push(topicObj);
                }
                if (monitorModel.settingModel.isShowRecVideo)
                    this.topicArr = actTopic.concat(disActTopic);
                else
                    this.topicArr = actTopic.concat();
                // menuModel.setTopicArr(this.topicArr);
                console.log('topicInfo', this.topicArr);
            });
        },
        onRefreshTopic: function () {
            this.getTopicInfo();
        },
        getRoomInfo: function () {
        },

        initWCPlayer: function () {
            if (!isInitWCPlayer) {
                isInitWCPlayer = true;
                $('.WCPlayer').each(function (index) {
                    $(this).attr('id', 'player' + index);
                });
            }
        },
        initLoginAcc() {
            // this.updateAccountOption(monitorModel.getUserArr())
        },
        updateAccountOption: function (accountArr) {
            this.accountArr = accountArr;
            this.acOptionArr = [];
            for (var i = 0; i < accountArr.length; i++) {
                var acObj = accountArr[i];
                this.acOptionArr.push({ text: acObj.name, value: acObj });
            }
            console.log("updateAccountOption", this.acOptionArr)
        },
        onLogin: function (accountArr) {
            console.log('onLogin', accountArr);
            // this.updateAccountOption(accountArr);
        },
        onAcSelected: function (val) {
            console.log(val);
        },

        onOpenRoom: function (roomInfo) {
            console.log('onOpenRoom', roomInfo);
            if (!this.playerArr)
                this.playerArr = [];
            this.playerArr.push(roomInfo);
            this.roomArr = [];
            this.updateAccountOption(monitorModel.getUserArr())
        },
        onRefreshRoom: function () {
            console.log('onRefreshRoom');
        },
        onSendDmk: function () {
            console.log('onSendDmk');
        }
    }
};