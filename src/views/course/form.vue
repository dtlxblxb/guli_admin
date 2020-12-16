<template> <!-- template 里只能有一个标签-->
  <div class="app-container">
    <!-- 步骤导航 -->
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="active" finish-status="success" simple style="margin-bottom: 40px">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="发布课程" />
    </el-steps>
    <!-- 步骤内容 -->
    <!-- 填写课程基本信息 -->
    <info v-if="active === 0"/> <!-- 使用组件 -->

    <!-- 创建课程大纲 -->
    <chapter v-if="active === 1"/>

    <!-- 发布课程 -->
    <publish v-if="active === 2 || active === 3"/>
  </div>
</template>

<script>
// 引入子组件
import Info from '@/views/course/components/Info' // 子组件名称Info任意, Info可以用info或Info使用, CourseInfo可以用course-info或CourseInfo使用
import Chapter from '@/views/course/components/Chapter' // 找Chapter.vue或Chapter/Index.vue
import Publish from '@/views/course/components/Publish'

export default {
  components: { Info, Chapter, Publish }, // 注册子组件
  data() {
    return {
      active: 0,
      courseId: null
    }
  },
  created() { // courseId来源于路由, this.courseId = this.$route.params.id只能写在if里面,因为只有这两种状态才给courseId赋值,其它状态不需要
    if (this.$route.name === 'CourseInfoEdit') { // 表示是从课程列表点修改按钮进的路由/course/info/:id,这个路由的名字是CourseInfoEdit
      this.courseId = this.$route.params.id
      this.active = 0
    }

    if (this.$route.name === 'CourseChapterEdit') { // 表示是从课程列表点编辑大纲按钮进的路由/course/chapter/:id,这个路由的名字是CourseChapterEdit
      this.courseId = this.$route.params.id
      this.active = 1
    }
  }
}
</script>
