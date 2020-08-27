<template>
  <div class="auth-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">
          {{ isLogin ? 'Sign in' : 'Sign up'}}  
        </h1>
        <p class="text-xs-center">
          <!-- <a href="">Have an account?</a> -->
          <nuxt-link v-if="isLogin" to="/register">
            Need an account?
          </nuxt-link>
          <nuxt-link v-else to="/login">
            Have an account?
          </nuxt-link>
        </p>

        <ul class="error-messages">
          <template v-for="(messages, field) in errors">
            <li
              v-for="(message, index) in messages" :key="index"
            >{{ field }} {{ message }} </li>
          </template>
          
        </ul>

        <form @submit.prevent="onSubmit">
          <fieldset class="form-group" v-if="!isLogin">
            <input class="form-control form-control-lg" v-model="user.username" type="text" placeholder="Your Name" required>
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" v-model="user.email" type="email" placeholder="Email" required>
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" minlength="8" v-model="user.password" type="password" placeholder="Password" required>
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">
            {{ isLogin ? 'Sign in' : 'Sign up' }}
          </button>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

// import request from '@/utils/request'
import { login, register } from '@/api/user'
const axios  = require('axios')
export default {
  middleware: 'notAuthenticated',
  name: 'LoginIndex',
  computed: {
    isLogin () {
      return this.$route.name === 'login'
    }
  },
  data() {
    return {
      user: {
        email: '',
        password: '',
        username: ''
      },
      errors: {} // 错误信息
    };
  },
  methods: {
    async onSubmit () {
      try {
        // 提交表单请求登录
        const { data } = this.isLogin
        ? await login({
          user: this.user
        })
        : await register({
          user: this.user
        })
        // TODO: 保存用户的登陆状态
        this.$store.commit('setUser', data.user)
        // 以上数据仅存储在内存中，当页面刷新以后，数据就会丢失，需要继续将数据持久化起来
        // 数据持久化 客户端和服务端都需要拿到
        Cookie.set('user', data.user)

        // 跳转到首页
        this.$router.push('/')
      } catch (error) {
        this.errors = error.response.data.errors
      }

    }
  },
  components: {},
};
</script>

<style scoped lang="scss">
</style>
