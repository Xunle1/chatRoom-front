import router from './router'
import store from './store'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from './utils/auth'


const whiteList = ['/login', '/register'] //不重定向白名单
router.beforeEach((to, from, next) => {
  console.log("into permission")
  // to and from are both route objects. must call `next`.
  nProgress.start()
  if (getToken()) {
    console.log("into permission getToken")
    if (to.path === '/login' || to.path === '/register') {
      next({ path: '/' })
      nProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        //拉取用户信息
        store.dispatch('GetInfo').then(() => {
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            console.log(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    console.log("into no token")
    //未获取到token
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      console.log("into redirect")
      next(`/login?redirect=${to.path}`) //重定向到首页
      nProgress.done()
    }
  }
})

router.afterEach(() => {
  nProgress.done()
})
