import {RoomItemView} from "./RoomItem";
import {TopicItemView} from "./TopicItem";
import {descendingProp} from "../../utils/JsFunc";
import {monitorModel} from "../../model/MonitorModel";
import {Navbar} from "../navbar/Navbar";
// import {ToppicItem2} from './TopicItem2.vue'
// var ToppicItem2 = require('./TopicItem2.vue');
var monitorVersion = '0.10.12.1';
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
        'vlcPath',
        'roomArr'
    ],
    template: require('./monitor.html'),
    components: {
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
        // $(document).ready(function(){
        //     $('.collapsible').collapsible({
        //         accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        //     });
        // });
    },
    methods: {
        onSelectTopic: function (topicId) {
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
                console.log('topicInfo', this.topicArr);
            });
        },
        getRoomInfo: function () {
            // this.$http.get('http://127.0.0.1/monitor/room').then((res) => {
            //     // this.roomArr = res.body.roomArr;
            //     // this.accountArr = res.body.accountArr;
            //     // this.acOptionArr = [];
            //     // for (var i = 0; i < this.accountArr.length; i++) {
            //     //     var acObj = this.accountArr[i];
            //     //     this.acOptionArr.push({text: acObj.name, value: acObj});
            //     // }
            //     this.updateAccountOption(res.body.accountArr);
            //     // this.initWCPlayer();
            // });
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
        onRefreshRoom: function () {
            console.log('onRefreshRoom');
        },
        onSendDmk: function () {
            console.log('onSendDmk');
        }
    }
};