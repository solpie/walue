export var TopicItemView = {
    props: {
        id: {},
        topic: {}
    },
    template: require('./topicItem.html'),
    methods: {
        onClk: function (topicId) {
            console.log('select topic id:', topicId);
            this.$emit('select', topicId);
        }
    }
};