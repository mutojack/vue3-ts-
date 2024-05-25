<template>
  <div class="login_container">
    <el-row>
        <el-col :span="8" :xs="1"></el-col>
        <el-col :span="10" :xs="22">
          <transition
            appear
            name="animate__animated animate__bounce"
            enter-active-class="animate__backInDown"
          >
            <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                <h1>Hello</h1>
                <h2>欢迎来到家尚运营平台</h2>
                <el-form-item prop="username">
                  <el-input class="login_input" :prefix-icon="User" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input class="login_input" :prefix-icon="Lock" type="password" v-model="loginForm.password" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :loading class="login_btn" type="primary" size="default" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
          </transition>
        </el-col>
        <el-col :span="6" :xs="1"></el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { User,Lock } from '@element-plus/icons-vue'
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElNotification } from 'element-plus'
  import { getTime } from '@/utils/time'
  import useUserStore from '@/store/modules/user.ts'
  import 'animate.css'
  
  let useStore = useUserStore()
  let $router = useRouter()
  let loginForm = reactive({
    username: '',
    password: ''
  })
  const loginForms = ref()
  const validateUsername = (rule: any, value: any, callback: any) => {
    if(/^[\u4e00-\u9fa5a-zA-Z0-9]{5,12}$/.test(value)){
      callback()
    }
    callback(new Error('用户名只能是5-12位的中文，英文或数字'))
  }
  const validatePassword = (rule: any, value: any, callback: any) => {
    if(/^[a-zA-Z0-9]{6,12}$/.test(value)){
      callback()
    }
    callback(new Error('密码只能是由6-12位的英文或数字组成'))
  }
  const rules = {
    username: [
      { required:true, message: '用户名不能为空', trigger: "change" },
      { validator: validateUsername, trigger: 'change'}
    ],
    password: [
      { required:true, message: '密码不能为空', trigger: "change" },
      { validator: validatePassword, trigger: 'change'}
    ]
  }
  let loading = ref(false)
  const login = async () => {
    await loginForms.value.validate(); 
    loading.value = true
    try {
      await useStore.userLogin(loginForm)
      $router.push('/') 
      ElNotification({
        type: 'success',
        message: '欢迎回来',
        title: `Hi，${getTime()}好`
      })
      loading.value = false
    } catch (error) {
      console.dir(error)
      ElNotification({
        type: 'error',
        message: (error as Error).message
      })
      loading.value = false
    }
  }
</script>

<style scoped lang="scss">
  .login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/login_bak.jpeg') no-repeat;
    background-size: cover;
    .login_form {
      position: relative;
      width: 80%;
      top: 30vh;
      background-color: rgba(150,150,150, .3);
      border-radius: 3%;
      backdrop-filter: blur(5px);
      padding: 40px;
      color: rgb(255, 245, 245);
      h1 {
        font-size: 40px;
      }
      h2 {
        font-size: 20px;
        margin: 10px 0 20px 0;
      }
      .login_btn {
        width: 100%;
        height: 120%;
      }
      .login_input {
        height: 100%;
      }
    }
  }
</style>