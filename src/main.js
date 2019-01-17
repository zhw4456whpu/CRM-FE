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
/* eslint-disable no-new */
/*new Vue({
    render(createElement) {
        return createElement(Upload)
    }
}).$mount('#upload')*/

//定义路由beforeEach函数
/* router.beforeEach((to,from,next) =>{
  if(to.name.toLocaleLowerCase.indexof('api') >-1){
  }
  next();
}) */

import VueWorker from 'vue-worker';
Vue.use(VueWorker);

import Login from '../src/service/loginApi';
import company from '../src/service/companyApi';
import {Headers} from '../src/components/common/Consts.js'

/**获取登陆人员所服务的租户信息 */
async function getServedTenant() {
    let config = {
        headers: Headers.json
    };
    return await Login.getServedTenant(config).then( res =>{
        if(res.code == '0'){
            _this.$store.dispatch('setServedTenant', res.resultData);
        }
        else{
            console.log("getServedTenant warning: %s", res.message);
        }
        return res;
    },err=>{
        console.log("getServedTenant error: %o", err);
        return err;
    })
}
/**获取所有敏感词 */
function querySensitiveWordListForPage(){
    let config = {
        data: {},
        headers: Headers.urlencoded
    }            
    company.querySensitiveWordListForPage(config).then(res =>{
        if(res.code == '0'){
            let allSensitiveWords= [],sensitiveWord;
            res.resultData.list.map((i,x) =>{
                sensitiveWord = i.sensitiveWord;
                allSensitiveWords.push(sensitiveWord);
            });
            _this.$store.dispatch('setAllSensitiveWords', allSensitiveWords );
        } else{
            console.log(res.message);
        }
    },err => {
        console.log(err);
    })
}

function runWebWork(){
    var worker = _this.$worker.run((fn) =>{
        fn && fn();
    }, [querySensitiveWordListForPage()])
    .then(res => { console.log("_this.allSensitiveWords: %o", res);})
    .catch(e => {
        worker = null;
        console.log("runWebWork error: %o", e);
    })
}

router.beforeEach((to, from, next) => {
    
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (store.state.token) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else if(to.name == 'RemoteLogin' ){
        let { userAccount, userPwd, orgUserId } = {...to.query}
        let config = {
            data: {
                userAccount: userAccount,
                userPwd: userPwd,
                orgUserId: orgUserId
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + to.query.access_token || ''
            }
        };
        
        Login.remoteLogin(config).then(res =>{
            if(res.code == '0'){
                runWebWork();
                var path = res.resultData.menuList[0].menuAddress || '/kfplatform';
                _this.$store.dispatch('setRemoteToken',  to.query.access_token );
                _this.$store.dispatch('setUserName', userAccount);
                _this.$store.dispatch('setUserLogo', res.resultData.tenantLogo || '');//记住密码，明文密码
                _this.$store.dispatch('setUserId', res.resultData.roleEntity.sysId);

                let menu = {};
                menu.topNav = res.resultData.menuList.filter(item =>{
                    return (item.parentCode == '0')?true:false;
                });
                menu.subMenus = res.resultData.menuList.filter(item =>{
                    return (item.parentCode != '0')?true:false;
                });
                _this.$store.dispatch('setMenu', menu);
                
                getServedTenant().then(res =>{
                    if(res.code == '0'){
                        next({
                            path: path,// 将跳转的路由path作为参数，登录成功后跳转到该路由
                        })
                    }
                });
            }
            else{
                next({
                    path: '/warningpage',
                    query: { redirect: to.fullPath, msg: res.message || '出错啦', type: 'warning' },  // 将跳转的路由path作为参数，登录成功后跳转到该路由
                })
            }
        },err =>{
            next({
                path: '/errorpage',
                query: { redirect: to.fullPath, msg: err || '出错啦', type: 'error' },  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        })
    }
    else {
        next();
    }
})
/* eslint-disable no-new */
const _this = new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})
