import Cookies from 'js-cookie'

//token key
const TokenKey = 'vue_admin_template_token'

//获取token
export function getToken() {
  return Cookies.get(TokenKey)
}

//设置key
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

//移除key
export function removeToken() {
  return Cookies.remove(TokenKey)
}
