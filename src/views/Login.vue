<template>
  <v-app>
    <TopBar :show='false' />
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
                <v-toolbar-title>登录</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form"
                        v-model="valid">
                  <v-text-field label="用户名"
                                v-model="loginInfo.username"
                                name="username"
                                :counter="10"
                                :rules="nameRules"
                                required
                                prepend-icon="mdi-account"
                                type="text"></v-text-field>

                  <v-text-field id="password"
                                v-model="loginInfo.password"
                                label="密码"
                                name="password"
                                :rules="pwdRules"
                                required
                                prepend-icon="mdi-lock"
                                type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary"
                       class="mr-4"
                       @click="handleLogin()"
                       :loading='loading'
                       :disabled="!valid">登录</v-btn>
                <v-btn color="primary"
                       class="mr-4"
                       @click="register()">注册</v-btn>
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
import * as loginApi from '@/api/login'
// import cookie from 'js-cookie'

export default {
  name: 'Login',

  components: { TopBar },
  created () {

  },
  data () {
    return {
      loginInfo: {
        username: '',
        password: '',
      },
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      pwdRules: [
        v => !!v || 'Password is required',
      ],
      loading: false,
      valid: true,
      snackbar: false,
      text: '',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    handleLogin () {
      this.validate()
      console.log("handle login")
      this.loading = true
      this.loginInfo.username.trim()
      loginApi.login(this.loginInfo.username, this.loginInfo.password).then(response => {
        const token = response.data.token
        this.$store.dispatch('Login', token).then(() => {
          this.loading = false
          this.$router.push({ path: this.redirect || '/' })
        }).catch((err) => {
          this.text = err
          this.loading = false
          this.snackbar = true
        })
      }).catch((err) => {
        console.log(err)
        this.loading = false
      })
      // this.$store.dispatch('Login', this.loginInfo).then(() => {
      //   this.loading = false
      //   this.$router.push({ path: this.redirect || '/' })
      // }).catch((err) => {
      //   this.text = err
      //   this.loading = false
      //   this.snackbar = true
      // })
    },
    register () {
      this.$router.push({ path: '/register' })
    }
  }
}
</script>
