import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Index from './components/Index';
import router from './router.config'; //路由
import store from './store.config' //vuex
import axios from 'axios'


Vue.prototype.axios = axios
Vue.use(ElementUI);



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(Index),
}).$mount('#app')
