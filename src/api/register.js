import request from '@/utils/request'

export function register (username, email, password) {
  return request({
    url: '/chatroom/register',
    method: 'post',
    data: {
      username,
      email,
      password
    }
  })
}
