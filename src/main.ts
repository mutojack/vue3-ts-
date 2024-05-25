import { createApp } from 'vue'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:svg-icons-register'
import globalComponent from '@/components'
import '@/styles/index.scss'
import router from './router'
import pinia from './store'
import './permission.ts'
import { isHasButton } from './directive/has.ts'

const app = createApp(App)
isHasButton(app)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(globalComponent)
app.use(router)
app.use(pinia)
app.mount('#app')
