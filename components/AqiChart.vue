<template>
  <div>
    <client-only>
      <v-chart class="chart" :option="option" />
    </client-only>
  </div>
</template>
<script setup>
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';
import { ref } from 'vue';

use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer])
const { option } = defineProps({
  option: {
    type: Array,
    default: [],
  }
})
</script>
<style scoped>
.chart {
  height: 50vh;
}
</style>
