import Vue from 'nativescript-vue'
// import App from './components/App' => now imported in router
import router from './router/router'
// import routes from "./route";
import BackendApi from "./services/backend-api";

const appSettings = require("tns-core-modules/application-settings");
// Uncommment the following to see NativeScript-Vue output logs
Vue.config.silent = false;

const backendApi = new BackendApi(Vue);
// console.log(backendApi.login())
// Vue.prototype.$router = router;
Vue.prototype.$backendApi = backendApi;
Vue.prototype.$appSettings = appSettings;

import VueDevtools from 'nativescript-vue-devtools'

if(TNS_ENV !== 'production') {
    Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

//Navigation
Vue.prototype.$goto = function (to, data, options) {
    if(data != undefined) {
        console.log(typeof data)
        console.log(data)
        console.log(data.name)
    }
    var options = options || {
        clearHistory: false,
        backstackVisible: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        },
        props: {
            data: data
        }
    }
    this.$navigateTo(router[to], options)
}

new Vue({
    render: h => h('frame', [h(router['login'])])
}).$start()
