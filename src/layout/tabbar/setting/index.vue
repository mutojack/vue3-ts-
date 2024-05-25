<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-popover placement="bottom" title="主题设置" :width="300" :height="500" triggle="click">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker @change="setColor" v-model="color" size="default" show-alpha :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch @change="changeDark" v-model="dark" size="default" active-icon="Moon" inactive-icon="Sunny" inline-prompt></el-switch>
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img :src="userStore.user.avatar" style="width: 30px;height: 30px;margin: 0 10px;border-radius: 15px;">
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.user.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

let layOutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()
const $router = useRouter()
const updateRefresh = () => {
  layOutSettingStore.changeRefreshState()
}
const fullScreen = () => {
  const full = document.fullscreenElement;
  console.log(document.fullscreenElement)
  if(!full){
    document.documentElement.requestFullscreen()
  }else{
    document.exitFullscreen()
  }
}
const logout = async () => {
  await userStore.userLogout()
  $router.replace({path:'/login'})
}

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const dark = ref<boolean>(false)
const changeDark = () => {
  const html = document.documentElement
  dark.value ? html.className = 'dark' : html.className = ''
}
const setColor = () => {
  const html = document.documentElement;
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<script lang="ts">
export default {
  name: 'Setting'
}
</script>

<style scoped lang="scss">
.el-dropdown-link {
  color: rgb(255, 0, 0);
}
</style>