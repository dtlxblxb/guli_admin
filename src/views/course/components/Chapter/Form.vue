<template>
  <!-- 添加和修改章节表单 -->
  <el-dialog :visible="dialogVisible" title="添加章节" @close="close()">
    <el-form :model="chapter" label-width="120px"> <!-- model代表表单数据对象 -->
      <el-form-item label="章节标题">
        <el-input v-model="chapter.title"/>
      </el-form-item>
      <el-form-item label="章节排序">
        <el-input-number v-model="chapter.sort" :min="0"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer"> <!-- slot="footer": 插槽 -->
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import chapterApi from '@/api/chapter'

export default {

  data() {
    return {
      dialogVisible: false, // 对话框是否显示, 显示和隐藏并不刷新本组件(没有走生命周期的过程)
      chapter: { // 章节对象
        sort: 0 // 默认值
      }
    }
  },
  methods: {
    // 显示对话框-- 有两个途径(添加章节和编辑章节)
    open(chapterId) { // 如果用open()这样调用,chapterId就是undefined, 表示新增
      this.dialogVisible = true
      if (chapterId) { // 表示修改
        chapterApi.getById(chapterId).then(response => { // 回显
          this.chapter = response.data.item // 这样this.chapter.id也有值了
        })
      }
    },
    // 关闭对话框
    close() { // 分别绑定到对话框的@close事件(叉号)和取消按钮的@click事件上
      this.dialogVisible = false
      this.resetForm() // 防止两次添加操作时,后一次仍然显示前一次的数据
    },
    // 重置表单, Dialog的显示和隐藏并不刷新本组件(没有走生命周期的过程)
    resetForm() {
      this.chapter = { // 重置章节对象
        sort: 0
      }
    },
    // 保存或更新章节
    saveOrUpdate() {
      if (!this.chapter.id) { // open方法中赋的值
        this.save()
      } else {
        this.update()
      }
    },
    // 保存章节
    save() {
      this.chapter.courseId = this.$parent.$parent.courseId // 因为数据库表edu_chapter中有course_id字段, 这样才能是一条完整的记录, this.$parent.$parent.courseId有两种方法得到:1.save,2.路由
      chapterApi.save(this.chapter).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchNodeList() // 子组件调用父组件的方法
      })
    },
    // 更新章节
    update() {
      chapterApi.updateById(this.chapter).then(response => {
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
