<template>
  <v-app>
    <TopBar />
    <v-main>
      <v-container class="fill-height"
                   fluid>
        <v-row align="center"
               justify="center">
          <v-col cols="12"
                 sm="8"
                 md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary"
                         dark
                         flat>
                <v-toolbar-title>注册</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form"
                        v-model="valid">
                  <v-text-field label="用户名"
                                v-model="username"
                                name="login"
                                prepend-icon="mdi-account"
                                :counter="10"
                                :rules="nameRules"
                                required
                                type="text"></v-text-field>
                  <v-text-field label="邮箱"
                                v-model="email"
                                :rules="emailRules"
                                name="login"
                                prepend-icon="mdi-account"
                                required
                                type="text"></v-text-field>
                  <v-text-field label="密码"
                                v-model="password"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="show1 ? 'text' : 'password'"
                                @click:append="show1 = !show1"
                                :rules="pwdRules"
                                counter
                                name="password"
                                prepend-icon="mdi-lock"
                                required></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary"
                       class="mr-4"
                       @click="login()">
                  登录
                </v-btn>
                <v-btn :color="color"
                       class="mr-4"
                       :loading='loading'
                       :disabled="!valid"
                       @click="handleRegister()">
                  注册
                </v-btn>
                <v-btn color="error"
                       class="mr-4"
                       @click="reset()">
                  重置
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-snackbar v-model="snackbar"
                  color="error"
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
  </v-app>
</template>

<script>
import TopBar from '@/components/TopBar'
import * as registerApi from '@/api/register'

export default {
  name: 'Register',

  components: { TopBar },
  data () {
    return {
      valid: true,
      username: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      pwdRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 8) || 'Min 8 characters',
      ],
      show1: false,
      loading: false,
      snackbar: false,
      text: '',
      color: '',
    }
  },
  methods: {
    reset () {
      this.$refs.form.reset()
    },
    handleRegister () {
      this.loading = true
      registerApi.register(this.username, this.email, this.password)
        .then(response => {
          console.log("regiger ==> " + response)
          this.snackbar = true
          this.text = response.data.message
          this.color = 'success'
          this.$router.push({ path: '/login' })
        })
        .catch((err) => {
          this.text = err
          this.snackbar = true
          this.loading = false
        })
    },
    login () {
      this.$router.push({ path: '/login' })
    },
  },
}
</script>
