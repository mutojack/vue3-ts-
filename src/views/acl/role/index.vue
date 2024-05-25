<template>
  <div>
    <el-card>
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索">
          <el-input placeholder="请你输入搜索职位关键字" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" :disabled="!Boolean(keyword)" @click="search">搜索</el-button>
          <el-button size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
      <el-button type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
      <el-table border style="margin: 10px 0;" :data="allRole">
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="职位名称" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
        <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
        <el-table-column label="操作" width="280px" align="center">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="User" @click="setPermission(row)">分配权限</el-button>
            <el-button type="warning" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
            <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px" @confirm="removeRole(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        :background="true" layout="prev,pager,next,jumper,->,sizes,total" :total @current-change="getHasRole"
        @size-change="sizeChange">

      </el-pagination>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="roleParams.id ? '更新职位' : '添加职位'">
      <el-form :model="roleParams" :rules ref="form">
        <el-form-item label="职位名称" prop="roleName">
          <el-input placeholder="请你输入职位名称" v-model="roleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="default" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="default" @click="save">确定</el-button>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮的权限</h4>
      </template>
      <template #default>
        <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all :default-checked-keys="selectArr"
          :props="defaultProps" />
      </template>
      <template #footer>
        <div style="flex: auto;">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="handler">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { reqAddOrUpdateRole, reqAllMenuList, reqAllRoleList, reqRemoveRole, reqSetPermission } from '@/api/acl/role';
import { MenuList, MenuResponseData, Records, RoleData, RoleResponseData } from '@/api/acl/role/type';
import { ref, onMounted, reactive, nextTick } from 'vue';
import useLayOutSettingStore from '@/store/modules/setting';
import { ElMessage } from 'element-plus';

const settingStore = useLayOutSettingStore()
const pageNo = ref<number>(1)
const pageSize = ref<number>(10)
const keyword = ref<string>('')
const allRole = ref<Records>([])
const total = ref<number>(0)
onMounted(() => {
  getHasRole()
})
const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  const result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
const sizeChange = () => {
  getHasRole()
}
const search = () => {
  getHasRole()
  keyword.value = ""
}
const reset = () => {
  settingStore.changeRefreshState()
}

const dialogVisible = ref<boolean>(false)
const roleParams = reactive<RoleData>({
  roleName: ''
})
const addRole = () => {
  dialogVisible.value = true
  Object.assign(roleParams, {
    id: 0,
    roleName: ''
  })
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  Object.assign(roleParams, row)
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const form = ref<any>()
const validateRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
const rules = {
  roleName: [
    { required: true, trigger: blur, validator: validateRoleName }
  ]
}
const save = async () => {
  await form.value.validate()
  const result: any = await reqAddOrUpdateRole(roleParams)
  if(result.code == 200){
    ElMessage({
      type: 'success',
      message: roleParams.id ? '更新成功' : '添加成功'
    })
    dialogVisible.value = false
    getHasRole(roleParams.id ? pageNo.value : 1)
  }
}

const drawer = ref<boolean>(false)
const menuArr = ref<MenuList>([])
const setPermission = async (row: RoleData) => {
  drawer.value = true
  Object.assign(roleParams, row)
  const result: MenuResponseData = await reqAllMenuList(roleParams.id as number)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
const defaultProps = {
  children: 'children',
  label: 'name'
}
const selectArr = ref<number[]>([])
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if(item.select && item.level == 4){
      initArr.push(item.id)
    }
    if(item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    } 
  })
  return initArr
}
const tree = ref<any>()
const handler = async () => {
  const roleId = roleParams.id
  const children = tree.value.getCheckedKeys()
  const parent = tree.value.getHalfCheckedKeys()
  const permissionId = children.concat(parent)
  const result: any = await reqSetPermission(roleId as number, permissionId)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '分配权限成功'
    })
    window.location.reload()
  }
}
const removeRole = async (id: number) => {
  const result: any = await reqRemoveRole(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>