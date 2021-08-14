import request from '@/utils/request'

export function getFriends (userId) {
  return request({
    url: `/chatroom/friends/${userId}`,
    method: 'get',
  })
}

export function sendRequest (userReqId, friendReqUsername, reqMessage) {
  return request({
    url: `/chatroom/friend`,
    method: 'post',
    data: {
      userReqId,
      friendReqUsername,
      reqMessage
    }
  })
}

export function getRequests (userId) {
  return request({
    url: `/chatroom/friendreq/${userId}`,
    method: 'get'
  })
}

export function handleRequest (id, userReqId, friendReqId, accept) {
  return request({
    url: `/chatroom/friendreq`,
    method: 'post',
    data: {
      id,
      userReqId,
      friendReqId,
      accept
    }
  })
}

export function deleteFriend (userId, friendId) {
  return request({
    url: `/chatroom/friend/${userId}/${friendId}`,
    method: 'delete',
  })
}
