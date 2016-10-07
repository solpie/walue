var $ = require("jquery");
export var RoomItemView = {
    props: {
        idx: {},
        player: {},
        accountArr: {},
        acOptionArr: {},
        acSelected: {},
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
        onAcSelected: function (val) {
            console.log(this.acSelected, val);
        },
        onOpenRoom: function (val, rtmp) {
            console.log('onOpenRoom', val, rtmp);
            if (!this.player) {
                this.initPlayer();
            }
            this.player.addPlaylist(rtmp);

            // $()

        }
    }
};