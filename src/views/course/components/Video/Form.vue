<template>
  <!-- 添加和修改课时表单 -->
  <el-dialog :visible="dialogVisible" title="添加或编辑课时" @close="close()">
    <el-form :model="video" label-width="120px">
      <el-form-item label="课时标题">
        <el-input v-model="video.title"/>
      </el-form-item>
      <el-form-item label="课时排序">
        <el-input-number v-model="video.sort" :min="0" />
      </el-form-item>
      <el-form-item label="是否免费">
        <el-radio-group v-model="video.free">
          <el-radio :label="true">免费</el-radio>
          <el-radio :label="false">默认</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 上传视频 -->
      <el-form-item label="上传视频">
        <!-- :limit="1"最大允许上传个数, :auto-upload是否在选取文件后立即进行上传(默认true), :file-list上传文件信息的列表, :on-exceed当选择文件数量超过limit时的回调-->
        <!-- before-remove 删除文件之前的钩子，参数为上传的文件和文件列表, on-remove 文件列表移除文件时(before-remove对话框点确定时)的钩子 -->
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-exceed="handleUploadExceed"
          :before-remove="handleBeforeRemove"
          :on-remove="handleOnRemove"
          :file-list="fileList"
          :limit="1"
          action="http://127.0.0.1:8130/admin/vod/media/upload">
          <!-- slot="trigger" 触发文件选择框-->
          <el-button slot="trigger" size="small" type="primary">选择视频</el-button>
          <el-button
            :disabled="uploadBtnDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload()">上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import videoApi from '@/api/video'
import vodApi from '@/api/vod'

export default {
  data() {
    return {
      video: {
        sort: 0,
        free: false
      },
      dialogVisible: false, // 是否显示对话框
      fileList: [], // 上传文件列表
      uploadBtnDisabled: false // 是否禁用
    }
  },
  methods: {
    // 上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    // 上传
    submitUpload() {
      this.uploadBtnDisabled = true
      this.$refs.upload.submit() // 提交上传请求
    },
    // 视频上传成功的回调
    handleUploadSuccess(response, file, fileList) {
      this.uploadBtnDisabled = false
      if (response.success) {
        this.video.videoSourceId = response.data.videoId
        this.video.videoOriginalName = file.name
      } else {
        this.$message.error('上传失败(非20000)')
      }
    },
    // 失败回调
    handleUploadError() {
      this.uploadBtnDisabled = false
      this.$message.error('上传失败(http)')
    },
    // 删除视频文件确认
    handleBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`) // 自带确定和取消
    },
    // 执行视频文件的删除(confirm点确定会走到这里)
    handleOnRemove(file, fileList) {
      if (!this.video.videoSourceId) { // 选择了文件,还没有上传阿里云,这时点confirm的确定,只是从列表中去除了文件显示
        return
      }
      vodApi.removeByVodId(this.video.videoSourceId).then(response => {
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        videoApi.updateById(this.video) // 视频文件在阿里云上删除后,用户点dialog的取消,这样video数据库就不会更新,所以这条语句的作用是:只要用户点confirm的确定就会更新数据库,使两个字段清空
        this.$message.success(response.message)
      })
    },

    // 显示对话框
    open(chapterId, videoId) {
      this.dialogVisible = true
      this.video.chapterId = chapterId
      if (videoId) { // 如果有videoId打开课时对话框的编辑(需要回显),如果没有videoId打开课时对话框的添加(不需要回显)
        videoApi.getById(videoId).then(response => {
          this.video = response.data.item
          // 回显视频文件列表
          // debugger
          if (this.video.videoSourceId) {
            this.fileList = [{ 'name': this.video.videoOriginalName }] // key必须是name
          }
        })
      }
    },
    // 关闭对话框
    close() {
      this.dialogVisible = false
      this.resetForm()
    },
    // 重置对话框
    resetForm() {
      this.video = {
        sort: 0,
        free: false
      }
      this.fileList = [] // //清空视频上传列表
    },
    // 保存或更新
    saveOrUpdate() {
      if (!this.video.id) { // this.video.id在open方法回显时赋值
        this.save()
      } else {
        this.update()
      }
    },
    // 保存
    save() {
      this.video.courseId = this.$parent.$parent.courseId // chapterId在open方法已经赋值
      videoApi.save(this.video).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchNodeList()
      })
    },
    // 更新
    update() {
      videoApi.updateById(this.video).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchNodeList()
      })
    }
  }
}
</script>
