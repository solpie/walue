import {packDmk, decodeMsg} from "../../model/DmkInfo";
import {monitorModel} from "../../model/MonitorModel";
var $ = require("jquery");
declare var io: any;
var websocket: any;


export var RoomItemView = {
    props: {
        idx: {},
        player: {},
        accountArr: {},
        acOptionArr: {},
        acSelected: {},
        dmkContent: {},
        dmkArr: {},
        videoType: {},//1 live 2 flv
        chat: {},//websocket url
        shortUrl: {},//websocket url
        roomInfo: {}
    },
    template: require('./roomItem.html'),
    mounted: function () {
        console.log('created room', this.roomInfo.shortUrl);
        if (this.player) {
            this.player.clearPlaylist();
            this.player.stop();
        }
    },
    methods: {
        initPlayer: function () {
            var $item = $(this.$el).find(".WCPlayer")[0];
            var playerId = 'player' + this.idx;
            $($item).attr('id', playerId);
            console.log("room item:", $item);
            var wjs = require("wcjs-player");
            var isRotate = monitorModel.settingModel;
            this.player = new wjs("#" + playerId).addPlayer({
                autoplay: true,
                wcjs: require('webchimera.js'),
                // vlcArgs: ["--network-caching=500",'--vout-filter=transform',"--transform-type=90"]
                // vlcArgs: ["--network-caching=500"],
                vlcArgs: ["--network-caching=500", '--vout-filter=transform',
                    "--transform-type=90",
                    "--video-filter=transform{true}"]
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
                if (websocket) {
                    var packMsg = packDmk(this.dmkContent, null);
                    websocket.send(packMsg);
                    this.dmkContent = '';
                }
                else {
                    alert('发送失败：无法连接弹幕服务器');
                }
            }
        },

        onWebSocketMsg: function (evt) {
            console.log(evt);
            var dmkContent = decodeMsg(evt.data);
            if (!this.dmkArr)
                this.dmkArr = '';
            if (dmkContent)
                this.dmkArr += ":" + dmkContent + '\n';
            // for (var i = 0; i < this.dmkArr.length; i++) {
            //     var obj = this.dmkArr[i];
            //
            // }
            var $textarea = $(this.$el).find("textarea")[0];
            $textarea.scrollTop = $textarea.scrollHeight;
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
        initChat: function () {
            if (this.roomInfo.chat && !websocket) {
                websocket = new WebSocket(this.roomInfo.chat);
                websocket.binaryType = "arraybuffer";
                websocket.onopen = function (evt) {
                    console.log('websocket open');
                    // websocket.close();
                };
                websocket.onmessage = this.onWebSocketMsg;
            }
        },
        onOpenRoom: function (val, rtmp) {
            console.log('onOpenRoom', val, rtmp);
            if (!this.player) {
                this.initPlayer();
            }
            else {
                this.player.stop();
            }
            this.initChat();
            // this.player.clearPlaylist(rtmp);
            this.player.addPlaylist(rtmp);
            // this.player.stop();
            // this.player.play(rtmp);
        }
    }
};