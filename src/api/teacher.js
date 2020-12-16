// @ 符号在build/webpack.base.conf.js中配置,表示 'src' 路径
import request from '@/utils/request'

export default {
  list() {
    return request({ // 返回响应结果
      url: '/admin/edu/teacher/list',
      method: 'get'
    })
  },
  pageList(page, limit, searchObj) {
    return request({
      url: `/admin/edu/teacher/list/${page}/${limit}`, // 模板字符串
      method: 'get',
      params: searchObj // 后端要求对象,用?&形式, 键值对,用于get请求
    })
  },
  removeById(id) {
    return request({
      url: `/admin/edu/teacher/remove/${id}`,
      method: 'delete'
    })
  },
  BatchRemove(idList) {
    return request({
      url: '/admin/edu/teacher/batch-remove',
      method: 'delete',
      data: idList // 后端要求json(@RequestBody),用[]形式, 用于非get请求
    })
  },
  save(teacher) {
    return request({
      url: '/admin/edu/teacher/save',
      method: 'post',
      data: teacher // 后端要求json(@RequestBody),用{}形式, 用于非get请求
    })
  },
  getById(id) {
    return request({
      url: `/admin/edu/teacher/get/${id}`,
      method: 'get'
    })
  },
  updateById(teacher) {
    return request({
      url: '/admin/edu/teacher/update',
      method: 'put',
      data: teacher
    })
  },
  selectNameListByKey(key) {
    return request({
      url: `/admin/edu/teacher/list/name/${key}`,
      method: 'get'
    })
  }
}
