import {RoomItemView} from "./RoomItem";
var $ = require("jquery");
var isInitWCPlayer = false;
var playerMap: any = {};
export var monitor = {
    // camelCase in JavaScript
    props: [
        'accountArr',
        'acOptionArr',
        'roomArr'
    ],
    template: require('./monitor.html'),
    components: {'roomItem': RoomItemView},
    created: function () {
        console.log('create!');
    },
    mounted: function () {
        console.log('mounted!');
        this.getRoomInfo();
    },
    methods: {
        getRoomInfo: function () {
            this.$http.get('http://127.0.0.1/monitor/room').then((res) => {
                this.roomArr = res.body.roomArr;
                this.accountArr = res.body.accountArr;
                this.acOptionArr = [];
                for (var i = 0; i < this.accountArr.length; i++) {
                    var acObj = this.accountArr[i];
                    this.acOptionArr.push({text: acObj.name, value: acObj});
                }
                this.initWCPlayer();
            });
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

        onRefreshRoom: function () {
            console.log('onRefreshRoom');
        },
        onSendDmk: function () {
            console.log('onSendDmk');
        }
    }
};