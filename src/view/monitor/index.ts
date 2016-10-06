import {monitor} from "./MonitorView";
var Bar = {template: '<div>bar</div>'};

var routes = [
    {path: '/', component: monitor},
    {path: '/bar', component: Bar}
];
declare var VueRouter;
declare var Vue;
var router = new VueRouter({
    routes // short for routes: routes
});
var app = new Vue({
    router
}).$mount('#app');
