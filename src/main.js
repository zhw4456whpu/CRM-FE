// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'iview/dist/styles/iview.css'/* 使用 CSS */
import iview from 'iview/dist/iview.js'/* 使用 js */
import './theme/index.less';
Vue.use(iview)

import lazyLoad from 'vue-lazyload'
Vue.use(lazyLoad,{
    error:require('../static/i/lazyload/error.jpg'),
    loading:require('../static/i/lazyload/loading.gif')
})
Vue.config.productionTip = false

import uploader from 'vue-simple-uploader'
import Upload from './components/common/Upload'
import { debug } from 'util';
import * as IM from './easemob'
Vue.prototype.$IM = IM;
//引入拖拽组件
import VueDND from 'awe-dnd'

Vue.use(VueDND)
//引入eachert
let echarts = require('echarts/lib/echarts')
Vue.prototype.$echarts = echarts
Vue.use(uploader)
import VueWorker from 'vue-worker';
Vue.use(VueWorker);

router.beforeEach((to, from, next) => {
    
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (store.state.accessToken) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})
/* eslint-disable no-new */

import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.js'

const _this = new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})
