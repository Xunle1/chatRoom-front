<template>
  <v-app-bar app
             color="#fcb69f"
             dark
             src="https://picsum.photos/1920/1080?random">
    <v-container>
      <v-row align="center">
        <div class="d-flex align-center"
             @click="$router.push({ path: '/' })">
          <v-img alt="Vuetify Logo"
                 class="shrink mr-2"
                 contain
                 src="https://gitee.com/xunle1/drawing-bed/raw/master/typora%5C/20210726142011.png"
                 transition="scale-transition"
                 width="40" />
          <v-app-bar-title>聊天室</v-app-bar-title>
        </div>
        <v-col class="text-right"
               v-show="show">
          <v-menu v-model="menu"
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-y>
            <template v-slot:activator="{ on, attrs }">

              <v-avatar v-bind="attrs"
                        v-on="on">
                <img :src="avatar"
                     :alt="name">
              </v-avatar>
            </template>
            <!-- 点击头像出现的按钮 -->
            <v-card>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <img :src="avatar"
                         :alt="name">
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ sign }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary"
                       text
                       @click="logOut()">Log out</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TopBar',
  props: ['show'],
  data () {
    return {
      menu: false,
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name',
      'sign',
    ])
  },
  methods: {
    logOut () {
      this.menu = false
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  },
}
</script>
