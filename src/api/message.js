import request from '@/utils/request'

export function getMessageList (userId, toId) {
  return request({
    url: `/chatroom/message/${userId}/${toId}`,
    method: 'get',
  })
}

export function getRoomMessage (roomId) {
  return request({
    url: `/chatroom/message/room/${roomId}`,
    method: 'get'
  })
}

export function upload (data) {
  return request({
    url: `/chatroom/oss`,
    method: 'post',
    data,
  })
}