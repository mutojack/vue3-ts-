import SvgIcon from './SvgIcon/index.vue';
import Pagination from './Pagination/index.vue';
import Category from './Category/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const allGlobalComponent: any = { SvgIcon, Pagination, Category, ...ElementPlusIconsVue }
export default {
  install(app: any){
    Object.keys(allGlobalComponent).forEach(key => {
      app.component(key, allGlobalComponent[key])
    })
  }
}