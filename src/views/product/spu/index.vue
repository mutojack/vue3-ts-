<template>
  <div>
    <Category :scene></Category>
    <el-card style="margin:10px 0px;">
      <div v-show="scene == 0">
        <el-button @click="addSpu" type="primary" size="default" icon="Plus"
          :disabled="!Boolean(categoryStore.c3Id)">添加SPU</el-button>
        <el-table style="margin:10px 0px;" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
              <el-button type="warning" size="small" icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
              <el-button type="info" size="small" icon="View" title="查看SKU列表" @click="findSku(row)"></el-button>
              <el-popconfirm :title="`你确定要删除${row.spuName}吗？`" width="200px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
          :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total @current-change="getHasSpu"
          @size-change="changeSize">
        </el-pagination>
      </div>
      <SpuForm ref="spuForm" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
      <SkuForm ref="skuForm" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type'
import { ref, watch, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()
const scene = ref<number>(0)
const pageNo = ref<number>(1)
const pageSize = ref<number>(3)
const records = ref<Records>([])
const total = ref<number>(0)
const spuForm = ref<any>()
const skuForm = ref<any>()
const skuArr = ref<SkuData[]>([])
const show = ref<boolean>(false)

watch(() => categoryStore.c3Id, () => {
  if (!categoryStore.c3Id) return
  getHasSpu()
})
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  const result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id as number)
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
const changeSize = () => {
  getHasSpu()
}
const addSpu = () => {
  scene.value = 1
  spuForm.value.initAddSpu(categoryStore.c3Id)
}
const updateSpu = (row: SpuData) => {
  scene.value = 1
  spuForm.value.initHasSpuData(row)
}
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    getHasSpu(pageNo.value)
  } else {
    getHasSpu()
  }
}
const addSku = (row: SpuData) => {
  scene.value = 2
  skuForm.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true
  }
}
const deleteSpu = async (row: SpuData) => {
  let result: any = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
onBeforeUnmount(() => {
  categoryStore.c1Arr = []
  categoryStore.c1Id = ''
})
</script>

<style scoped></style>