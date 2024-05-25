<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue';
</script>

<script lang="ts">
export default {
  name: 'Tabbar'
}
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(to right,rgb(255, 255, 255),rgb(117, 164, 133),rgb(43, 93, 36));
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
    
  }
}
</style>