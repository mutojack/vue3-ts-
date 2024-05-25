<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0;">
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" :disabled="!Boolean(categoryStore.c3Id)"
          @click="addAttr">添加属性</el-button>
        <el-table border style="margin: 10px 0;" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag v-for="item in row.attrValueList" :key="item.id" style="margin: 5px;">{{ item.valueName
                }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row }">
              <el-button type="warning" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
              <el-popconfirm :title="`你确定要删除${row.attrName}吗？`" width="200px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请你输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="default" icon="Plus" :disabled="!Boolean(attrParams.attrName)"
          @click="addAttrValue">添加属性值</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
        <el-table border style="margin:10px 0px;" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input :ref="(vc: any) => inputArr[$index] = vc" @blur="() => toLook(row, $index)" v-if="row.flag"
                size="small" placeholder="请你输入属性值名称" v-model="row.valueName"></el-input>
              <div @click="() => toEdit(row, $index)" v-else>{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button type="danger" size="default" icon="Delete"
                @click="() => attrParams.attrValueList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save"
          :disabled="!(attrParams.attrValueList.length > 0)">保存</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()
const attrArr = ref<Attr[]>([])
const scene = ref<number>(0)
const attrParams = reactive<Attr>({
  attrName: "",
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3
})
const inputArr = ref<any>([])
watch(() => categoryStore.c3Id, () => {
  attrArr.value = []
  if (categoryStore.c3Id) getAttr()
})
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  const result: AttrResponseData = await reqAttr(c1Id as number, c2Id as number, c3Id as number)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}
const addAttr = () => {
  Object.assign(attrParams, {
    attrName: "",
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3
  })
  scene.value = 1
  attrParams.categoryId = categoryStore.c3Id as number
}
const updateAttr = (row: Attr) => {
  scene.value = 1
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
const cancel = () => {
  scene.value = 0
}
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true
  })
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
const save = async () => {
  const result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'
    })
  }
}
const toLook = (row: AttrValue, $index: number) => {
  if (row.valueName?.trim() == '') {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }
  const repeat = attrParams.attrValueList.find(item => {
    if (item != row) {
      return item.valueName == row.valueName
    }
  })
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return
  }
  row.flag = false
}
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
const deleteAttr = async (attrId: number) => {
  const result = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getAttr()
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