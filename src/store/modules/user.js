import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

// action可执行异步操作
const actions = {
  // 登陆方法
  login({ commit }, userInfo) {
    //解构获取 username  password
    const { username, password } = userInfo
    //return Promise
    return new Promise((resolve, reject) => {
      //login request method
      login({ username: username.trim(), password: password }).then(response => {
        //解构获取响应的 data
        const { data } = response
        //set vuex token
        commit('SET_TOKEN', data.token)
        //set cookie token
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 从Vuex中获取token，用于发送request获取用户信息
      getInfo(state.token).then(response => {
        const { data } = response
        //data为null，return reject()
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        //设置姓名和头像
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

