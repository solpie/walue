export var RoomItemView = {
    props: {
        idx: {},
        accountArr: {},
        acOptionArr: {},
        acSelected: {},
        roomInfo: {}
    },
    template: require('./roomItem.html'),
    methods: {
        onAcSelected: function (val) {
            console.log(this.acSelected, val);
        }
    }
};