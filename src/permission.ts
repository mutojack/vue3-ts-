import router from '@/router'
import useUserStore from './store/modules/user'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from './store'
import setting from './setting'

nprogress.configure({ showSpinner: false })
const userStore = useUserStore(pinia)
router.beforeEach(async (to: any, from: any,next: any) => {
  nprogress.start()
  if(userStore.token){
    if(to.path == '/login'){
      next({ path: '/' })
    }else{
      if(userStore.user.username){
        next()
      }else{
        try {
          await userStore.userInfo()
          next({...to})
        } catch (error) {
          await userStore.userLogout()
          next({ path: '/login' })
        }
      }
    }
  }else{
    if(to.path=='/login'){
      next()
    }else{
      next({path: '/login'})
    }
  }
})
router.afterEach((to: any, from: any) => {
  nprogress.done()
  document.title = `${ setting.title } - ${ to.meta.title }`
})