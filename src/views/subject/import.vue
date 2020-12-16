<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag> <!-- tag小标签 -->
        <el-tag>
          <i class="el-icon-download" /> <!-- icon小图标 -->
          <a :href="defaultExcelTemplate">点击下载模版</a> <!-- a标签具有下载功能 -->
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <!-- action:上传的地址, limit:最大允许上传个数, on-exceed:超出limit文件个数限制时的钩子 -->
        <!-- auto-upload:是否在选取文件后立即进行上传(一个按钮:true-自动上传,两个按钮:false-手动上传),  ref:相当于这个upload组件的id(用于得到这个组件对象) -->
        <!-- name="file",表示提交文件内容的key为file,所以要求后端接收文件内容的参数为file -->
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-exceed="fileUploadExceed"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :limit="1"
          action="http://127.0.0.1:8110/admin/edu/subject/import"
          name="file"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button> <!-- slot="trigger" 表示这个按钮触发文件选择对话框-->
          <el-button
            :disabled="importBtnDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload()"
          >导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultExcelTemplate: process.env.OSS_PATH + '/excel/课程分类列表模板.xls', // 默认Excel模板
      importBtnDisabled: false // 导入按钮是否禁用
    }
  },

  methods: {
    // 上传多于一个文件时调用,(:limit="1")
    fileUploadExceed() {
      this.$message.warning('只能选取一个文件')
    },

    // 上传
    submitUpload() {
      this.importBtnDisabled = true
      this.$refs.upload.submit() // 手动提交上传请求表单,提交到action属性的位置
    },

    fileUploadSuccess(response) {
      if (response.success) {
        this.importBtnDisabled = false // 启用按钮
        this.$message.success(response.message)
        this.$refs.upload.clearFiles() // 清空文件列表
      } else {
        this.$message.error(response.message) // 上传失败! （非20000）
      }
    },

    fileUploadError(err) {
      this.importBtnDisabled = false // 启用按钮
      this.$message.error(err.message) // 上传失败! （http失败）
      this.$refs.upload.clearFiles() // 清空文件列表
    }
  }
}
</script>
