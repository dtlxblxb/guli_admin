<template> <!-- template 里只能有一个标签-->
  <div class="app-container">
    <!-- 标题 -->
    <h2 style="text-align: center;">发布新课程</h2>

    <!-- 步骤导航 -->
    <el-steps :active="active" finish-status="success" simple style="margin-bottom: 40px">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="发布课程" />
    </el-steps>

    <!-- 步骤内容 -->
    <!-- 使用组件: 一般用小写和必要的连字符(-), 这里切换active, 路由url不会变的 -->
    <!-- step1:Info,填写课程基本信息 -->
    <info v-if="active === 0"/> <!-- 使用组件 -->
    <!-- step2:ChapterIndex,创建课程大纲 -->
    <chapter v-if="active === 1"/>
    <!-- step3:Publish,发布课程, active === 3:表示课程已经发布, 但页面还应该停留在Publish -->
    <publish v-if="active === 2 || active === 3"/>
  </div>
</template>

<script>
// 引入子组件
import Info from '@/views/course/components/Info' // 子组件名称Info任意, Info可以用info或Info使用, CourseInfo可以用course-info或CourseInfo使用
import Chapter from '@/views/course/components/Chapter' // 找components/Chapter.vue或Chapter/Index.vue
import Publish from '@/views/course/components/Publish'

export default {
  components: { Info, Chapter, Publish }, // 注册子组件
  data() {
    return {
      active: 0,
      courseId: null
    }
  },
  created() { // courseId来源于路由, this.courseId = this.$route.params.id只能写在if里面,因为只有这两种状态才给courseId赋值,其它状态不需要,所有这条语句不能合并提出
    if (this.$route.name === 'CourseInfoEdit') { // 表示是从课程列表点修改按钮进的路由/course/info/:id,这个路由的名字是CourseInfoEdit,这是路由名字的用途
      this.courseId = this.$route.params.id // 课程id(看路由)
      this.active = 0 // 对应course/list.vue'修改'按钮, 其实这句可以注掉, 因为会重新渲染(默认0)
    }

    if (this.$route.name === 'CourseChapterEdit') { // 表示是从课程列表点编辑大纲按钮进的路由/course/chapter/:id,这个路由的名字是CourseChapterEdit,这是路由名字的用途
      this.courseId = this.$route.params.id // 课程id(看路由)
      this.active = 1 // 对应course/list.vue'编辑大纲'按钮
    }
  }
}
</script>
