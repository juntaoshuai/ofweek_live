// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { MessageBox } from 'mint-ui';
import axios from 'axios'
Vue.prototype.$http = axios
Vue.component(MessageBox.name, MessageBox)
require('swiper/dist/css/swiper.css')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
	mounted:function(){
		
	}
})
