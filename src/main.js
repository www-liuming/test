// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import '../static/css/reset.css'
import '../static/css/animate.css'
import './common/less/index.less'                // 此处有坑，必须把webpack.base.conf.js  加上的那段 {test: /\.less$/,loader: "style-loader!css-loader!less-loader",} 删掉才行

Vue.config.productionTip = false

// 统一事件中心管理方法2
// var Event = new Vue({...})
// 广播 Event.$emit('eventName', 'Date')
// 接收 Event.$on('eventName', (date) => {...}.bind(this))

/* eslint-disable no-new */     // eslint的一个跳过检查语法
new Vue({
  el: '#app',
  data: {                      // 好的 这个时候 你就可以一劳永逸了，在任何组件都可以调用事件发射 接受的方法了.  销毁$off
    eventHub: new Vue()               // 广播 this.$root.eventHub.$emit('YOUR_EVENT_NAME', yourData)
  },                                  // 接收 this.$root.eventHub.$on('YOUR_EVENT_NAME', (yourData)=>{handle(yourData)})
  router,
  template: '<App/>',
  components: { App }
})
