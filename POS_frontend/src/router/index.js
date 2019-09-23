import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Order from '@/components/Order'
import Payment from '@/components/Payment'
import Stock from '@/components/Stock'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/order',
      name: 'Order',
      component: Order
    },
    {
      path: '/payment',
      name: 'Payment',
      component: Payment
    },
    {
      path: '/stock',
      name: 'Stock',
      component: Stock
    },

  ]
})
