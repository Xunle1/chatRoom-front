import { getInfo } from "@/api/login"
import { getToken, setToken, removeToken } from "@/utils/auth";


const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    id: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_SIGN: (state, sign) => {
      state.sign = sign
    },
  },

  actions: {
    //登录
    Login ({ commit }, token) {
      console.log("store ==> " + token)
      return new Promise((resolve) => {
        setToken(token)
        commit('SET_TOKEN', token)
        resolve()
      })
    },
    //获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_ID', data.id)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_SIGN', data.sign)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut ({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },
    //前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user