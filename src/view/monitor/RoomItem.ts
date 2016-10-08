import {packDmk, decodeMsg} from "../../model/DmkInfo";
var $ = require("jquery");
declare var io: any;
var websocket: any;

declare var ServerConf;

// var ProtoBuf = require("protobufjs");
// var builder = ProtoBuf.newBuilder({convertFieldsToCamelCase: true});
// ProtoBuf.loadProtoFile("resources/app/static/pb/live_websocket.proto", builder);
// var root = builder.build();
// var dmk = new root.Danmaku();
// console.log('dmk pb', dmk, dmk.encode(), dmk.encode().toArrayBuffer());

export var RoomItemView = {
    props: {
        idx: {},
        player: {},
        accountArr: {},
        acOptionArr: {},
        acSelected: {},
        dmkContent: {},
        dmkArr: {},
        chat: {},//websocket url
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
        onInputEnter: function (e) {
            if (e.key && e.key == "Enter" && e.ctrlKey) {
                this.onSendDmk(e);
            }
        },
        onSendDmk: function (e) {

            // var socket = io('http://localhost');
            // socket.on('news', function (data) {
            //     console.log(data);
            //     socket.emit('my other event', { my: 'data' });
            // });
            console.log('onSendDmk', this.dmkContent, this.roomInfo.chat, e);
            var acObj = this.acSelected,
                ac, pw, token;
            if (true) {
                // ac = acObj.name;
                // pw = acObj.pw;
                // token = acObj.token;
                var packMsg = packDmk(this.dmkContent, null);
                this.dmkContent = '';
                if (this.roomInfo.chat) {
                    if (!websocket) {
                        websocket = new WebSocket(this.roomInfo.chat);
                        websocket.binaryType = "arraybuffer";
                        websocket.onopen = function (evt) {
                            console.log('websocket open', packMsg);
                            websocket.send(packMsg);
                            // websocket.close();
                        };
                        websocket.onmessage = this.onWebSocketMsg;
                    }
                    else {
                        websocket.send(packMsg);
                    }
                }
            }
        },
        onWebSocketMsg: function (evt) {
            console.log(evt);
            var dmkContent = decodeMsg(evt.data);
            if (!this.dmkArr)
                this.dmkArr = '';
            if (dmkContent)
                this.dmkArr += dmkContent + '\n'
        },
        onAcSelected: function () {
            var acObj = this.acSelected,
                ac, pw, token;
            if (acObj) {
                ac = acObj.name;
                pw = acObj.pw;
                token = acObj.token;
                if (!token) {
                    this.$http.post(`http://127.0.0.1/monitor/login`, {ac: ac, pw: pw}).then((res) => {
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