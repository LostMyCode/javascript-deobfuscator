import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import axios from 'axios' //追記
import VueAxios from 'vue-axios' //追記

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

new Vue({
  render: h => h(App),
}).$mount('#app')
