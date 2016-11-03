import {Navbar} from "./navbar/Navbar";
import {MonitorView} from "./monitor/MonitorView";
import {SettingView} from "./setting/SettingView";
//////////////
///////////////////
var version = '16.11.3.2';
var routes = [
    {
        path: '/', name: 'home',
        components: {default: MonitorView, Navbar: Navbar}
    },
    {
        path: '/setting', name: 'setting',
        components: {default: SettingView, Navbar: Navbar},
    }
];

declare var VueRouter;
declare var Vue;
var router = new VueRouter({
    routes // short for routes: routes
});

router.afterEach((to, from) => {
    var toPath = to.path;
    router.app.active = toPath.split("/")[1];
    // router.app.monitorModel = monitorModel;
});

var app = new Vue({
    router
}).$mount('#app');