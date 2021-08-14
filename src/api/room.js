import request from '@/utils/request'

export function createRoom (name) {
  return request({
    url: `/chatroom/room/${name}`,
    method: 'post'
  })
}

export function enterRoom (name, userId) {
  return request({
    url: `chatroom/roomenter/${name}/user/${userId}`,
    method: 'put'
  })
}

export function getUsers (roomId) {
  return request({
    url: `chatroom/room/${roomId}/users`,
    method: 'get'
  })
}

export function getRooms (userId) {
  return request({
    url: `chatroom/room/${userId}/list`,
    method: 'get'
  })
}

export function leaveRoom (roomId, userId) {
  return request({
    url: `chatroom/roomleave/${roomId}/user/${userId}`,
    method: 'put'
  })
}
