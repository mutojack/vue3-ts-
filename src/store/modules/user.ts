import { defineStore } from 'pinia'
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { ref } from 'vue'
import { constantRoute, asyncRoute, anyRoute } from '@/router/routers'
import { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type'
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'

function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

let useUserStore = defineStore('User', () => {
  const token = ref('')
  token.value = GET_TOKEN()
  const menuRoutes = ref(constantRoute)
  const user = ref<UserState>({
    username: '',
    avatar: '',
    buttons: []
  })
  const userLogin = async (data: loginFormData) => {
    let result: loginResponseData = await reqLogin(data)
    if (result.code == 200) {
      SET_TOKEN(result.data as string)
      token.value = GET_TOKEN()
      return "ok"
    } else {
      return Promise.reject(new Error(result.data))
    }
  }
  const userInfo = async () => {
    let result: userInfoResponseData = await reqUserInfo()
    if (result.code == 200) {
      user.value.username = result.data.name
      user.value.avatar = result.data.avatar
      user.value.buttons = result.data.buttons
      let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)
      menuRoutes.value = [...constantRoute,...userAsyncRoute, anyRoute];
      [...userAsyncRoute, anyRoute].forEach((route: any) => {
        router.addRoute(route)
      })
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }
  const userLogout = async () => {
    let result: any = await reqLogout()
    if (result.code == 200) {
      user.value.username = ''
      user.value.avatar = ''
      token.value = ''
      REMOVE_TOKEN()
      return 'ok'
    }else {
      return Promise.reject(new Error(result.message))
    }
  }
  return {
    token,
    menuRoutes,
    user,
    userLogin,
    userInfo,
    userLogout
  }
})

export default useUserStore;