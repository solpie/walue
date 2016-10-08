<template>
    <a href="#" class="collection-item" @click="onClk(id)"> {{id}} - {{topic.topic}} live:{{topic.liveCount}} view:{{topic.viewCount}}</a>
</template>
<script>
    export default{
        props: {
            id: {},
            topic: {}
        },
        methods: {
            onClk: function (topicId) {
                console.log('select topic id:', topicId);
                this.$emit('select', topicId);
            }
        }
    }
</script>