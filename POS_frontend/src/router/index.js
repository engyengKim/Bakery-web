import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Order from '@/components/Order'
import Payment from '@/components/Payment'
import Stock from '@/components/Stock'
import Start from '@/components/Start'
import Login from '@/components/Login'
import Revenue from '@/components/Revenue'
import Inventory from '@/components/Inventory'
import Expire from '@/components/Expire'
import History from '@/components/History'
import MyPage from '@/components/MyPage'

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
    {
      path: '/revenue',
      name: 'Revenue',
      component: Revenue
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: Inventory
    },
    {
      path: '/history',
      name: 'History',
      component: History
    },
    {
      path: '/expire',
      name: 'Expire',
      component: Expire
    },
    {
      path: '/my_page',
      name: 'MyPage',
      component: MyPage
    },

  ]
})
