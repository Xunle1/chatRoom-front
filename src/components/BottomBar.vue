<template>
  <v-bottom-navigation v-show="show"
                       app
                       grow
                       color="teal">
    <!-- <v-row>
      <v-col cols="1">

      </v-col>
      <v-col>
        <v-form @submit.native.prevent>
          <v-text-field label="Type something..."
                        v-model="message"
                        append-outer-icon="mdi-send"
                        @click:append-outer="sendMessage"
                        @keyup.enter="sendMessage">

          </v-text-field>
        </v-form>
      </v-col>
      <v-col cols="3">

      </v-col>
    </v-row> -->

  </v-bottom-navigation>
</template>

<script>
import { mapGetters } from 'vuex'
import * as ws from '@/utils/ws'

export default {
  name: 'Bottom',
  props: ['show', 'friendId'],
  data () {
    return {
      menu: false,
      message: 'Hey!',
    }
  },
  created () {
    ws.initWebSocket(this.id)
  },
  computed: {
    ...mapGetters([
      'id'
    ])
  },
  methods: {
    sendMessage () {
      ws.sendPTPMessage(this.id, this.friendId, this.message)
      // ws.sendMassMessage(this.id, this.message)
      this.clearMessage()
    },
    clearMessage () {
      this.message = ''
    },
  },
}
</script>
