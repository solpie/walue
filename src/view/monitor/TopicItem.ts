import {$} from "./MonitorView";
export var TopicItemView = {
    props: {
        id: {},
        topic: {}
    },
    template: require('./topicItem.html'),
    methods: {
        onClk: function (topicId) {
            console.log('select topic id:', topicId);
            $('#roomList').show();
            this.$emit('select', topicId);
        }
    }
};