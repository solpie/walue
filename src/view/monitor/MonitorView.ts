import {RoomItemView} from "./RoomItem";
import {TopicItemView} from "./TopicItem";
import {descendingProp} from "../../utils/JsFunc";
import {monitorModel} from "../../model/MonitorModel";
// import {ToppicItem2} from './TopicItem2.vue'
// var ToppicItem2 = require('./TopicItem2.vue');
var $ = require("jquery");
var isInitWCPlayer = false;
export var monitor = {
    // camelCase in JavaScript
    props: [
        'accountArr',
        'acOptionArr',
        'topicArr',
        'roomArr'
    ],
    template: require('./monitor.html'),
    components: {'roomItem': RoomItemView, 'topicItem': TopicItemView},
    created: function () {
        console.log('create!');
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
                console.log('roomArr', this.roomArr);
                this.initWCPlayer();
            });
        },
        getTopicInfo: function () {
            monitorModel.getTopic((topicInfoArr)=> {
                var a = topicInfoArr.sort(descendingProp('liveCount'));
                var actTopic = [];
                var disactTopic = [];
                for (var i = 0; i < a.length; i++) {
                    var topicObj = a[i];
                    if (topicObj.hasActiveLive) {
                        actTopic.push(topicObj);
                    }
                    else
                        disactTopic.push(topicObj);
                }
                this.topicArr = actTopic.concat();
                // this.topicArr = actTopic.concat(disactTopic);
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