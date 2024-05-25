<template>
  <div class="box4" ref="map">
    我是地图组件
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import chinaJson from './china.json'

const map = ref()
echarts.registerMap('china', chinaJson as any)
onMounted(() => {
  const mycharts = echarts.init(map.value)
  mycharts.setOption({
    geo: {
      map: 'china',
      roam: true,
      label: {
        show: false,
        color: 'white'
      },
      itemStyle: {
        color: '#3b8eea',
        opacity: .7
      }
    },
    series: [
      {
        type: 'lines',
        data: [
          {
            coords: [
              [116.405285, 39.904989],
              [126.642464, 45.756967]
            ],
            lineStyle: {
              color: 'white',
              width: 2
            },
          }
        ],
        effect: {
          show: true,
          symbol: 'arrow',
          color: 'green',
          symbolSize: 18
        }
      }
    ]
  })
})


</script>

<style scoped></style>