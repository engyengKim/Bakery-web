import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Order from '@/components/Order'
import Payment from '@/components/Payment'
import Stock from '@/components/Stock'
import Start from '@/components/Start'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
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
