import Vue from 'vue'
import Router from 'vue-router'
import goods from '../components/goods/goods'
import ratings from '../components/ratings/ratings'
import seller from '../components/seller/seller'

Vue.use(Router)

const router = new Router({
  'linkActiveClass': 'active',
  routes: [
    {
      path: '/goods',
      name: '商品',
      component: goods
    },
    {
      path: '/ratings',
      name: '评论',
      component: ratings
    },
    {
      path: '/seller',
      name: '商家',
      component: seller
    },
    {
      path: '*',
      redirect: '/goods'           // 重定向
    }
  ]
})

export default router
