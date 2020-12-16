<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="输入查询条件"
      style="margin-bottom:30px;" />
    <!-- props:配置选项,filter-node-method: 过滤方法 -->
    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      style="margin-top:10px;" />
  </div>
</template>

<script>
import subjectApi from '@/api/subject'
export default {
  data() {
    return {
      filterText: '', // 过滤文本
      subjectList: [], // 数据列表
      defaultProps: { // 配置属性列表数据属性的key
        children: 'children',
        label: 'title'
      }
    }
  },

  // 监听 filterText的变化
  watch: {
    filterText(val) { // 监听的函数名必须与数据名相同,val就是文本框的内容
      this.$refs.subjectTree.filter(val) // 调用tree的filter方法,接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数
    }
  },

  created() {
    this.fetchNodeList()
  },

  methods: {
    // 获取远程数据
    fetchNodeList() {
      subjectApi.getNestedTreeList().then(response => {
        this.subjectList = response.data.items
      })
    },

    // 对树节点进行筛选时执行的方法(每个节点都要执行一次)，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
    // value:文本框输入的内容,data:后端返回的当前节点对象
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1 // 忽略大小写比较,indexOf函数返回:参数在调用字符串中的索引位置
    }
  }
}
</script>
