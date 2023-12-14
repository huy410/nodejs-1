import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/ClientViews/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/category',
    name: 'Category',
    component:()=>import('../views/Admin/Category.vue')
  },
  {
    path: '/user',
    name: 'User',
    component:()=>import('../views/Admin/User.vue')
  },
  {
    path: '/product',
    name: 'Product',
    component:()=>import('../views/Admin/Product.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component:()=>import('../views/ClientViews/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component:()=>import('../views/ClientViews/Login.vue')
  },
  {
    path: '/faq',
    name: 'FaQ',
    component:()=>import('../views/Admin/FaQ.vue')
  },
  {
    path: '/book',
    name: 'Book',
    component:()=>import('../views/ClientViews/Book.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component:()=>import('../views/ClientViews/ContactUs.vue')
  },
  {
    path: '/faqs',
    name: 'FaQs',
    component:()=>import('../views/ClientViews/FaQ.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component:()=>import('../views/ClientViews/Cart.vue')
  },
  {
    path: '/chatroom',
    name: 'chatroom',
    component:()=>import('../views/ClientViews/ChatRoom.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component:()=>import('../views/Admin/Order.vue')
  },
  {
    path: '/feedback',
    name: 'feedback',
    component:()=>import('../views/Admin/ContactUs.vue')
  },
  {
    path: '/transport_user',
    name: 'Transport User',
    component:()=>import('../views/Admin/transport_info_user.vue')
  },
  {
    path: '/transport_info_user_borrow',
    name: 'Transport User Borrow Book',
    component:()=>import('../views/Admin/transport_info_user_borrow.vue')
  },
  {
    path: '/cartborrow',
    name: 'cartborrow',
    component:()=>import('../views/ClientViews/CartBorrow.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
