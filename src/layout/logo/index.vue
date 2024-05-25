<template>
  <div class="logo" v-show="!setting.logoHide">
    <img :src="setting.logo" alt="">
    <Transition name="fade">
      <p v-show="!layOutSettingStore.fold">{{ setting.title }}</p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import setting from '@/setting'
  import useLayOutSettingStore from '@/store/modules/setting'

  let layOutSettingStore = useLayOutSettingStore()
</script>

<script lang="ts">
export default {
  name: 'Logo'
}
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  padding: 10px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    font-size: $base-logo-title-fontSize;
    color: rgb(0, 0, 0);
    margin-left: 10px;
  }
}
.fade-enter-active {
  animation: fade-in 0.6s;
}
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>