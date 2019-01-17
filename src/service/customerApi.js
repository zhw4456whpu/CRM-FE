import {http} from './http'
import Qs from 'qs'
const np = function(config){
    
    if(config.headers && config.headers['Content-Type'] == 'application/x-www-form-urlencoded' ){
        config.data = Qs.stringify(config.data);
    }
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
var queryUserInfo = {url:'/busi/userinfo/query',type:'post'}
var modifyCustomer = {url:'/busi/userinfo/modifyCustomer',type:'post'}
var addBlack = {url:'/busi/blackcustomer/add',type:'post'}
var delBlack = {url:'/busi/blackcustomer/del',type:'post'}
var queryPrivateTagByTenant = {url:'/sys/dict/queryPrivateTagByTenant',type:'post'}
var updateDictValById = {url:'/sys/dict/updateDictValById',type:'post'}
var insertCustomerTagByTenant = {url:'/sys/dict/insertCustomerTagByTenant',type:'post'}
var deleteDictValById = {url:'/sys/dict/deleteDictValById',type:'post'}
var queryBlackUserForPage = {url:'/busi/userinfo/queryBlackUserForPage',type:'post'}

export default {
    /**客户中心 - 客户信息 - 黑名单客户信息分页查询 */
    queryBlackUserForPage(config){
        config.urlObj = queryBlackUserForPage;
        return np(config);
    },
    /**客户中心 - 客户信息 - 修改客户标签 */
    updateDictValById(config){
        config.urlObj = updateDictValById;
        return np(config);
    },
    /**客户中心 - 客户信息 - 添加客户标签 */
    insertCustomerTagByTenant(config){
        config.urlObj = insertCustomerTagByTenant;
        return np(config);
    },
    /**客户中心 - 客户信息 - 删除客户标签 */
    deleteDictValById(config){
        config.urlObj = deleteDictValById;
        return np(config);
    },
    /**客户中心 - 客户信息 - 查询客户标签 */
    queryPrivateTagByTenant(config){
        config.urlObj = queryPrivateTagByTenant;
        return np(config);
    },
    /**客户中心 - 客户信息 - 删除黑名单 */
    delBlack(config){
        config.urlObj = delBlack;
        return np(config);
    },
    /**客户中心 - 客户信息 - 加入黑名单 */
    addBlack(config){
        config.urlObj = addBlack;
        return np(config);
    },
    /**客户中心 - 客户信息 - 修改客户信息 */
    modifyCustomer(config){
        config.urlObj = modifyCustomer;
        return np(config);
    },
    /**客户中心 - 客户信息 - 客户信息查询 */
    queryUserInfo(config){
        config.urlObj = queryUserInfo;
        return np(config);
    },
    /**查询所有租户 */
    queryAllTenantForList(config){
        config.urlObj = queryAllTenantForList;
        return np(config);
    },
}