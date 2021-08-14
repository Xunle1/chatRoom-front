import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import Moment from 'moment'

import '@/permission'

// 定义全局时间戳过滤器
Vue.filter('formatDate', function (value) {
  return Moment(value).format('YYYY-MM-DD HH:mm:ss')
})
Vue.config.productionTip = false

Vue.prototype.$moment = Moment

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')

