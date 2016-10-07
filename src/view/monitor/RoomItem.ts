var $ = require("jquery");
declare var ServerConf;
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
        onAcSelected: function () {
            var acObj = this.acSelected;
            var ac = acObj.name;
            var pw = acObj.pw;
            var token = acObj.token;
            if (!token) {
                this.$http.post(`http://${ServerConf.host}/monitor/login`, {ac: ac, pw: pw}).then((res) => {
                    console.log(res.body);
                    this.$emit('login', res.body.accountArr);
                });
            }
            console.log(ac, pw, token);
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