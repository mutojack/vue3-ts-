<template>
  <el-icon style="margin-right: 10px;" @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" :to="item.path" v-show="item.meta.title != 'layout'">
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span style="margin: 0 5px;">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'

let LayOutSettingStore = useLayOutSettingStore()
const changeIcon = () => {
  LayOutSettingStore.changeFoldState()
}
let $route = useRoute() 
</script>

<script lang="ts">
export default {
  name: 'Breadcrumb'
}
</script>

<style scoped></style>