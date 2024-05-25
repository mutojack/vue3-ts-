<template>
  <div>
    <el-card>
      <el-form :inline="true" class="form">
        <el-form-item label="用户名:">
          <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" :disabled="!Boolean(keyword)" @click="search">搜索</el-button>
          <el-button size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
      <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
      <el-button type="danger" size="default" @click="deleteSelectUser" :disabled="!Boolean(selectIdArr.length)">批量删除</el-button>
      <el-table @selection-change="selectChange" style="margin: 10px 0;" border :data="userArr">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
            <el-button type="warning" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.username}吗?`" width="260px" @confirm="deleteUser(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
        :background="true" layout="prev, pager, next, jumper,->, sizes, total" :total @current-change="getHasUser"
        @size-change="handler">

      </el-pagination>
    </el-card>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!Boolean(userParams.id)">
            <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto;">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色(职位)</h4>
      </template>
      <template #default> 
        <el-form>
          <el-form-item label="用户姓名">
            <el-input :value="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox @change="handlerCheckAllChange" v-model="checkAll" :indeterminate="isIndeterminate">全选</el-checkbox>
            <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="(role,index) in allRole" :key="role" :label="role" :value="role">{{ role.roleName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto;">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole, reqRemoveUser, reqSelectUser } from '@/api/acl/user'
import { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let userArr = ref<Records>([])
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
let userParams = reactive<User>({
  username: '',
  name: '',
  password: ''
})
let formRef = ref<any>()
let keyword = ref<string>('')

onMounted(() => {
  getHasUser()
})

const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value,keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
const handler = () => {
  getHasUser()
}
const addUser = () => {
  drawer.value = true
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
const updateUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
const save = async () => {
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateUser(userParams)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({ type: 'success', message: userParams.id ? '更新成功' : '添加成功' })
    // getHasUser(userParams.id ? pageNo.value : 1)
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({ type: 'error', message: userParams.id ? '更新失败' : '添加失败' })
  }
}
const cancel = () => {
  drawer.value = false
}
const validateUsername = (rule: any, value: any, callback: any) => {
  if (/^[\u4e00-\u9fa5a-zA-Z0-9]{5,12}$/.test(value)) {
    callback()
  }
  callback(new Error('用户名只能是5-12位的中文，英文或数字'))
}
const validateName = (rule: any, value: any, callback: any) => {
  if (/^[\u4e00-\u9fa5a-zA-Z0-9]{5,12}$/.test(value)) {
    callback()
  }
  callback(new Error('昵称只能是5-12位的中文，英文或数字'))
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (/^[a-zA-Z0-9]{6,12}$/.test(value)) {
    callback()
  }
  callback(new Error('密码只能是由6-12位的英文或数字组成'))
}
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: "blur" },
    { validator: validateUsername, trigger: 'blur' }
  ],
  name: [
    { required: true, message: '用户名不能为空', trigger: "blur" },
    { validator: validateName, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: "blur" },
    { validator: validatePassword, trigger: 'blur' }
  ]
}
let checkAll = ref<boolean>(false)
let isIndeterminate = ref<boolean>(true)
let allRole = ref<AllRole>([])
let userRole = ref<AllRole>([])
const setRole = async (row: User) => {
  Object.assign(userParams, row)
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200){
    allRole.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
    drawer1.value = true
  }
}
const handlerCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}
const confirmClick = async () => {
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map(item => item.id) as number[]
  }
  let result: any = await reqSetUserRole(data)
  if (result.code == 200){
    ElMessage({
      type: 'success',
      message: '分配职务成功'
    })
    drawer1.value = false
    getHasUser(pageNo.value)
  }
}
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200){
    ElMessage({type: 'success', message: '删除成功'})
    getHasUser(userArr.value.length > 1 ? pageNo.value : 1)
  }
}
const selectIdArr = ref<number[]>([])
const selectChange = (value: Records) => {
  selectIdArr.value = value.map(item => item.id as number)
}
const deleteSelectUser = async () => {
  let result: any = await reqSelectUser(selectIdArr.value)
  if (result.code == 200){
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : 1)   
  }
}
const search = () => {
    getHasUser()
    keyword.value = ''
}
let settingStore = useLayOutSettingStore()
const reset = () => {
   settingStore.changeRefreshState()
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>