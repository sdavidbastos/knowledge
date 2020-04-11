import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'
import App from './App.vue'

import './components/config/bootstrap'
import './components/config/msgs'
import store from './components/config/store'
import router from './components/config/router'

Vue.config.productionTip = false

/* TEMPORARIO! */
/* Para qualquer requisição que meu axios fizer haverá um header Authorization */
require('axios').defaults.headers.common['Authorization'] = "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkRhdmlkIFRhdmFyZXMgQmFzdG9zIiwiZW1haWwiOiJkYXZpZHRhdmFyZXM5OEBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTg2NTU5MDE5LCJleHAiOjE1ODY4MTgyMTl9.dfTTcqot4PagLaKwg_q6j9LbJs7oxgOIYWIJNu5w95k"

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
