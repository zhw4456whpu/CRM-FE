import {http} from './http'

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
const uploadAvatar = {url:'/merchants/:merchant_id/actions/modifyPhoto/:Photo',type:'put'}
const souMerchantInfo = {url:'/merchants/:merchant_id/actions/saveOrUpdateMerchantInformation/:Merchant',type:'post'}
const merchantGreeting = {url:'/systemSettings/:merchant_id/actions/isSendGreetings',type:'put'}
const merchantConclusion = {url:'/systemSettings/:merchant_id/actions/isSendConclusions',type:'put'}
const kfAnswerTimeout = {url:'/systemSettings/:merchant_id/actions/saveOrUpdateTimeoutUnreturnedSettings',type:'post'}
const visitorAnswerTimeoutKO = {url:'/systemSettings/:merchant_id/actions/saveOrUpdateTimeoutUnreturnedAutoCloseSession',type:'put'}
const souTimePlan = {url:'/systemSettings/:merchant_id/actions/saveOrUpdateTimePlan',type:'post'}
const souSessionTag = {url:'/systemSettings/:merchant_id/actions/saveOrUpdateSessionTag',type:'post'}
const souRoutingRule = {url:'/systemSettings/:merchant_id/actions/saveOrUpdateRoutingRule',type:'post'}
/**客服管理b */
const souCustomerService = {url:'/systemSettings/:merchant_id/actions/saveOrUpdateCustomer',type:'post'}
const getCustomerService = {url:'/customers/:merchant_id/actions/findCustomer?orderby=:service_agency',type:'get'}
const delCustomerService = {url:'/customers/:merchant_id/actions/deleteCustomer?:customer_id',type:'delete'}
const addCustomerService = {url:'/customers/:merchant_id/actions/addCustomer',type:'post'}
const addGroup = {url:'/customers/:merchant_id/actions/addGroup',type:'post'}
export default {
    /**新增分组 */
    addGroup(config){
        config.urlObj = addGroup;
        return np(config);
    },
    /**新增客服 */
    addCustomerService(config){
        config.urlObj = addCustomerService;
        return np(config);
    },
    /**删除客服 */
    delCustomerService(config){
        config.urlObj = delCustomerService;
        return np(config);
    },
    /**按服务租户查询客服 */
    getCustomerService(config){
        config.urlObj = getCustomerService;
        return np(config);
    },
    /**查询客服 */
    souCustomerService(config){
        config.urlObj = souCustomerService;
        return np(config);
    },
    /******************************************************************** */
    /**保存或修改路由规则 */
    souRoutingRule(config){
        config.urlObj = souRoutingRule;
        return np(config);
    },
    /**会话标签 
     * (Save Or Update Session Tag)
    */
    souSessionTag(config){
        config.urlObj = souSessionTag;
        return np(config);
    },
    /**时间计划 
     * (Save Or Update Time Plan)
    */
    souTimePlan(config){
        config.urlObj = souTimePlan;
        return np(config);
    },
    /**访客超时未回复自动结束会话 */
    visitorAnswerTimeoutKO(config){
        config.urlObj = visitorAnswerTimeoutKO;
        return np(config);
    },
    /**客服超时未回复设置 */
    kfAnswerTimeout(config){
        config.urlObj = kfAnswerTimeout;
        return np(config);
    },
    /**企业结束语 */
    merchantConclusion(config){
        config.urlObj = merchantConclusion;
        return np(config);
    },
    /**企业问候语 */
    merchantGreeting(config){
        config.urlObj = merchantGreeting;
        return np(config);
    },
    /**企业信息保存
     * (Save Or Update Merchant Information)
    */
    souMerchantInfo(config){
        config.urlObj = souMerchantInfo;
        return np(config);
    },
    /**上传头像 */
    uploadAvatar(config){
        config.urlObj = uploadAvatar;
        return np(config);
    }
}