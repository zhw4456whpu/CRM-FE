import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import ErrorPage from '@/components/login/ErrorPage'
import WarningPage from '@/components/login/ErrorPage'
import Index from '@/components/home/Index'

/**内容管理 */
import Content from '@/components/contentmanage/Content'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login2',
      component: Login
    },
    {
      path:'/index',
      name:'Index',
      component:Index,
      children: []
    },
    /**内容管理 */
    {
      path: '/contentmanage',
      name: 'ContentManage',
      component: Index,
      redirect: '/contentmanage/content',
      children: [
        {
          path: 'content',
          name: 'Content',
          component: Content
        },
      ]
    },
    {
      path: '/warningpage',
      name: 'WarningPage',
      component: WarningPage
    },
    {
      path: '/errorpage',
      name: 'ErrorPage',
      component: ErrorPage
    }
  ]
})
