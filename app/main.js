import Vue from 'nativescript-vue'
// import App from './components/App' => now imported in router
import router from './router'


import VueDevtools from 'nativescript-vue-devtools'

if(TNS_ENV !== 'production') {
    Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

//Navigation
Vue.prototype.$goto = function (to, options) {
    var options = options || {
        clearHistory: false,
        backstackVisible: true,
        transition: {
            name: "slide",
            duration: 380,
            curve: "easeIn"
        }
    }
    this.$navigateTo(this.$router[to], options)
}

new Vue({
    render: h => h('frame', [h(router['login'])])
}).$start()
