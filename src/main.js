// 打包入口文件--整个项目的模块入口(1/3)
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css 动态css(可以有if)

import App from './App'
import router from './router' // 导入Router
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router, // 挂载Router
  store,
  render: h => h(App) // 渲染组件
})
