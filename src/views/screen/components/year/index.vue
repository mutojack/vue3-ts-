<template>
  <div class="box7">
    <div class="title">
      <p>年度游客量对比</p>
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
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    title: {
      text: '散点图',
      left: '45%',
      textStyle: {
        color: 'yellowgreen',
        fontSize: 20
      }
    },
    xAxis: {
      type: 'category',
      show: true
    },
    yAxis: {
      show: false
    },
    grid: {
      left: 20,
      top: 20,
      right: 0,
      bottom: 20
    },
    series: {
      type: 'scatter',
      data: [33,88,21,9,788,234,1213,1231,6674,3],
      symbol: 'diamond',
      label: {
        show: true,
        color: 'yellowgreen',
        position: 'outside'
      },
      itemStyle: {
        color: 'cyan'
      }
    }
  })
})

</script>

<style scoped lang="scss">
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;
  .title {
    p {
      color: hotpink;
      font-size: 16px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>