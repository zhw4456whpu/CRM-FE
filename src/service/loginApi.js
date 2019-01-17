import {http} from './http';
const np = function(config){
    
    return new Promise((resolve,reject) =>{
        http(config).then(res =>{
            if(res.status =='200' || res.status == '304'){
                resolve(res.data);
            }
        }, err =>{
            reject(err);
        })
    });
}
//接口地址
var loginInterface = {url:'/api/login',type:'post'}
var getValidCode = {url:"/sys/auth/getValidateCode",type:'get'}
var authValidCode = {url:'/sys/auth/login',type:'post'}
var getServedTenant = {url:'/busi/cs/session/selectSysUserServeTenantInfo',type: 'post'}
var remoteLogin = {url:'/sys/auth/thirdLogin',type: 'post'}
export default {
    /**远程登录 */
    remoteLogin(config){
        config.urlObj = remoteLogin;
        
        return new Promise((resolve,reject) =>{
            http(config).then(res =>{
                if(res.status =='200' || res.status == '304'){
                    resolve(res.data);
                }
            }, err =>{
                reject(err);
            })
        })
    },
    /**客服工作台 - 查询当前登录人员服务的租户列表接口 */
    getServedTenant(config){
        config.urlObj = getServedTenant;
        return np(config);
    },
    /**校验验证码 */
    authValidCode(config){
        config.urlObj = authValidCode;
        return np(config);
    },
    /**获取验证码 */
    getValidCode(config){
        config.urlObj = getValidCode;
        return np(config);
    },
    login(config = {}) {
        config.urlObj = loginInterface;
        return new Promise((resolve,reject) =>{
            http(config).then(res =>{
                if(res.status =='200' || res.status == '304'){
                    resolve(res.data);
                }
            }, err =>{
                reject(err);
            })
        })
    }    
}