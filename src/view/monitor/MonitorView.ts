import {RoomItemView} from "./RoomItem";
import {TopicItemView} from "./TopicItem";
import {descendingProp} from "../../utils/JsFunc";
import {monitorModel} from "../../model/MonitorModel";
import {Navbar} from "../navbar/Navbar";
import {MenuModel} from "../../model/MenuModel";
import {PlayerItemView} from "./PlayerItem";


var monitorVersion = '0.10.12.1';

export var menuModel = new MenuModel();

var $ = require("jquery");
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
        'roomArr'
    ],
    template: require('./monitor.html'),
    components: {
        'playerItem': PlayerItemView,
        'roomItem': RoomItemView,
        'Navbar': Navbar,
        'topicItem': TopicItemView
    },
    created: function () {
        console.log('create!', monitorVersion);
        this.vlcPath = process.env['VLC_PLUGIN_PATH'];
    },
    mounted: function () {
        console.log('mounted!');
        this.getRoomInfo();
        this.getTopicInfo();
        // $(".dropdown-button").dropdown();
        // $(document).ready(function(){
        //     $('.collapsible').collapsible({
        //         accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        //     });
        // });
    },
    methods: {
        onAddRoom: function () {

        },
        onSendCommit: function () {
            console.log('onSendCommit', this.commitContent);
            // MonitorModel.sendCommit();
        },
        onSelectTopic: function (topicId) {
            this.curTopicId = topicId;
            console.log('onSelectTopic', topicId);
            monitorModel.getLive(topicId, (roomArr)=> {
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
            monitorModel.getTopic((topicInfoArr)=> {
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
                menuModel.setTopicArr(this.topicArr);
                console.log('topicInfo', this.topicArr);
            });
        },
        getRoomInfo: function () {
        },
        updateAccountOption: function (accountArr) {
            this.accountArr = accountArr;
            this.acOptionArr = [];
            for (var i = 0; i < accountArr.length; i++) {
                var acObj = accountArr[i];
                this.acOptionArr.push({text: acObj.name, value: acObj});
            }
        },
        onAcSelected: function (val) {
            console.log(val);
        },
        initWCPlayer: function () {
            if (!isInitWCPlayer) {
                isInitWCPlayer = true;
                $('.WCPlayer').each(function (index) {
                    $(this).attr('id', 'player' + index);
                });
            }
        },
        onLogin: function (accountArr) {
            console.log('onLogin', accountArr);
            this.updateAccountOption(accountArr);
        },
        onOpenRoom: function (roomInfo) {
            console.log('onOpenRoom', roomInfo);
            if (!this.playerArr)
                this.playerArr = [];
            this.playerArr.push(roomInfo);
            this.roomArr = [];
        },
        onRefreshRoom: function () {
            console.log('onRefreshRoom');
        },
        onSendDmk: function () {
            console.log('onSendDmk');
        }
    }
};