<template>
  <div class="app-container"> <!-- app-container:内容与左边和上边有间隙 -->
    <!--查询表单 inline表示横向表单-->
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-input v-model="searchObj.name" placeholder="讲师"/> -->
        <!-- 自动完成 -->
        <!-- querySearch:输入建议的方法,只要文本框内容有变化就会调用 -->
        <!-- trigger-on-focus:是否在输入框 focus 时(还没有输入)就显示建议列表 -->
        <!-- value-key:输入建议对象中用于显示的键名, 默认为value -->
        <el-autocomplete
          v-model="searchObj.name"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input"
          placeholder="讲师"
          value-key="name"
        />
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="头衔">
          <el-option value="1" label="高级讲师"/>
          <el-option value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具条 -->
    <div style="margin-bottom: 10px;">
      <el-button type="danger" size="mini" @click="batchRemove">批量删除</el-button>
    </div>
    <!-- 表格 $index从零开始的当前行的序号-->
    <el-table :data="list" border stripe @selection-change="handleSelectionChange"> <!-- selection-change: 当选择项发生变化时会触发该事件 -->
      <el-table-column type="selection"/> <!-- 为批量删除准备的复选框, 不用label -->
      <el-table-column label="#" width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80" />
      <el-table-column label="头衔" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success" size="mini">高级讲师</el-tag>
          <el-tag v-if="scope.row.level === 2" size="mini">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="简介" />
      <el-table-column prop="sort" label="排序" width="50" />
      <el-table-column prop="joinDate" label="入驻时间" width="100" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
          <router-link :to="'/teacher/edit/'+scope.row.id"> <!-- 路由 -->
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 因为是回调参数,changeCurrentPage是函数引用--给出一个函数名,分页组件会把回调参数赋值,不是函数调用--函数执行时会得到一个undefind的page参数赋值,所以不能写圆括号-->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total"
      @current-change="changeCurrentPage"
      @size-change="changePageSize"
    />
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'

export default {
  data() {
    return {
      list: [], // 讲师列表
      total: 0, // 总记录数
      page: 1, // 当前页
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单
      multipleSelection: [] // 批量选中的记录列表, 作为共享数据
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 调用后端Api,加载教师列表
    fetchData() {
      teacherApi
        .pageList(this.page, this.limit, this.searchObj)
        .then(response => { // 由于pageList()return了响应结果, 这里才能用then处理获取列表成功后的操作
          this.list = response.data.rows // utils/request.js中响应拦截器成功后返回return response.data
          this.total = response.data.total
        }) // 这里不用.catch()来操作失败后的操作, 因为响应拦截器对失败做了统一处理--弹出失败的消息框
    },
    // 改变页码，page：回调参数，表示当前选中的“页码”
    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },
    // 改变每页记录数，size：回调参数，表示当前选中的“每页条数”
    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },
    // 重置表单
    resetData() {
      this.searchObj = {}
      this.page = 1
      this.limit = 10
      this.fetchData()
    },
    // 根据id删除数据
    removeById(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', { // $confirm是element-ui的弹窗提示
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' // 是一个黄色感叹号
      }).then(() => { // 确定
        return teacherApi.removeById(id) // 这里有return
      }).then((response) => { // 删除成功(删除不成功走request.js,包括非200和非20000)
        this.fetchData()
        this.$message.success(response.message) // $message是element-ui的消息提示,success是主题类型(绿色)
      }).catch(error => { // 在弹窗提示对话框点取消或者删除或显示列表失败
        console.log('error', error)
        // 当取消时会进入catch语句:error = 'cancel'
        // 当后端服务抛出异常时：error = 'error' ,由response拦截器处理
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    // 当表格中多选项发生变化时触发
    handleSelectionChange(selection) { // selection表示被选中的多条记录的列表
      this.multipleSelection = selection
    },
    // 批量删除
    batchRemove() {
      // 判断记录是否被选中 - 如果不判断后端会删除失败(显示数据不存在)
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！') // 弹出警告:warning
        return
      }
      // console.log(this.multipleSelection)
      this.$confirm('此操作将永久删除这些记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idList = []
        this.multipleSelection.forEach(item => { // 组装ids
          idList.push(item.id)
        })
        return teacherApi.BatchRemove(idList)
      }).then((response) => {
        this.fetchData()
        this.$message.success(response.message)
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    // 返回输入建议
    querySearch(queryString, callback) {
      console.log(queryString) // queryString就是文本框输入的内容
      teacherApi.selectNameListByKey(queryString).then(response => {
        // console.log(response.data.nameList) // [{name: "周杰伦"}, {name: "周润发"}]
        callback(response.data.nameList) // 在下拉列表中展示数据,但nameList必须为 [{"name":张经理},{"name":李经理}] 格式
      })
    }
  }
}
</script>
