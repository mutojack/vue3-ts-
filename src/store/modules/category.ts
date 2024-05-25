import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import { ref } from 'vue'
import type { CategoryObj, CategoryResponseData } from '@/api/product/attr/type'

const useCategoryStore = defineStore('Category', () => {
  const c1Arr = ref<CategoryObj[]>()
  const c1Id = ref<string | number>()
  const c2Arr = ref<CategoryObj[]>()
  const c2Id = ref<string | number>()
  const c3Arr = ref<CategoryObj[]>()
  const c3Id = ref<string | number>()
  const getC1 = async () => {
    const result: CategoryResponseData =  await reqC1()
    if(result.code == 200){
      c1Arr.value = result.data
    }
  }
  const getC2 = async () => {
    const result: CategoryResponseData = await reqC2(c1Id.value as (string | number))
    if(result.code == 200){
      c2Arr.value = result.data
    }
  }
  const getC3 = async () => {
    const result: CategoryResponseData = await reqC3(c2Id.value as (string | number))
    if(result.code == 200){
      c3Arr.value = result.data
    }
  }
  return {
    c1Id,
    c2Id,
    c3Id,
    c1Arr,
    c2Arr,
    c3Arr,
    getC1,
    getC2,
    getC3
  }
})

export default useCategoryStore