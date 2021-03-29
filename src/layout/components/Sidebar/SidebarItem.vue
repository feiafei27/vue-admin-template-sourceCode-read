<template>
  <!-- 如果该路由的 hidden 的设置为true的话，就不在侧边栏显示 -->
  <div v-if="!item.hidden">
    <!--  当只有一个显示的路由，且其没有子路由或noShowingChildren=true，且其alwaysShow=false  -->
    <!--  这种显示情况是当前路由是最终显示的路由，才会这样渲染  -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <!--  当还有多个可显示的子路由时，执行下面的渲染  -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <!--   渲染当前路由的icon和title   -->
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!--   渲染当前路由的子路由,还是调用当前的组件，有点递归调用的味道   -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    //parent是当前的路由,children是其子路由.
    hasOneShowingChild(children = [], parent) {
      //对当前路由的子路由进行filter过滤
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          //如果该子路由设置hidden为true的话，return false，将其过滤掉
          return false
        } else {
          // 模板设置(当只有一个显示的子路由时将被使用)
          // 将当前子路由设置到 onlyOneChild 上.
          // 这样做的结果就是每次都是最后hidden为false的子路由设置到 onlyOneChild 上.
          // 至于 onlyOneChild 用不用，还要看是否只有一个显示的路由.
          this.onlyOneChild = item
          return true
        }
      })

      // 当可显示的路由只有一个时，return true
      if (showingChildren.length === 1) {
        return true
      }

      // 当其可显示的路由为0时，说明当前路由就是最终显示的路由
      // 所以将 parent 解构到 onlyOneChild 上，并且return true,并将 noShowingChildren 属性设置为true作为标记
      if (showingChildren.length === 0) {

        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      // 当下级可显示的路由有多个时，return false，
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
