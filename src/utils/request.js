import axios from 'axios'
import store from '../store'
import { getToken } from './auth'
import { Notify } from 'vuetify-message-snackbar'

//创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_URL, //api的base_url
  timeout: 5000 //超时时间
})

//request拦截器
service.interceptors.request.use(
  config => {
    console.log("into request拦截器")
    if (store.getters.token) {
      config.headers['chat_token'] = getToken() //让每个请求携带自定义token
    }
    return config
  },
  error => {
    console.log("request ====> " + error)
    Promise.reject(error)
  }
)

//response拦截器
service.interceptors.response.use(
  response => {
    console.log("into response拦截器")
    // code不是20000即出现错误
    const res = response.data
    if (res.code != 20000) {
      console.log(res)
      console.log("错误信息：" + res.message)
      Notify.error(res.message)
      return res
    } else {
      return res
    }
  },
  error => {
    console.log('response ======> ' + error) //for debug
    return Promise.reject(error)
  }
)

export default service