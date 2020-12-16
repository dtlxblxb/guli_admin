<template>
  <div class="app-container">
    <!-- 输入表单 -->
    <el-form label-width="120px"> <!-- label-width :定义下面label标签的宽度 -->
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker v-model="teacher.joinDate" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level">
          <!-- 数据类型一定要和取出的json中的一致，否则没法回填, 因此这里value使用单向绑定表达式的值，保证其数据类型是number(引号内部是一个表达式), 不加冒号或加冒号且"'1'"表示的值为字符串 -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro"/>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像 :on-success代表http访问成功(返回200)的钩子函数(相当于事件即访问成功回调的函数), :on-error代表http访问失败(返回非200)的钩子函数 -->
      <!-- :before-upload代表上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。 :show-file-list代表是否显示已上传文件列表-->
      <!-- name	属性默认为 file, 和后端对应 -->
      <el-form-item label="讲师头像">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/admin/oss/file/upload?module=avatar'"
          class="avatar-uploader">
          <img v-if="teacher.avatar" :src="teacher.avatar" class="avatar"> <!-- :src,页面上显示图片 -->
          <i v-else class="el-icon-plus avatar-uploader-icon"/> <!-- el-icon-plus显示个小加号 -->
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'

export default {
  data() {
    return {
      // 设置讲师默认值
      teacher: {
        sort: 0,
        level: 1
      },
      saveBtnDisabled: false, // 保存按钮是否禁用, 防止重复提交, 默认按钮可用
      BASE_API: process.env.BASE_API
    }
  },
  created() {
    if (this.$route.params.id) { // 当路由包括id属性则为真, $route路由对象
      this.fetchDataById(this.$route.params.id) // this.$route.params.id获得当前路由Id值
    }
  },
  methods: {
    saveOrUpdate() {
      console.log(this.teacher)
      this.saveBtnDisabled = true
      if (!this.teacher.id) { // 也可以用路由来判断(this.$route.params.id)
        this.saveDate()
      } else {
        this.updateDate()
      }
    },
    saveDate() {
      teacherApi.save(this.teacher).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.$router.push('/teacher/list') // 路由跳转, 用$router操作来路由对象
      })
    },
    fetchDataById(id) {
      teacherApi.getById(id).then(response => {
        console.log(response)
        this.teacher = response.data.item
      })
    },
    updateDate() {
      teacherApi.updateById(this.teacher).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.$router.push('/teacher/list')
      })
    },
    // 文件上传成功(Status Code: 200)的回调,包括R对象返回非20000的失败和20000的成功
    handleAvatarSuccess(response) { /* 由于是upload组件自己发出的http请求,不会经过统一异常处理request.js,即使后端抛出了自定义异常,也会执行这里,因为http请求返回的状态码是200 */
      // console.log(response) // response就是返回的R对象
      if (response.success) { // 20000
        this.teacher.avatar = response.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传头像图片失败! (非20000)')
      }
    },
    // 文件上传失败(请求地址或服务器错误)的回调,指http失败
    handleAvatarError() {
      this.$message.error('上传头像图片失败! (Http失败)')
    },
    // 文件上传前的校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' // MIME
      const isLt2M = file.size / 1024 / 1024 < 2 // 小于2M

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
