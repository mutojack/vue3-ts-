<template>
  <div>
    <el-container class="layout_container">
      <el-aside :class="{'layout_slider': true, 'fold': LayOutSettingStore.fold }">
        <Logo></Logo>
        <el-scrollbar class="aside_scroll">
          <el-menu :collapse="LayOutSettingStore.fold" :default-active="$route.path" background-color="transparent" text-color="black" active-text-color="deeppink" router>
            <Menu :menuList="userStore.menuRoutes"></Menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header class="layout_tabbar">
          <Tabbar></Tabbar>
        </el-header>
        <el-main class="layout_main">
          <el-scrollbar>
            <Main></Main>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import useUserStor from '@/store/modules/user'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import { useRoute } from 'vue-router'
import useLayOutSettingStore from '@/store/modules/setting'

let userStore = useUserStor()
const $route = useRoute()
let LayOutSettingStore = useLayOutSettingStore()

</script>

<script lang="ts">
export default {
  name: 'Layout'
}
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  background-color: white;
  .layout_slider {
    width: $base-menu-width;
    background: url(../assets/images/slider.jpg) no-repeat;
    background-position: 50% 10%;
    background-size: 180% 100%;
    transition: all 0.3s;
    &.fold {
      width: $base-menu-min-width;
      background-color: rgb(255, 255, 255);
      background-image: none;
    }
    .aside_scroll {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    height: $base-tabbar-height;
    padding: 0 0;
  }

  .layout_main {
    background-color: azure;
    
  }
}
</style>