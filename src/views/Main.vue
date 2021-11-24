<template>
  <v-app>
    <TopBar :show='true' />
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <ChatFrame v-if="showChatFrame"
                       :chating="this.chating"
                       :toId="this.toId"
                       :type="this.type" />
          </v-col>
          <v-col cols="3">
            <v-list subheader>
              <v-subheader>好友列表</v-subheader>
              <v-virtual-scroll height="300"
                                item-height="60"
                                :items="friends">
                <template v-slot:default="{item}">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-img :src="item.avatar"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title v-text="item.friendName"></v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-icon>

                      <v-badge :value="!item.active"
                               dot
                               color="red"
                               overlap>
                        <v-icon @click="chatWithFriend(item.friendName)"
                                :color="item.active ? 'deep-purple accent-4' : 'grey'">mdi-message</v-icon>
                      </v-badge>
                    </v-list-item-icon>
                    <v-btn icon
                           color="red accent-1"
                           @click.stop="deleteDialog = true">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>

                    <!-- "删除好友"对话框 -->
                    <v-dialog v-model="deleteDialog"
                              max-width="290">
                      <v-card>
                        <v-card-title class="headline">删除好友</v-card-title>

                        <v-card-text>
                          确定要删除 {{item.friendName}}
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer></v-spacer>

                          <v-btn color="grey"
                                 @click="deleteDialog = false">
                            取消
                          </v-btn>

                          <v-btn color="error"
                                 @click="deleteFriend(item.friendId)">
                            删除
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
            </v-list>

            <v-divider></v-divider>

            <v-list subheader>
              <v-subheader>群组列表</v-subheader>
              <v-virtual-scroll height="300"
                                item-height="60"
                                :items="rooms">
                <template v-slot:default="{item}">
                  <v-list-item>
                    <!-- 群组头像 -->
                    <v-list-item-avatar>
                      <v-img :src="item.avatar"></v-img>
                    </v-list-item-avatar>

                    <!-- 群组名称 -->
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>

                    <!-- 房间用户列表 -->
                    <v-btn icon
                           color="deep-purple accent-4"
                           @click.stop="roomUserDialog = true"
                           @click="getUsers(item.id)">
                      <v-icon>mdi-account</v-icon>
                    </v-btn>
                    <v-dialog v-model="roomUserDialog"
                              max-width="290">
                      <v-card>
                        <v-card-title>房间用户列表</v-card-title>
                        <v-list subheader>
                          <v-virtual-scroll height="300"
                                            item-height="60"
                                            :items="roomUsers">
                            <template v-slot:default="{item}">
                              <v-list-item>
                                <v-list-item-avatar>
                                  <v-img :src="item.avatar"></v-img>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                  <v-list-item-title v-text="item.username"></v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </template>
                          </v-virtual-scroll>
                        </v-list>
                      </v-card>
                    </v-dialog>
                    <!-- 进入房间聊天 -->
                    <v-list-item-icon>
                      <v-badge :value="!item.active"
                               dot
                               color="red"
                               overlap>
                        <v-icon @click="chatWithRoom(item.name)"
                                :color="item.active ? 'deep-purple accent-4' : 'grey'">mdi-message</v-icon>
                      </v-badge>
                    </v-list-item-icon>
                    <!-- 弹出退出房间对话框 -->
                    <v-btn icon
                           color="red accent-1"
                           @click.stop="leaveRoomDialog = true">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>

                    <!-- "删除群组"对话框 -->
                    <v-dialog v-model="leaveRoomDialog"
                              max-width="290">
                      <v-card>
                        <v-card-title class="headline">退出</v-card-title>

                        <v-card-text>
                          确定要退出 {{item.name}}
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer></v-spacer>

                          <v-btn color="grey"
                                 @click="leaveRoomDialog = false">
                            取消
                          </v-btn>

                          <v-btn color="error"
                                 @click="leaveRoom(item.id)">
                            退出
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
            </v-list>

            <v-divider></v-divider>

            <v-list>
              <v-list-item>
                <v-btn color="primary"
                       @click="addDialog = true">
                  添加好友
                  <v-icon>mdi-account-plus</v-icon>
                </v-btn>
                <!-- "添加好友"对话框 -->
                <v-dialog v-model="addDialog"
                          max-width="300px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">添加好友</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-container>
                        <v-text-field label="用户名*"
                                      v-model="friendReqUsername"
                                      required></v-text-field>
                        <v-text-field label="验证信息"
                                      v-model="requestMessage"></v-text-field>
                      </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1"
                             text
                             @click="addDialog = false">关闭</v-btn>
                      <v-btn color="blue darken-1"
                             text
                             @click="sendRequest()">发送请求</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-divider vertical
                           class="mx-4"
                           inset></v-divider>

                <!-- "好友申请"对话框 -->
                <v-dialog v-model="reqDialog"
                          scrollable
                          max-width="600px">
                  <template v-slot:activator="{ attrs }">
                    <v-btn color="primary"
                           dark
                           v-bind="attrs"
                           @click="getRequests()">好友申请
                      <v-icon>mdi-account-question</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">好友申请</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 600px">
                      <v-container>
                        <v-list two-line
                                subheader>
                          <v-list-item v-for="item in requests"
                                       :key="item.id">
                            <v-list-item-avatar>
                              <v-img :src="item.reqAvatar"></v-img>
                            </v-list-item-avatar>

                            <v-list-item-content>
                              <v-list-item-title v-text="item.reqUsername"></v-list-item-title>
                              <v-list-item-subtitle v-text="item.reqMessage"></v-list-item-subtitle>
                            </v-list-item-content>
                            <v-spacer></v-spacer>
                            <v-list-item-action>
                              <v-btn icon
                                     @click="handleRequest(item.id, item.friendReqId, 0)">
                                <v-icon color="error">mdi-close</v-icon>
                              </v-btn>
                            </v-list-item-action>
                            <v-list-item-action>
                              <v-btn @click="handleRequest(item.id, item.friendReqId, 1)"
                                     icon>
                                <v-icon color="success">mdi-check</v-icon>
                              </v-btn>
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1"
                             large
                             text
                             @click="reqDialog = false">关闭</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item>

              <v-list-item>
                <v-btn color="primary"
                       @click.stop="createDialog = true">创建群组
                  <v-icon>mdi-account-multiple-plus</v-icon>
                </v-btn>
                <!-- "创建群组"对话框 -->
                <v-dialog v-model="createDialog"
                          max-width="300px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">创建群组</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-container>
                        <v-text-field label="群组名*"
                                      v-model="createRoomName"
                                      required></v-text-field>
                      </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1"
                             text
                             @click="createDialog = false">关闭</v-btn>
                      <v-btn color="blue darken-1"
                             text
                             @click="createRoom()">创建</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-divider vertical
                           class="mx-4"
                           inset></v-divider>
                <v-btn color="primary"
                       @click.stop="enterDialog = true">加入群组
                  <v-icon>mdi-message-plus</v-icon>
                </v-btn>
                <!-- "加入群组"对话框 -->
                <v-dialog v-model="enterDialog"
                          max-width="300px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">加入群组</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-container>
                        <v-text-field label="群组名*"
                                      v-model="enterRoomName"
                                      required></v-text-field>
                      </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1"
                             text
                             @click="enterDialog = false">关闭</v-btn>
                      <v-btn color="blue darken-1"
                             text
                             @click="enterRoom()">加入</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
      <v-snackbar v-model="snackbar"
                  color="success"
                  timeout="3000"
                  top>
        <v-icon>mdi-alert-circle-outline</v-icon>
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-btn dark
                 text
                 v-bind="attrs"
                 @click="snackbar = false">
            关闭
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
    <!-- <BottomBar :show='show'
               :friendId='friendId' /> -->
  </v-app>
