import request from '@/utils/request'

export default {
  getNestedTreeList() { // 嵌套类别列表
    return request({
      url: '/admin/edu/subject/nested-list',
      method: 'get'
    })
  }
}
