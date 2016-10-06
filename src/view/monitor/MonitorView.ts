var player;
export var monitor = {
    // camelCase in JavaScript
    props: [
        'myMessage',
        'player',
        'roomArr'
    ],
    template: require('./monitor.html'),
    created: function () {
        console.log('create!');
        this.$http.get('http://127.0.0.1/monitor/room').then((res) => {
            this.roomArr = res.body.roomArr;
            var wjs = require("wcjs-player");
            player = new wjs("#player").addPlayer({
                autoplay: true,
                // wcjs: require('wcjs-prebuilt')
                // OR
                wcjs: require('webchimera.js')
                // OR
                // wcjs: require([path-to-Webchimera.js.node-file])
            });
            this.player = player;
            player.addPlaylist("rtmp://huputv-ws-live.arenacdn.com/prod/NvS4rQzyGQDWEJLi_1000");
        });
    }
};