var $ = require("jquery");
declare var ServerConf;

// var ProtoBuf = require("protobufjs");
// var builder = ProtoBuf.newBuilder({convertFieldsToCamelCase: true});
// ProtoBuf.loadProtoFile("/resources/app/static/pb/live_websocket.proto", builder);
// var root = builder.build();
// var dmk = new root.LiveEventBroadcast();
// console.log('dmk pb', dmk);
// declare var dcodeIO;
// var ProtoBuf = dcodeIO.ProtoBuf;
// var Message = ProtoBuf.loadProtoFile("/resources/app/static/pb/live_websocket.proto").build("Message");

export var RoomItemView = {
    props: {
        idx: {},
        player: {},
        accountArr: {},
        acOptionArr: {},
        acSelected: {},
        chat: {},
        roomInfo: {}
    },
    template: require('./roomItem.html'),
    methods: {
        initPlayer: function () {
            var $item = $(this.$el).find(".WCPlayer")[0];
            var playerId = 'player' + this.idx;
            $($item).attr('id', playerId);
            console.log("room item:", $item);
            var wjs = require("wcjs-player");
            this.player = new wjs("#" + playerId).addPlayer({
                autoplay: true,
                wcjs: require('webchimera.js')
            });
        },
        onSendDmk: function () {
            // var socket = io('http://localhost');
            // socket.on('news', function (data) {
            //     console.log(data);
            //     socket.emit('my other event', { my: 'data' });
            // });
            var acObj = this.acSelected,
                ac, pw, token;
            if (acObj) {
                ac = acObj.name;
                pw = acObj.pw;
                token = acObj.token;
                if (this.roomInfo.chat) {
                    this.$http.post(`http://${ServerConf.host}/monitor/dmk`, {
                        ac: ac,
                        token: token,
                        chat: this.roomInfo.chat
                    }).then((res) => {
                        console.log(res.body);
                        this.$emit('dmk', res.body.accountArr);
                    });
                }
            }
            console.log('onSendDmk', this.roomInfo);
        },
        onAcSelected: function () {
            var acObj = this.acSelected,
                ac, pw, token;
            if (acObj) {
                ac = acObj.name;
                pw = acObj.pw;
                token = acObj.token;
                if (!token) {
                    this.$http.post(`http://${ServerConf.host}/monitor/login`, {ac: ac, pw: pw}).then((res) => {
                        console.log(res.body);
                        this.$emit('login', res.body.accountArr);
                    });
                }
            }
            console.log(ac, pw, token);
        },
        onOpenRoom: function (val, rtmp) {
            console.log('onOpenRoom', val, rtmp);
            if (!this.player) {
                this.initPlayer();
            }
            this.player.addPlaylist(rtmp);
        }
    }
};