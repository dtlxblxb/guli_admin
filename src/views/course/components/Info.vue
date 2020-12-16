<template>
  <div class="app-container">
    <!-- 课程信息表单 -->
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：<机器学习项目课：从基础到搭建项目视频课程>, 专业名称注意大小写"/>
      </el-form-item>

      <!-- 课程讲师 -->
      <!-- :key必须加上,表示唯一节点,否则报错(eslint规范), :label表示显示的值, :value表示选择后传给后台的值,这里是绑定到courseInfo.teacherId, -->
      <!-- 他们都必须加冒号(因为是动态的值,如果不加冒号就是一个静态的字符串) -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId">
          <el-option v-for="teacher in teacherList" :key="teacher.id" :value="teacher.id" :label="teacher.name" />
        </el-select>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <el-form-item label="课程类别">
        <!-- 一级分类 -->
        <!-- subjectChanged后面不要加括号,因为有默认回调参数,即目前选中的值(value的值subject.id) -->
        <el-select v-model="courseInfo.subjectParentId" placeholder="请选择" @change="subjectChanged">
          <el-option v-for="subject in subjectList" :key="subject.id" :label="subject.title" :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option v-for="subject in subjectLevelTwoList" :key="subject.id" :label="subject.title" :value="subject.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          :action="BASE_API + '/admin/oss/file/upload?module=cover'"
          class="cover-uploader">
          <img v-if="courseInfo.cover" :src="courseInfo.cover">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>
    </el-form>

    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveAndNext()">保存并下一步</el-button>
    </div>
  </div>
</template>

<script>
import courseApi from '@/api/course'
import teacherApi from '@/api/teacher'
import subjectApi from '@/api/subject'
// 富文本编辑器组件
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 按钮是否禁用
      courseInfo: { // 表单数据
        // 以下两个设置表单的默认值显示
        price: 0,
        lessonNum: 0,
        // 由于edu_course表中字段都有非空设置,以下解决表单数据不全时insert语句非空校验出错(其余的字段数据库中有默认值),当表单全部完成,以下设置可以删除
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        cover: '',
        description: '',
        BASE_API: process.env.BASE_API
      },
      teacherList: [], // 讲师列表
      subjectList: [], // 一级分类列表
      subjectLevelTwoList: [] // 二级分类列表
    }
  },
  created() {
    // courseId来源于路由
    // if (this.$route.name === 'CourseInfoEdit') { // 在父组件form中已经给courseId赋值
    //   this.$parent.courseId = this.$route.params.id
    // }
    // courseId来源于saveData()
    if (this.$parent.courseId) { // 回显: 一级类别和二级类别都要渲染
      this.fetchCourseInfoById(this.$parent.courseId)
    } else { // 新增: 只渲染一级类别(渲染:就是能显示出下拉列表项)
      this.initSubjectList()
    }
    this.initTeacherList()
  },
  methods: {
    // 默认情况下，当 this.initSubjectList()方法被调用的时候，只会填充一级分类列表，不会填充二级分类列表
    // 因此二级分类列表中没有数据，当页面回填的时候，二级分类列表被回填的是id值，无法找到列表中对应的title显示出来，因此二级分类列表中只显示一个id的值
    // 解决方案：得到表单回填数据后，根据表单回填数据的subjectParentId，找到对应的二级列表，将次二级列表回填至页面
    // 根据id获取课程基本信息
    fetchCourseInfoById(id) {
      courseApi.getCourseInfoById(id).then(response => {
        this.courseInfo = response.data.item
        // 课程类别渲染
        subjectApi.getNestedTreeList().then(response => {
          // 填充一级类别
          this.subjectList = response.data.items
          // 填充二级类别
          this.subjectList.forEach(subject => {
            // 遍历一级类别,找到和回显课程的courseInfo.subjectParentId一致的一级类别
            if (subject.id === this.courseInfo.subjectParentId) {
              // 将找到的一级类别的子类别列表填入二级下拉菜单列表,这样二级分类select组件就会从二级下拉菜单列表的id选择和this.courseInfo.subjectId一致的列表项进行回显
              this.subjectLevelTwoList = subject.children
            }
          })
        })
      })
    },
    // 获取讲师列表
    initTeacherList() {
      teacherApi.list().then(response => {
        this.teacherList = response.data.items
      })
    },
    // 获取课程分类列表
    initSubjectList() {
      subjectApi.getNestedTreeList().then(response => {
        this.subjectList = response.data.items
      })
    },
    // 切换一级类别下拉列表触发
    subjectChanged(value) { // value为当前选中的一级类别的Id
      console.log(value)
      // 遍历一级类别列表
      this.subjectList.forEach(subject => {
        // 判断当前选中的一级类别是否和当前遍历的一级类别的id一致
        if (subject.id === value) {
          this.courseInfo.subjectId = '' // 每次切换一级列表都清空二级列表内容
          this.subjectLevelTwoList = subject.children
        }
      })
    },
    saveAndNext() {
      this.saveBtnDisabled = true
      if (!this.$parent.courseId) {
        this.saveData()
      } else {
        this.updateData()
      }
    },
    // 保存课程信息
    saveData() {
      courseApi.saveCourseInfo(this.courseInfo).then(response => {
        this.$message.success(response.message)
        this.$parent.courseId = response.data.courseId // 获取courseId
        this.$parent.active = 1 // 子组件访问父组件的成员:$parent
      })
    },
    // 更新课程信息
    updateData() {
      courseApi.updateCourseInfoById(this.courseInfo).then(response => {
        this.$message.success(response.message)
        this.$parent.active = 1 // 下一步
      })
    },
    // 上传成功回调
    handleCoverSuccess(res, file) {
      if (res.success) {
        // console.log(res)
        this.courseInfo.cover = res.data.url
        // 强制重新渲染以显示图片
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败(非20000错误)')
      }
    },

    // 上传校验
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传封面图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 错误处理
    handleCoverError() {
      console.log('error')
      this.$message.error('上传失败(http错误)')
    }
  }
}
</script>

<style>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cover-uploader .el-upload:hover {
  border-color: #409EFF;
}
.cover-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 640px;
  height: 357px;
  line-height: 357px;
  text-align: center;
}
.cover-uploader img {
  width: 640px;
  height: 357px;
  display: block;
}
</style>
