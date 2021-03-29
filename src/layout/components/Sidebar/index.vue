<template>
  <div :class="{'has-logo':showLogo}">
    <!--  最上边的Logo  -->
    <logo v-if="showLogo" :collapse="isCollapse" />

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"

          :item="route"
          :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import Cookies from "js-cookie";

export default {
  components: { SidebarItem, Logo },
  computed: {
    // sidebar的数据结构
    // sidebar: {
    //   opened: true or false,
    //   withoutAnimation: true or false
    // },
    ...mapGetters([
      'sidebar'
    ]),
    //获取路由表文件中配置的路由项数组
    routes() {
      return this.$router.options.routes
    },
    //获取当前(活动)的路由项
    activeMenu() {
      //当前的路由项
      console.log(this.$route)
      const route = this.$route
      //解构获取meta,path
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      //如果设置了activeMenu，则返回meta中设置的activeMenu，
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      //否则返回当前的路由
      return path
    },
    //获取src/settings.js中的 sidebarLogo 配置属性
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    //获取 '@/styles/variables.scss' 中的变量,可利用这个实现全局的样式替换
    variables() {
      return variables
    },
    //返回侧边栏是否关闭
    //从Vuex中获取数据
    // sidebar: {
    //   opened: true or false,
    //   withoutAnimation: true or false
    // },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
