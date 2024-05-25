<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark" v-has="`btn.Trademark.add`">添加品牌</el-button>
      <el-table style="margin: 10px 0px;" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row }">
            <img :src="row.logoUrl || '@/assets/images/yuan_feng.png'" @error="imageNotFound"
              style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button type="warning" size="small" icon="Edit" @click="() => updateTrademark(row)"></el-button>
            <el-popconfirm :title="`您确定要删除${ row.tmName }吗？`" width="220px" icon="Delete" @confirm="() => removeTradeMark(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <el-pagination @size-change="sizeChange" @current-change="changePageNo" v-model:current-page="pageNo"
          v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
          layout=" prev, pager, next, jumper,->, total, sizes" :total />
      </div>
    </el-card>
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%;" :model="trademarkParams" :rules ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
import type { Records, TradeMarkResponseData, TraderMark } from '@/api/product/trademark/type'
import { UploadProps, ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let limit = ref<number>(3)
let total = ref<number>(0)
let trademarkArr = ref<Records>([])
let dialogFormVisible = ref<boolean>(false)
let trademarkParams = reactive<TraderMark>({
  tmName: '',
  logoUrl: ''
})
const formRef = ref()
const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数必须大于等于两位'))
  }
}
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack('LOGO图片务必上传')
  }
}
const rules = {
  tmName: [
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, trigger: 'change', validator: validatorLogoUrl }
  ]
}
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

onMounted(() => {
  getHasTrademark()
})
const getImageUrl = (path: any) => {
  return new URL(`../../../assets/images/${path}`, import.meta.url).href;
}
const imageNotFound = (event: any) => {
  event.target.src = getImageUrl('yuan_feng.png')
}
const changePageNo = (page: number) => {
  getHasTrademark(page)
}
const sizeChange = () => {
  getHasTrademark()
}
const addTrademark = () => {
  trademarkParams.id = 0
  trademarkParams.logoUrl = ''
  trademarkParams.tmName = ''
  dialogFormVisible.value = true
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
const updateTrademark = (row: TraderMark) => {
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true
  Object.assign(trademarkParams, row)
}
const cancel = () => {
  dialogFormVisible.value = false
}
const confirm = async () => {
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
    })
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
    })
  }
  dialogFormVisible.value = false
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
    if (rawFile.size < 4 * 1024 * 1024) {
      return true;
    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件大小必须小于4M'
      })
      return false;
    }
  } else {
    ElMessage({
      type: 'error',
      message: "上传文件格式务必为PNG|JPG|GIF"
    })
    return false
  }
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  trademarkParams.logoUrl = response.data
  formRef.value.clearValidate('logoUrl')
}
const removeTradeMark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if(result.code == 200){
    ElMessage({
      type: 'success',
      message: '删除品牌成功'
    })
  }else {
    ElMessage({
      type: 'success',
      message: '删除品牌失败'
    })
  }
  getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>