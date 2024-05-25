<template>
  <div class="box6">
    <div class="title">
      <p>热门景区排行</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

const charts = ref()
onMounted(() => {
  const mycharts = echarts.init(charts.value)
  mycharts.setOption({
    title: {
      text: '景区排行',
      left: '47%',
      textStyle: {
        color: 'yellowgreen',
        fontSize: 20
      }
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {},
    grid: {
      left: 20,
      bottom: 20,
      right: 20,
    },
    series: [
      {
        type: 'bar',
        data: [10,20,30,40,50,60,70],
        label: {
          show: true,
          position: 'insideTop'
        },
        showBackground: true
      },
      {
        type: 'line',
        data: [10,20,30,40,50,60,70]
      }
    ],
    tooltip: {}
  })
})
</script>

<style scoped lang="scss">
.box6 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;
  .title {
    p {
      color: white;
      font-size: 18px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>