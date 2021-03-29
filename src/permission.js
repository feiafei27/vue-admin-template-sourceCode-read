import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

//上方进度条的使用
NProgress.configure({ showSpinner: false}) // NProgress Configuration

//白名单路由
const whiteList = ['/login'] // no redirect whitelist

//每次路由前，触发执行的函数
router.beforeEach(async(to, from, next) => {
  console.log(to.path)
  // start progress bar
  NProgress.start()

  // 设置 title 的内容
  document.title = getPageTitle(to.meta.title)

  // 从 cookie 中获取存储的token
  const hasToken = getToken()

  //如果 token 存在的话
  if (hasToken) {
    //如果前往是登陆页面的话,next()函数跳转
    if (to.path === '/login') {
      // 如果跳转的是 login 页面的话，放行到主页面，
      // 那么为什么不直接放行到login页面呢？因为用户有可能在已经登陆的状态下直接在导航栏中输入/login,
      // 企图跳转到登录页面，但此时用户的token还是保存在cookie中的，也就是说用户还是登陆状态，就这样直接
      // 跳转到login页面的话，在逻辑上会不严谨，框架希望用户点击右上角的Log Out按钮进行跳转到login页面。
      next({ path: '/' })
      NProgress.done()
    } else {
      //除登陆页面外的其他页面执行的路径
      //获取用户的 name
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        //如果有的话，直接放行
        next()
      } else {
        try {
          // 如果没有的话，就视图通过存储的 token 请求获取 userInfo
          await store.dispatch('user/getInfo')
          //成功获取 userInfo的话，放行
          next()
        } catch (error) {
          //如果获取userInfo失败的话,跳转到登陆页面
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    //如果没有token的话，那就查看此次跳转到路径是否在白名单之中，如果在的话，直接放行
    //否则 跳转到 登录页面
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
