<template>
  <div>
    <el-card style="background-color: rgb(227, 227, 227);">
      <div class="box">
        <img :src="userStore.user.avatar" class="avatar">
        <div class="bottom">
          <h3 class="title">{{ getTime() + '好呀' + userStore.user.username }}</h3>
          <p class="subtitle">家尚运营平台</p>
        </div>
      </div>
      <div class="bake">
        <img src="../../assets/images/Home.jpg" style="height: 600px;">
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'

const userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 10px;
    }
    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}
.bake {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>