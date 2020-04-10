import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'
import App from './App.vue'

import './components/config/bootstrap'
import store from './components/config/store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
