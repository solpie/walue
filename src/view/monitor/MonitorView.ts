var player;
var $ = require("jquery");
var isInitWCPlayer = false;
export var monitor = {
    // camelCase in JavaScript
    props: [
        'player',
        'roomArr'
    ],
    template: require('./monitor.html'),
    created: function () {
        console.log('create!');
    },
    mounted: function () {
        console.log('mounted!');
        // var $wcPlayer =document.getElementsByClassName('WC');
        // console.log($wcPlayer);

        this.$http.get('http://127.0.0.1/monitor/room').then((res) => {
            this.roomArr = res.body.roomArr;
            // var $wcPlayer = $('.WCPlayer');
            // console.log($wcPlayer);

            // var wjs = require("wcjs-player");
            // player = new wjs("#player").addPlayer({
            //     autoplay: true,
            //     wcjs: require('webchimera.js')
            // });
            // this.player = player;
            // player.addPlaylist("rtmp://huputv-ws-live.arenacdn.com/prod/NvS4rQzyGQDWEJLi_1000");
        });

    },
    methods: {
        initWCPlayer: function () {
            if (!isInitWCPlayer) {
                isInitWCPlayer = true;
                $('.WCPlayer').each(function (index) {
                    $(this).attr('id', 'player' + index);
                    console.log($(this));
                });
            }
        },
        onOpenRoom: function (val,rtmp) {
            console.log('onOpenRoom', val,rtmp);

            this.initWCPlayer();

            var wjs = require("wcjs-player");
            player = new wjs("#player" + val).addPlayer({
                autoplay: true,
                wcjs: require('webchimera.js')
            });
            this.player = player;
            player.addPlaylist(rtmp);
        },
        onRefreshRoom: function () {
            console.log('onRefreshRoom');
        },
        onSendDmk: function () {
            console.log('onSendDmk');
        }
    }
};