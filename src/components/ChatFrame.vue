<template>
  <v-container>
    <p align="center">
      <v-chip class="ma-2"
              color="deep-purple accent-4"
              label
              text-color="white">
        {{chating}}
      </v-chip>
    </p>
    <v-divider></v-divider>
    <p></p>
    <v-row>
      <v-virtual-scroll :items="messageList"
                        :item-height="50"
                        height="700px">
        <template v-slot="{ item }">
          <v-chip :class="item.fromId == id ? 'sendMessage':'recieveMessage'"
                  outlined>{{item.sendTime}}</v-chip>
          <v-chip v-if="item.type === 0"
                  :class="item.fromId == id ? 'sendMessage':'recieveMessage'"
                  :color="item.fromId == id ? 'cyan':'gray'"
                  label
                  pill
                  :text-color="item.fromId == id ? 'wihte':'black'">
            {{item.content}}
          </v-chip>
          <v-img v-if="item.type === 1"
                 width="150px"
                 :class="item.fromId == id ? 'sendMessage':'recieveMessage'"
                 :src="item.content"></v-img>
        </template>
      </v-virtual-scroll>
    </v-row>
    <p></p>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="2">
        <v-file-input accept="image/*"
                      @change="onFileChange"
                      label="发送图片"
                      show-size
                      color="success"
                      prepend-icon="mdi-image"
                      truncate-length="20">
        </v-file-input>
      </v-col>
      <v-col>
        <v-form @submit.native.prevent>
          <v-text-field label="Type something..."
                        v-model="content"
                        append-outer-icon="mdi-send"
                        @click:append-outer="sendMessage"
                        @keyup.enter="sendMessage">
          </v-text-field>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { mapGetters } from 'vuex'
import monment from 'moment'

import * as messageApi from '@/api/message'

export default {
  name: 'CharFrame',
  props: ['toId', 'chating', 'type'],
  created () {
    this.connection()
  },
  data () {
    return {
      stompClient: null,
      content: '',
      messageList: [],
      messageType: '0',
    }
  },
  computed: {
    ...mapGetters([
      'id'
    ])
  },
  watch: {
    toId (newValue) {
      if (this.type === 'room') {
        this.stompTopic(newValue)
        this.getRoomMessage(newValue)
      } else {
        this.getMessageList(newValue)
      }
    }
  },
  methods: {
    getMessageList (toId) {
      messageApi.getMessageList(this.id, toId).then((response) => {
        this.messageList = response.data.messageList
      }).catch(err => {
        console.log(err)
      })
    },
    getRoomMessage (roomId) {
      messageApi.getRoomMessage(roomId).then(response => {
        this.messageList = response.data.messageList
      })
    },
    sendMessage () {
      if (this.type === 'room') {
        this.sendMassMessage(this.id, this.toId, this.content, this.messageType)
        this.getRoomMessage(this.toId)
      } else {
        this.sendPTPMessage(this.id, this.toId, this.content, this.messageType)
        this.getMessageList(this.toId)
      }
      this.clearMessage()
    },
    clearMessage () {
      this.content = ''
    },
    connection () {
      this.socket = new SockJS('http://localhost:8000/websocket')
      this.stompClient = Stomp.over(this.socket)

      this.stompClient.connect({}, this.onConnected, this.onFailed)
    },
    onConnected () {
      if (this.type === 'room') {
        this.stompTopic(this.toId)
        this.getRoomMessage(this.toId)
      } else {
        this.getMessageList(this.toId)
      }
      this.stompQueue()
    },
    //点对点发送
    sendPTPMessage (userId, toId, content, type) {
      var postMessage = {
        userId,
        type,
        content
      }
      this.stompClient.send(`/alone/aloneRequest/${toId}`, {}, JSON.stringify(postMessage))
    },
    //发送群组消息
    sendMassMessage (userId, roomId, content, type) {
      var postMessage = {
        userId,
        type,
        content
      }
      this.stompClient.send(`/mass/massRequest/${roomId}`, {}, JSON.stringify(postMessage))
    },
    //群组接收
    stompTopic (roomId) {
      this.stompClient.subscribe(`/mass/getResponse/${roomId}`, (response) => {
        const messageResponse = JSON.parse(response.body)
        if (messageResponse.fromId != this.id) {
          this.messageList.push(new Object({
            fromId: messageResponse.fromId,
            toId: this.id,
            content: messageResponse.content,
            type: messageResponse.type,
            sendTime: monment().format("YYYY-MM-DD HH:mm:ss")
          }))
        }
      })
    },
    //点对点接收
    stompQueue () {
      this.stompClient.subscribe('/user/' + this.id + '/alone/getResponse', (response) => {
        const messageResponse = JSON.parse(response.body)
        this.messageList.push(new Object({
          fromId: this.toId,
          toId: this.id,
          content: messageResponse.content,
          type: messageResponse.type,
          sendTime: monment().format("YYYY-MM-DD HH:mm:ss")
        }))
      })
    },
    onFailed (frame) {
      console.log("Failed: " + frame)
    },
    disconnect () {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
        console.log("disconnected")
      }
    },
    onFileChange (file) {
      if (file != null) {
        let data = new FormData
        data.append('file', file)
        messageApi.upload(data).then((response) => {
          this.content = response.data.url
          this.messageType = 1
          this.sendMessage()
          this.messageType = 0
        })
        data = null
      }
    }
  },
}
</script>

<style scoped>
.recieveMessage {
  float: left;
}
.sendMessage {
  float: right;
}
</style>