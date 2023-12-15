<template>
  <v-container>
    <v-main class="align-center justify-center" style="min-height: 300px;">
      <v-row>
        <v-col>
          <h1 class="text-center">小时AQI计算器</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-alert colored-border color="light-blue" elevation="0" variant="tonal" title="AQI" type="info">
            空气质量指数（<strong>AQI</strong>）将多种空气污染物浓度综合成单一数值，用于表征城市短期内的空气质量状况。
            请输入空气<strong>小时数据</strong>污染物浓度。
          </v-alert>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" md="2">
          <v-text-field v-model="pm25" label="PM₂.₅" placeholder="μg/m³" variant="outlined"
            color="primary"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field v-model="pm10" label="PM₁₀" placeholder="μg/m³" variant="outlined" color="primary"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field v-model="co" label="CO" placeholder="mg/m³" variant="outlined" color="primary"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field v-model="o3" label="O₃" placeholder="μg/m³" variant="outlined" color="primary"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field v-model="so2" label="SO₂" placeholder="μg/m³" variant="outlined" color="primary"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field v-model="no2" label="NO₂" placeholder="μg/m³" variant="outlined" color="primary"></v-text-field>
        </v-col>

      </v-row>



      <v-row justify="center">
        <v-col cols="12" sm="6" md="4">
          <v-btn block rounded size="x-large" color="info" variant="tonal" @click="calculateAQI">计算AQI</v-btn>
        </v-col>
      </v-row>

      <v-row v-if="showResult">
        <v-col v-for="item in aqiResults" :key="item.code" cols="12" sm="6" md="3">
          <v-card class=" bg-grey-lighten-4" hover>
            <v-card-title>
              {{ item.iaqi }}
            </v-card-title>
            <v-card-text>
              IAQI_{{ item.name }}
            </v-card-text>
          </v-card>
        </v-col>

        <v-col>
          <v-card class=" bg-grey-lighten-4" hover>
            <v-card-title primary-title>

              {{ totalAQI }}

            </v-card-title>
            <v-card-text>
              Total AQI
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <AqiChart :option="option" />
        </v-col>
      </v-row>


    </v-main>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const pm25 = ref('');
const pm10 = ref('');
const co = ref('');
const o3 = ref('');
const so2 = ref('');
const no2 = ref('');
const showResult = ref(false);
const aqiResults = ref([]);
const totalAQI = ref(0);
const option = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'IAQI',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 30,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [

      ]
    }
  ]
});


const pm25_oneHour_standard = [0, 35, 75, 115, 150, 250, 350, 500];
const pm10_oneHour_standard = [0, 50, 150, 250, 350, 420, 500, 600];
const so2_oneHour_standard = [0, 150, 500, 650, 800];
const no2_oneHour_standard = [0, 100, 200, 700, 1200, 2340, 3090, 3840];
const co_oneHour_standard = [0, 5, 10, 35, 60, 90, 120, 150];
const o3_oneHour_standard = [0, 160, 200, 300, 400, 800, 1000, 1200];
const aqi_standard = [0, 50, 100, 150, 200, 300, 400, 500];


const calculateAQI = () => {
  // （1） 二氧化硫（SO2）、二氧化氮（NO2）和一氧化碳（CO）的 1 小时平均浓度限值仅用于实时报，在日报中 需使用相应污染物的 24 小时平均浓度限值。
  // （2） 二氧化硫（SO2）1 小时平均浓度值高于 800 μg/m3的，不再进行其空气质量分指数计算，二氧化硫（SO2） 空气质量分指数按 24 小时平均浓度计算的分指数报告。
  // （3） 臭氧（O3）8 小时平均浓度值高于 800 μg/m3 的，不再进行其空气质量分指数计算，臭氧（O3）空气质量 分指数按 1 小时平均浓度计算的分指数报告。

  // 格式化因子数据 co格式化1位小数，其他保持整数
  const formatFactor = (factor) => {
    if (factor === 'co') {
      return Number(co.value).toFixed(1);
    }
    return Number(factor.value);
  };

  // 计算各个因子的 IAQI
  const calculateIAQI = (factor, standard) => {
    const factorValue = formatFactor(factor);
    const factorIndex = standard.findIndex((value) => value >= factorValue);
    if (factorIndex === 0) {
      return 0;
    }
    if (factorIndex === -1) {
      return 500;
    }
    const lower = standard[factorIndex - 1];
    const upper = standard[factorIndex];
    const lowerIndex = aqi_standard[factorIndex - 1];
    const upperIndex = aqi_standard[factorIndex];
    return Math.ceil(((upperIndex - lowerIndex) / (upper - lower)) * (factorValue - lower) + lowerIndex);
  };


  aqiResults.value = [
    { code: 'pm25', name: 'PM₂.₅', iaqi: calculateIAQI(pm25, pm25_oneHour_standard) },
    { code: 'pm10', name: 'PM₁₀', iaqi: calculateIAQI(pm10, pm10_oneHour_standard) },
    { code: 'co', name: 'CO', iaqi: calculateIAQI(co, co_oneHour_standard) },
    { code: 'o3', name: 'O₃', iaqi: calculateIAQI(o3, o3_oneHour_standard) },
    { code: 'so2', name: 'SO₂', iaqi: calculateIAQI(so2, so2_oneHour_standard) },
    { code: 'no2', name: 'NO₂', iaqi: calculateIAQI(no2, no2_oneHour_standard) },
  ];
  // 各个iaqi中的最大值
  totalAQI.value = Math.max(...aqiResults.value.map((item) => item.iaqi));
  showResult.value = true;
  //更新图表数据，将aqiResults.value中的数据转换为echarts的series.data
  option.value.series[0].data = aqiResults.value.map((item) => ({
    value: item.iaqi,
    name: item.name,
  }));
};

</script>
<style scoped></style>
