<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules"
             class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin">Login</el-button>

      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div>

    </el-form>
  </div>
</template>

<script>
// export function validUsername(str) {
//   const valid_map = ['admin', 'editor']
//   return valid_map.indexOf(str.trim()) >= 0
// }

//导入验证 username 的函数
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    //定义验证 username 的函数
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        //不通过的话，回调传入的函数，参数为 Error 对象
        callback(new Error('Please enter the correct user name'))
      } else {
        //通过的话，回调传入的函数，不传参数
        callback()
      }
    }
    //定义验证 password 的函数
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      //接受输入框的值
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      //定义 username 和 password 的规则
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      //标识是否显示 loading 的字段
      loading: false,
      //password的type
      passwordType: 'password',
      //登陆成功，会跳转的路径
      redirect: undefined
    }
  },
  watch: {
    //监听路由的change，当用户从主页面的某个页面退出到登陆页面时，会将当前路径当做参数拼接在login?后面
    //例如http://localhost:9528/#/login?redirect=/form/index
    //此时里面的handler函数便会将后面拼接的路径赋值给data.redirect,以便登陆成功时直接跳转到改路径
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      //这样使用watch时有一个特点，就是当值第一次绑定的时候，不会执行监听函数，只有值发生改变才会执行。
      //如果我们需要在最初绑定值的时候也执行函数，则就需要用到immediate属性。

      //比如当父组件向子组件动态传值时，子组件props首次获取到父组件传来的默认值时，
      //也需要执行函数，此时就需要将immediate设为true
      immediate: true
    }
  },
  methods: {
    //点击 password 后面的按钮执行的方法，使其显示或者隐藏密码明文字符串。
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        //使password获得焦点
        this.$refs.password.focus()
      })
    },
    //点击 Login 触发的函数
    handleLogin() {
      //进行form的验证
      this.$refs.loginForm.validate(valid => {
        //验证通过的话。
        if (valid) {
          //显示 loading
          this.loading = true
          //向vuex提交 user/login action,将this.loginForm提交进去
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            //登陆成功 跳转到this.redirect，如果为空的话，就跳转到 /
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
