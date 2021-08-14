import request from '@/utils/request'

export function login (username, password) {
  return request({
    url: '/chatroom/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo (token) {
  return request({
    url: '/chatroom/userinfo',
    method: 'get',
    params: { token }
  })
}

export function logOut () {
  return request({
    url: '/chatroom/logout',
    method: 'post'
  })
}