// 整个项目的路由入口(3/3)
import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true }, // () => import('@/views/login/index')是一个箭头函数, 路由出口在src\App.vue
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout, // 路由出口在src\view\layout\AppMain.vue
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index') // 首页
    }]
  },

  // 讲师管理
  {
    path: '/teacher', // 路由--在url上显示
    component: Layout,
    redirect: '/teacher/list', // 在url上显示这个
    name: 'Teacher', // 不能重复
    meta: { title: '讲师管理' }, // 左边菜单的名字
    children: [
      {
        path: 'list',
        name: 'TeacherList',
        component: () => import('@/views/teacher/list'), // 页面
        meta: { title: '讲师列表' }
      },
      {
        path: 'create',
        name: 'TeacherCreate',
        component: () => import('@/views/teacher/form'),
        meta: { title: '添加讲师' }
      },
      {
        path: 'edit/:id',
        name: 'TeacherEdit',
        component: () => import('@/views/teacher/form'),
        meta: { title: '编辑讲师' },
        hidden: true // 与讲师id有关
      }
    ]
  },

  // 课程分类管理
  {
    path: '/subject',
    component: Layout,
    redirect: '/subject/list',
    name: 'Subject',
    meta: { title: '课程分类管理' },
    children: [
      {
        path: 'list',
        name: 'SubjectList',
        component: () => import('@/views/subject/list'),
        meta: { title: '课程分类列表' }
      },
      {
        path: 'import',
        name: 'SubjectImport',
        component: () => import('@/views/subject/import'),
        meta: { title: '导入课程分类' }
      }
    ]
  },

  // 课程管理
  {
    path: '/course',
    component: Layout,
    redirect: '/course/list',
    name: 'Course',
    meta: { title: '课程管理' },
    children: [
      {
        path: 'list',
        name: 'CourseList',
        component: () => import('@/views/course/list'),
        meta: { title: '课程列表' }
      },
      {
        path: 'info',
        name: 'CourseInfo',
        component: () => import('@/views/course/form'),
        meta: { title: '发布课程' }
      },
      {
        path: 'info/:id', // 课程id(设置这两个路由的目的:1.active === 0,2.通过url取课程id)
        name: 'CourseInfoEdit',
        component: () => import('@/views/course/form'),
        meta: { title: '编辑课程' },
        hidden: true
      },
      {
        path: 'chapter/:id', // 课程id(设置这两个路由的目的:1.active === 1,2.通过url取课程id)
        name: 'CourseChapterEdit',
        component: () => import('@/views/course/form'),
        meta: { title: '编辑大纲' },
        hidden: true
      }
    ]
  },

  // 内容管理
  {
    path: '/ad',
    component: Layout,
    redirect: '/ad/list',
    name: 'Ad',
    meta: { title: '内容管理' },
    children: [
      {
        path: 'list',
        name: 'AdList',
        component: () => import('@/views/ad/list'),
        meta: { title: '广告推荐' }
      },
      {
        path: 'create',
        name: 'AdCreate',
        component: () => import('@/views/ad/form'),
        meta: { title: '添加广告推荐' },
        hidden: true
      },
      {
        path: 'edit/:id',
        name: 'AdEdit',
        component: () => import('@/views/ad/form'),
        meta: { title: '编辑广告推荐' },
        hidden: true
      },

      {
        path: 'type-list',
        name: 'AdTypeList',
        component: () => import('@/views/adType/list'),
        meta: { title: '推荐位' }
      },
      {
        path: 'type-create',
        name: 'AdTypeCreate',
        component: () => import('@/views/adType/form'),
        meta: { title: '添加推荐位' },
        hidden: true
      },
      {
        path: 'type-edit/:id',
        name: 'AdTypeEdit',
        component: () => import('@/views/adType/form'),
        meta: { title: '编辑推荐位' },
        hidden: true
      }
    ]
  },

  // 统计分析
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/create',
    name: 'Statistics',
    meta: { title: '统计分析' },
    children: [
      {
        path: 'create',
        name: 'StatisticsCreate',
        component: () => import('@/views/statistics/create'),
        meta: { title: '生成统计' }
      },
      {
        path: 'chart',
        name: 'StatisticsChart',
        component: () => import('@/views/statistics/chart'),
        meta: { title: '统计图表' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true } // 上面都不匹配, 到 '/404' 路由
]

export default new Router({ // 导出Router
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
