// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  app:{
    head: {
      titleTemplate: '%s',
      title: '空气质量计算器, 空气小时AQI计算器, AQI计算器', // 页面标题
      htmlAttrs: {
        lang: 'zh',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '在线AQI计算器, 空气小时AQI计算器、空气质量计算器、AQI、空气质量' }, // 页面描述
        { hid: 'keywords', name: 'keywords', content: 'AQI, AQI计算器, 空气质量, AQI计算器' }, // 页面关键词
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/AQICalculator-nuxt3/favicon.ico' }],
      script: [
        { src: 'https://hm.baidu.com/hm.js?871876fea253bad9c6a70a9b3ff3c2ff'}
      ]
    },
    baseURL: '/AQICalculator-nuxt3/',
    buildAssetsDir: "/_nuxt/",
  },
  devtools: { enabled: false },
  build: {
    transpile: ['vuetify','echarts'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  router: {
    base: '/AQICalculator-nuxt3/',
  },
})
