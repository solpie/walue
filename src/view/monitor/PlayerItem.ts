import {packDmk} from "../../model/DmkInfo";
import {monitorModel} from "../../model/MonitorModel";
var $ = require("jquery");
declare var io: any;
declare var wjs;
// var websocket: any;


export var PlayerItemView = {
    template: require('./playerItem.html'),
    props: {
        idx: {},
        player: {},
        accountArr: {},
        acOptionArr: {},
        acSelected: {},
        dmkContent: {},
        commitContent: {},
        dmkArr: {},
        videoType: {},//1 live 2 flv
        chat: {},//websocket url
        shortUrl: {},//websocket url
        roomInfo: {}
    },
    watch: {
        dmkArr: 'onDmkArr'
    },
    mounted: function () {
        console.log('created player', this.roomInfo.shortUrl);
        // if (this.player) {
        //     this.player.clearPlaylist();
        //     this.player.stop();
        // }
        this.initPlayer();
        this.onOpenRoom();
    },
    methods: {
        initPlayer: function () {
            var $item = $(this.$el).find(".WCPlayer")[0];
            var playerId = 'player' + this.idx;
            $($item).attr('id', playerId);
            console.log("player item:", this.idx);
            // var wjs = require('wcjs-player');
            var isRotate = monitorModel.settingModel;
            this.player = new wjs("#" + playerId).addPlayer({
                autoplay: true,
                wcjs: require('webchimera.js'),
                // vlcArgs: ["--network-caching=500",'--vout-filter=transform',"--transform-type=90"]
                vlcArgs: ["--network-caching=500"],
                // vlcArgs: ["--network-caching=500", '--vout-filter=transform',
                //     "--transform-type=90",
                //     "--video-filter=transform{true}"]
            });
            // $($(this.$el).find('.wcp-vol-control')).off('mouseout');
            // $(this.$el).off('mouseout', '.wcp-vol-control');
            monitorModel.playerMap[playerId] = this.player;
        },
        onInputEnter: function (e) {
            if (e.key && e.key == "Enter") {
                // if (e.key && e.key == "Enter" && e.ctrlKey) {
                this.onSendDmk(e);
            }
        },
        onCommitInputEnter: function () {

        },
        onDmkArr: function (v) {
            if (!v && monitorModel.dmkArrMap[this.roomInfo.chat])
                this.dmkArr = monitorModel.dmkArrMap[this.roomInfo.chat];
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
                var wsMap = monitorModel.wsMap;
                if (wsMap[this.roomInfo.chat]) {
                    var dmk = this.dmkContent;
                    this.dmkContent = '';
                    if (dmk.length > 0 && dmk[0] != " ") {
                        var packMsg = packDmk(dmk, null);
                        wsMap[this.roomInfo.chat].send(packMsg);
                    }
                }
                else {
                    alert('发送失败：无法连接弹幕服务器');
                }
            }
        },

        // onWebSocketMsg: function (evt) {
        //     var dmkContent = decodeMsg(evt.data);
        //     console.log("onWebSocketMsg", evt, dmkContent);
        //     if (!this.dmkArr)
        //         this.dmkArr = '';
        //     if (dmkContent) {
        //         monitorModel.dmkArrMap[this.roomInfo.chat] += ":" + dmkContent + '\n';
        //         this.dmkArr = monitorModel.dmkArrMap[this.roomInfo.chat]
        //     }
        //     // for (var i = 0; i < this.dmkArr.length; i++) {
        //     //     var obj = this.dmkArr[i];
        //     //
        //     // }
        //     var $textarea = $(this.$el).find("textarea")[0];
        //     $textarea.scrollTop = $textarea.scrollHeight;
        // },
        onDmkArrUpdate: function (v) {
            this.dmkArr = v;
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
            if (this.roomInfo.chat) {
                monitorModel.openChatWs(this.roomInfo.chat, this.onDmkArrUpdate);
            }
        },
        onClosePlayer: function () {
            // if (this.player)
            var player = monitorModel.playerMap['player' + this.idx];
            player.clearPlaylist();
            player.stop();
            $(this.$el).hide();
        },
        onOpenRoom: function () {
            console.log('onOpenRoom', this.roomInfo.chat, this.roomInfo.rtmp);
            // if (!this.player) {
            //     this.initPlayer();
            // }
            // else {
            //     this.player.stop();
            // }
            this.initChat();
            this.player.addPlaylist(this.roomInfo.rtmp);
            $('#roomList').hide();
            // this.player.stop();
            // this.player.play(rtmp);
        }
    }
};