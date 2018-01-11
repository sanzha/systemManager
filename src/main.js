import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import resource from './controller/resource'
import utils from './utils/common'
import 'element-ui/lib/theme-chalk/index.css'
import '../static/css/common.css'
import "babel-polyfill";


window.resource = resource;
window.utils = utils;
// window.organizationList = [{id:1,name:'诸神'},{id:2,name:'秩序'}];

Vue.use(ElementUI);
Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
