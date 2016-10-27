declare var io: any;


export var RoomItemView = {
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
    template: require('./roomItem.html'),
    mounted: function () {
        console.log('created room', this.roomInfo.shortUrl);
        if (this.player) {
            this.player.clearPlaylist();
            this.player.stop();
        }
    },
    methods: {
        onOpenRoom: function (val, rtmp) {
            console.log('onOpenRoom', val, rtmp);
            this.$emit('openRoom', this.roomInfo);
        }
    }
};