</template>

<script>
import TopBar from '@/components/TopBar'
import ChatFrame from '@/components/ChatFrame'
import { mapGetters } from 'vuex'

import * as friendsApi from '@/api/friends'
import * as roomApi from '@/api/room'

export default {
  name: 'Main',
  components: { TopBar, ChatFrame },
  created () {
    this.getFriends()
    this.getRooms()
  },
  computed: {
    ...mapGetters([
      'id'
    ])
  },
  data () {
    return {
      //当前聊天对象id
      toId: '',
      //好友列表
      friends: [],
      //房间列表
      rooms: [],
      //聊天类型
      type: '',
      //房间用户列表
      roomUsers: [],

      //显示聊天页面
      showChatFrame: false,
      //添加好友对话框
      addDialog: false,
      //好友申请对话框
      reqDialog: false,
      //删除好友对话框
      deleteDialog: false,
      //退出房间对话框
      leaveRoomDialog: false,
      //加入房间对话框
      enterDialog: false,
      //创建房间对话框
      createDialog: false,
      //显示房间用户列表
      roomUserDialog: false,

      //添加好友名
      friendReqUsername: '',
      //好友申请信息
      requestMessage: '',
      //加入房间名
      enterRoomName: '',
      //创建房间名
      createRoomName: '',
      //消息提示
      snackbar: false,
      //消息内容
      text: '',

      //请求列表
      requests: [],
    }
  },
  methods: {
    //展示聊天页面
    isShow () {
      this.show = !this.show
    },
    //获取好友列表
    getFriends () {
      friendsApi.getFriends(this.id).then(response => {
        //追加active
        this.friends = response.data.friends.map(e => {
          return {
            active: false,
            ...e
          }
        })
      })
    },
    //获取房间列表
    getRooms () {
      roomApi.getRooms(this.id).then(response => {
        this.rooms = response.data.rooms.map(e => {
          return {
            active: false,
            ...e
          }
        })
      })
    },
    chatWithRoom (name) {
      for (var i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].name == name) {
          this.rooms[i].active = true;
          this.toId = this.rooms[i].id
          this.chating = this.rooms[i].name
        } else {
          this.rooms[i].active = false;
        }
      }
      this.type = 'room'
      this.showChatFrame = true
    },
    chatWithFriend (name) {
      for (var i = 0; i < this.friends.length; i++) {
        if (this.friends[i].friendName == name) {
          this.friends[i].active = true;
          this.toId = this.friends[i].friendId
          this.chating = this.friends[i].friendName
        } else {
          this.friends[i].active = false;
        }
      }
      this.type = 'single'
      this.showChatFrame = true
    },
    sendRequest () {
      friendsApi.sendRequest(this.id, this.friendReqUsername, this.requestMessage).then(response => {
        if (response.code === 20000) {
          this.text = response.message
          this.snackbar = true
          this.friendReqUsername = ''
          this.requestMessage = ''
        }
        this.addDialog = false
      })
    },
    getRequests () {
      this.reqDialog = true
      friendsApi.getRequests(this.id).then(response => {
        console.log(response.data.reqs)
        this.requests = response.data.reqs
      })
    },
    handleRequest (reqId, friendReqId, accept) {
      console.log(this.id + ", friend:" + friendReqId + ",accept:" + accept)
      friendsApi.handleRequest(reqId, this.id, friendReqId, accept).then(response => {
        this.text = response.message
        this.snackbar = true
        this.getFriends()
      })
      this.reqDialog = false
    },
    createRoom () {
      roomApi.createRoom(this.createRoomName).then(response => {
        if (response.code === 20000) {
          this.text = response.message
          this.snackbar = true
          this.createRoomName = ''
          this.createDialog = false
          this.getRooms()
        }
      })
    },
    enterRoom () {
      roomApi.enterRoom(this.enterRoomName, this.id).then(response => {
        if (response.code === 20000) {
          this.text = response.message
          this.snackbar = true
          this.enterRoomName = ''
          this.enterDialog = false
          this.getRooms()
        }
      })
    },
    deleteFriend (friendId) {
      console.log("delete =========");
      friendsApi.deleteFriend(this.id, friendId).then(response => {
        this.text = response.message
        this.snackbar = true
        this.deleteDialog = false
        this.getFriends()
      })
    },
    leaveRoom (roomId) {
      roomApi.leaveRoom(roomId, this.id).then(response => {
        this.text = response.message
        this.snackbar = true
        this.leaveRoomDialog = false
        this.getRooms()
      })
    },
    //获取房间用户
    getUsers (roomId) {
      roomApi.getUsers(roomId).then(response => {
        this.roomUsers = response.data.roomUsers
      })
    }
  },
}
</script>

<style>
</style>