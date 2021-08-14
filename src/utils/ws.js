import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
// import { getToken } from './auth'
let stompClient = null

export function initWebSocket (id) {
  console.log("start")
  this.connection(id);
  console.log(stompClient)
}

//点对点发送
export function sendPTPMessage (fromId, userId, content) {

  var postMessage = {
    userId,
    content
  }

  stompClient.send(`/alone/aloneRequest/${fromId}`, {}, JSON.stringify(postMessage))
}

export function sendMassMessage (fromId, userId, message) {
  var postMessage = {
    userId,
    message
  }
  stompClient.send("/topic/massRequest", {}, JSON.stringify(postMessage))
}

export function connection (id) {
  this.socket = new SockJS('http://localhost:8000/websocket')
  console.log(this.socket)
  stompClient = Stomp.over(this.socket)

  stompClient.connect({}, function (frame) {
    console.log("Connected=================>   " + frame)
    stompTopic()
    stompQueue(id)
  }, this.onFailed)

}

function stompTopic () {
  stompClient.subscribe('/mass/getResponse', function (response) {
    console.log(response)
  })
}

function stompQueue (userId) {
  stompClient.subscribe('/user/' + userId + '/alone/getResponse', function (response) {
    console.log(response)
    console.log(response.body)
  })
}

export function onConnected () {
}

export function onFailed (frame) {
  console.log("Failed: " + frame)
}

export function disconnect () {
  if (this.stompClient != null) {
    this.stompClient.disconnect()
    console.log("disconnected")
  }
}
