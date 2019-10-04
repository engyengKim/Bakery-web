// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ReactiveSearch from '@appbaseio/reactivesearch-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'

Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(ReactiveSearch)
Vue.use(VueMaterial)
Vue.use(MdContent)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
