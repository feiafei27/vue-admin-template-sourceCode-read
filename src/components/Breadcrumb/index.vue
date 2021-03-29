<template>
  <!-- https://element.eleme.cn/#/zh-CN/component/breadcrumb -->
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!--  这个标签起到实现动画的效果  -->
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <!--    如果该路由的redirect==='noRedirect'或者当前路由是最后一个路由的话，就渲染成无法跳转的路由    -->
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <!--    否则就渲染成能够跳转的路由    -->
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
//path-to-regexp库的使用：https://www.cnblogs.com/cangqinglang/p/10789937.html,可以看看这一篇博客
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      //核心数据
      levelList: null
    }
  },
  watch: {
    //利用Vue的watch监听$route,如果$route有变更的话，调用getBreadcrumb方法,重置levelList数据.
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    //刚启动时，调用getBreadcrumb方法,算出levelList。
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      //获取第一个路由
      const first = matched[0]
      //查看第一个路由是不是 Dashboard。
      if (!this.isDashboard(first)) {
        //如果第一个路由不是Dashboard的话，将Dashboard添加刀数组头部.
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }

      //进行进一步的filter，要求item.meta的bool为true，item.meta.title的bool为true，item.meta.breadcrumb === true
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    //查看路由是不是 Dashboard。
    isDashboard(route) {
      // route的简要结构
      // {
      //   name:"Form"
      // }
      //
      // &&意为且，当route的bool为false时，name等于route；当route的bool为true时，name等于route.name.
      // 如果route = {name:"Form"},那么name = "Form".
      const name = route && route.name
      //如果name的bool为false的话，直接return false，因为bool为false的话，其就不可能等于Dashboard.
      if (!name) {
        return false
      }
      //将name和'Dashboard'转换成小写，进行比较，返回相应的bool值。
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    //计算要跳转的路由,利用 path-to-regexp 第三方库实现
    pathCompile(path) {
      //path-to-regexp库的使用：https://www.cnblogs.com/cangqinglang/p/10789937.html,可以看看这一篇博客
      //获取参数
      const { params } = this.$route
      //下面的方法起到参数填充的作用
      //例如 path = ‘/user/:id/:name’;params = {id: 10001, name: 'bob'}
      //最终返回的结果就是:/user/10001/bob
      return pathToRegexp.compile(path)(params)
    },
    //点击面包屑中链接触发的方法。
    //item为点击的路由,其结构可以参考router/index.js中的路由项.
    handleLink(item) {
      //结构语法获取redirect和path
      const { redirect, path } = item
      //如果redirect存在的话
      //直接跳转，return.
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      //如果redirect不存在的话，那么跳转的 path 有可能是动态路由，类似于'/user/:id/:name',
      //这种情况下，我们就不能直接push了，我们还需要将路由的参数填充到'/user/:id/:name'中，获取我们真正能够跳转的路由
      //调用pathCompile计算出要跳转的路由。
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
