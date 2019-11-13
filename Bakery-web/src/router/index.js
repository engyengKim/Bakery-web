import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/Start'
import Store from '@/components/Store'
import Product from '@/components/Product'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Mypage from '@/components/Mypage'
import Signup from '@/components/Signup'
import Home from '@/components/Home'
import Pay from '@/components/Pay'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start
    },
    {
      path: '/store',
      name: 'Store',
      component: Store
    },
    {
      path: '/product',
      name: 'Product',
      component: Product
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/mypage',
      name: 'Mypage',
      component: Mypage
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
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
      path: '/pay',
      name: 'Pay',
      component: Pay
    },
  ]
})
