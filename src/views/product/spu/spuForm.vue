<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="请你输入SPU的名称" v-model="spuParams.spuName"></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select placeholder="请选择" style="width: 160px;" v-model="spuParams.tmId">
          <el-option v-for="(item, index) in allTradeMark" :key="item.id" :label="item.tmName"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="请你输入SPU描述" v-model="spuParams.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU照片">
        <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handleUpdate">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" style="height: 100%;width: 100%;">
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <el-select v-model="saleAttrIdAndValueName"
          :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'" style="width: 160px;">
          <el-option :value="`${item.id}:${item.name}`" v-for="(item, index) in unSelectSaleAttr" :key="item.id"
            :label="item.name"></el-option>
        </el-select>
        <el-button @click="addSaleAttr" :disabled="!Boolean(saleAttrIdAndValueName)" style="margin-left: 10px;"
          type="primary" size="default" icon="Plus">添加属性值</el-button>
        <el-table border style="margin: 10px 0;" :data="saleAttr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
          <el-table-column label="销售属性值">
            <template #="{ row, $index }">
              <el-tag @close="row.spuSaleAttrValueList.splice(index, 1)"
                v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" closable style="margin: 0px 5px;">
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag" placeholder="请你输入属性值"
                size="small" style="width: 100px;"></el-input>
              <el-button @click="toEdit(row)" v-else type="success" size="small" icon="Plus"
                style="margin: 0px 5px;"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button type="danger" size="small" icon="Delete" @click="saleAttr.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="!(saleAttr?.length as number > 0)" type="primary" size="default"
          @click="save">保存</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SaleAttrValue, HasSaleAttr, SaleAttr, SpuImg, SpuData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, Trademark } from '@/api/product/spu/type'
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdate } from '@/api/product/spu'
import { ElMessage } from 'element-plus'

const $emit = defineEmits(['changeScene'])

const cancel = () => {
  $emit('changeScene', {flag: 0,params: 'update'})
}

const allTradeMark = ref<Trademark[]>([])
const imgList = ref<SpuImg[]>([])
const saleAttr = ref<SaleAttr[]>([])
const allSaleAttr = ref<HasSaleAttr[]>([])
const spuParams = ref<SpuData>({
  category3Id: "",
  spuName: "",
  description: "",
  tmId: "",
  spuImageList: [],
  spuSaleAttrList: []
})
const dialogVisible = ref<boolean>(false)
const dialogImageUrl = ref<string>('')
const saleAttrIdAndValueName = ref<string>('')
const handlePictureCardPreview = (file: any) => {
  dialogVisible.value = true
  dialogImageUrl.value = file.url
}
const handleRemove = () => {

}
const handleUpdate = (file: any) => {
  if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
    if (file.size < 1024 * 1024 * 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件务必在3M以内'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件务必是PNG|JPEG|GIF'
    })
    return false
  }
}
const initHasSpuData = async (spu: SpuData) => {
  spuParams.value = spu
  const result: AllTradeMark = await reqAllTradeMark()
  const result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  const result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  const result3: HasSaleAttrResponseData = await reqAllSaleAttr()

  allTradeMark.value = result.data
  imgList.value = result1.data.map(item => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  saleAttr.value = result2.data
  allSaleAttr.value = result3.data
}
let unSelectSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter(item => {
    return saleAttr.value.every(item1 => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  saleAttr.value.push(newSaleAttr)
  saleAttrIdAndValueName.value = ''
}
const toEdit = (row: SaleAttr) => {
  row.saleAttrValue = ''
  row.flag = true
}
const toLook = (row: SaleAttr) => {
  const { baseSaleAttrId, saleAttrValue } = row

  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string
  }

  if (saleAttrValue?.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }

  let repeat = row.spuSaleAttrValueList.find(item => item.saleAttrValueName == saleAttrValue)
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复'
    })
    return
  }

  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}
const save = async () => {
  spuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url
    }
  })
  spuParams.value.spuSaleAttrList = saleAttr.value
  const result = await reqAddOrUpdate(spuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新成功' : '添加成功'
    })
    $emit('changeScene', {flag: 0, params: spuParams.value.id ? 'update' : 'add'})
  } else {
    ElMessage({
      type: 'error',
      message: spuParams.value.id ? '更新失败' : '添加失败'
    })
  }
}
const initAddSpu = async (c3Id: string | number) => {
  Object.assign(spuParams.value, {
    category3Id: "",
    spuName: "",
    description: "",
    tmId: "",
    spuImageList: [],
    spuSaleAttrList: []
  })
  imgList.value = []
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''

  spuParams.value.category3Id = c3Id
  const result: AllTradeMark = await reqAllTradeMark()
  const result1: HasSaleAttrResponseData = await reqAllSaleAttr()
  allTradeMark.value = result.data
  allSaleAttr.value = result1.data
}
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>