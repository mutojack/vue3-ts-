import { defineStore } from 'pinia'
import { ref } from 'vue'

let useLayOutSettingStore = defineStore('SettingStore',() => {
  let fold = ref(false)
  let refresh = ref(false)
  const changeFoldState = () => {
    fold.value = !fold.value
  }
  const changeRefreshState = () => {
    refresh.value = !refresh.value
  }
  return {
    fold,
    refresh,
    changeFoldState,
    changeRefreshState
  }
})

export default useLayOutSettingStore