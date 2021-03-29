<template>
  <div class="navbar">
    <!--  最左边的点击按钮组件  -->
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!--  面包屑组件  -->
    <breadcrumb class="breadcrumb-container" />

    <!--  最右边的头像按钮  -->
    <div class="right-menu">
      <!--   https://element.eleme.cn/#/zh-CN/component/dropdown   -->
      <el-dropdown class="avatar-container" trigger="click">
        <!--    下拉菜单 第一部分    -->
        <div class="avatar-wrapper">
          <!--     图片     -->
          <img :src="avatar" class="user-avatar">
          <!--     图标     -->
          <i class="el-icon-caret-bottom" />
        </div>
        <!--    下拉菜单 第二部分    -->
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  //组件
  components: {
    Breadcrumb,
    Hamburger
  },
  //计算属性
  computed: {
    ...mapGetters([
      //获取src/store/getters.js中的getter
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    //点击最左边按钮所触发的方法，dispatch 'app/toggleSideBar' action
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    //退出触发的方法
    async logout() {
      //执行退出前的重置操作
      await this.$store.dispatch('user/logout')
      //跳转路由到 /login,并将当前的路由作为参数，当用户再次登录成功后，能够直接跳转到当前页面
      console.log(this.$route.fullPath)
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
