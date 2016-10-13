import {monitorModel} from "../../model/MonitorModel";
export var SettingView = {
    props: {
        isShowRecVideo: {}
    },
    watch: {
        isShowRecVideo: 'onIsShowRecVideo'
    },
    template: require('./setting.html'),
    mounted:function () {
        console.log('SettingView mounted');
        this.isShowRecVideo = monitorModel.settingModel.isShowRecVideo
    },
    methods: {
        onIsShowRecVideo: function (v) {
            monitorModel.settingModel.isShowRecVideo = this.isShowRecVideo;
            console.log('onIsShowRecVideo', v);
        }
    }
};
