<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SKU名称">
        <el-input v-model="skuParams.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuParams.price" placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(g)">
        <el-input v-model="skuParams.weight" placeholder="重量(g)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="SKU描述">
        <el-input v-model="skuParams.skuDesc" placeholder="SKU描述" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item v-for="(item, index1) in attrArr" :key="item.id" :label="item.attrName">
            <el-select placeholder="请选择" style="width: 100px;" v-model="item.attrIdAndValueId">
              <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index2) in item.attrValueList"
                :key="attrValue.id" :label="attrValue.valueName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item v-for="(item, index1) in saleArr" :key="item.id" :label="item.saleAttrName">
            <el-select v-model="item.saleIdAndValueId" placeholder="请选择" style="width: 220px;">
              <el-option :value="`${item.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index2) in item.spuSaleAttrValueList" :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table border :data="imgArr" ref="table">
          <el-table-column type="selection" width="80px" align="center"></el-table-column>
          <el-table-column label="图片">
            <template #="{ row, $index }">
              <img :src="row.imgUrl" alt="" style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button type="warning" size="small" @click="handler(row)">设置默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="save">保存</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu'
import { SkuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue'

let $emits = defineEmits(['changeScene'])
let attrArr = ref<any>([])
let saleArr = ref<any>([])
let imgArr = ref<any>([])
let skuParams = reactive<SkuData>({
  category3Id: "",
  spuId: "",
  tmId: "",
  skuName: "",
  price: "",
  weight: "",
  skuDesc: "",
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: ""
})
let table = ref<any>()

const cancel = () => {
  $emits('changeScene', { flag: 0, params: '' })
}
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId

  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  let result1: any = await reqSpuHasSaleAttr(spu.id)
  let result2: any = await reqSpuImageList(spu.id)
  attrArr.value = result.data
  saleArr.value = result1.data
  imgArr.value = result2.data
}
const handler = (row: any) => {
  table.value.clearSelection()
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}
const save = async () => {
  skuParams.skuAttrValueList = attrArr.value.reduce((pre: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      pre.push({
        attrId,
        valueId
      })
    }
    return pre
  }, [])
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((pre: any,next: any) => {
    if(next.saleIdAndValueId){
      let [saleAttrId,saleAttrValueId] = next.saleIdAndValueId.split(':')
      pre.push({
        saleAttrId,
        saleAttrValueId
      })
    }
    return pre
  },[])
  let result: any = await reqAddSku(skuParams)
  if(result.code == 200){
    ElMessage({
      type: 'success',
      message: '添加SKU成功'
    })
    $emits('changeScene',{flag: 0})
  }else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败'
    })
  }
}
defineExpose({
  initSkuData
})
</script>

<style scoped></style>