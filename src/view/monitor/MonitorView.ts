export var monitor = {
    // camelCase in JavaScript
    props: [
        'myMessage',
        'roomArr'
    ],
    template: require('./monitor.html'),
    created: function () {
        console.log('create!');
        this.roomArr = [1, 2];
    }
};