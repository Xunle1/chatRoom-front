import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

export const constantRouterMap = [
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/Main.vue')
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
    hidden: true,
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },

  { path: '*', redirect: '/404', hidden: true }
]
const originalPush = VueRouter.prototype.push

//解决重复跳转同一路由报错
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)

}

const router = new VueRouter({
  mode: 'history',
  routes: constantRouterMap
})

export default router
