<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- 如果路由指向同一组件,并且路由出口有唯一值(key)定义,则组件会被重新渲染 -->
      <router-view :key="key"/> <!-- key是属性不是方法,因此没有圆括号, 只是这个属性是实时计算出来的 -->
      <!-- 如果路由指向同一组件,默认情况组件不会被重新渲染 -->
      <!-- <router-view/> --> <!-- 出现组件重用问题: vue-router导航切换 时，如果两个路由都渲染同一个组件，组件的生命周期方法（created或者mounted）不会再被调用, 组件会被重用，显示上一个路由渲染出来的组件 -->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: { // 计算属性
    key() {
      // console.log(this.$route.name) // 路由name(定义路由指定的唯一值)
      // console.log(this.$route) // 路由对象
      // + new Date() == new Date().valueOf() == new Date().getTime() 都是获得当前时间的毫秒数
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>
