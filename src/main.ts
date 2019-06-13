import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './assets/fontIcon/iconfont.css';
import elementUi from 'element-ui';

Vue.config.productionTip = false;

Vue.use(elementUi);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
