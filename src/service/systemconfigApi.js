import {http} from './http'
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
var addSelfWorkdays = {url:'/busi/timeplan/add',type:'post'}
var delSelfWorkdays = {url:'/busi/timeplan/del',type:'post'}
var addfWorkdaysdetail = {url:'/busi/timeplan/detail/add',type:'post'}
var querydaysdetail = {url:'/busi/timeplan/detail/query',type:'post'}
var queryTenantInfo = {url:'/sys/tenant/queryTenantInfo',type:'post'}
var saveTenant = {url:'/sys/tenant/updateTenantById',type:'post'}
var uploadTenantImg = {url:'/sys/tenant/uploadTenantImg',type:'post'}
var querySysConfigByTenantId = {url:'/busi/sysConfig/querySysConfigByTenantId',type:'post'}
var saveBusiSysConfig = {url:'/busi/sysConfig/saveBusiSysConfig',type:'post'}
var querySessionTag = {url:'/busi/sessionTag/querySessionTag',type:'post'}
var updateSessionTag = {url:'/busi/sessionTag/updateSessionTag',type:'post'}
var deleteSessionTag = {url:'/busi/sessionTag/deleteSessionTag',type:'post'}
var queryRouteByTenantId = {url:'/busi/routeRule/queryRouteByTenantId',type:'post'}
var addSessionTag = {url:'/busi/sessionTag/addSessionTag',type:'post'}
/**时间计划 */
var queryAllTimePlan = {url:'/busi/timeplan/queryAllTimePlan',type:'post'}
var insertTimePlanByTenant = {url:'/busi/timeplan/insertTimePlanByTenant',type:'post'}
var modifyTimePlanByTenant = {url:'/busi/timeplan/modifyTimePlanByTenant',type:'post'}
var deleteTimePlanByTenant = {url:'/busi/timeplan/deleteTimePlanByTenant',type:'post'}

/**系统设置 - 会话标签 */
var querySessionTagSetting = {url:'/busi/sessionTag/queryTenantSessionTagSetting',type:'post'}
var updateSessionTagSetting = {url:'/busi/sessionTag/updateTenantSessionTagSetting',type:'post'}
var submitSessionTag = {url:'/busi/cs/session/submitSessionTag',type:'post'}

/**系统设置 - 路由规则 */
var updateRouteById = {url:'/busi/routeRule/updateRouteById',type:'post'}
var querySkillGroupByUser = {url:'/busi/skillGroup/querySkillGroupByUser',type:'post'}
var updateRouteById = {url:'/busi/routeRule/updateRouteById',type:'post'}
var queryEntryTypeList = {url:'/busi/routeRule/queryEntryTypeList',type:'post'}
var saveRuleAndSkillGroup = {url:'/busi/routeRule/saveRuleAndSkillGroup',type:'post'}
export default {
    /**系统设置 - 路由规则 - 查询入口类型列表 */
    saveRuleAndSkillGroup(config){
        config.urlObj = saveRuleAndSkillGroup;
        return np(config);
    },
    /**系统设置 - 路由规则 - 查询入口类型列表 */
    queryEntryTypeList(config){
        config.urlObj = queryEntryTypeList;
        return np(config);
    },
    /**系统设置 - 路由规则 - 修改会话规则优先级 */
    updateRouteById(config){
        config.urlObj = updateRouteById;
        return np(config);
    },
    /**系统设置 - 路由规则 - 根据当前登录用户 查询租户下技能组的信息 */
    querySkillGroupByUser(config){
        config.urlObj = querySkillGroupByUser;
        return np(config);
    }, 
    /**客服工作台 - 会话标签 - 保存会话标签和备注 */
    submitSessionTag(config){
        config.urlObj = submitSessionTag;
        return np(config);
    }, 
    /**系统设置 - 会话标签 - 会话结束时强制添加会话标签开关**/
    updateSessionTagSetting(config){
        config.urlObj = updateSessionTagSetting;
        return np(config);
    }, 
    /**系统设置 - 会话标签 - 会话结束时强制添加会话标签开关**/
    querySessionTagSetting(config){
        config.urlObj = querySessionTagSetting;
        return np(config);
    }, 
    /**系统设置 - 时间计划 - 获取该租户下的时间计划**/
    queryAllTimePlan(config){
        config.urlObj = queryAllTimePlan;
        return np(config);
    }, 
    /**系统设置 - 时间计划 -  添加自定义工作日/节假日**/
    insertTimePlanByTenant(config){
        config.urlObj = insertTimePlanByTenant;
        return np(config);
    }, 
    /**系统设置 - 时间计划 -  修改工作日/节假日**/
    modifyTimePlanByTenant(config){
        config.urlObj = modifyTimePlanByTenant;
        return np(config);
    }, 
    /**系统设置 - 时间计划 -  删除自定义工作日/节假日**/
    deleteTimePlanByTenant(config){
        config.urlObj = deleteTimePlanByTenant;
        return np(config);
    },
     /** 新增会话标签**/
     addSessionTag(config){
        config.urlObj = addSessionTag;
        return np(config);
    },      
     /** 修改会话规则优先级**/
     updateRouteById(config){
        config.urlObj = updateRouteById;
        return np(config);
    },      
     /** 查询会话分配规则**/
     queryRouteByTenantId(config){
        config.urlObj = queryRouteByTenantId;
        return np(config);
    },      
     /** 删除会话标签**/
     deleteSessionTag(config){
        config.urlObj = deleteSessionTag;
        return np(config);
    },   
    /** 修改会话标签**/
    updateSessionTag(config){
        config.urlObj = updateSessionTag;
        return np(config);
    },     
    /** 查询会话标签**/
    querySessionTag(config){
        config.urlObj = querySessionTag;
        return np(config);
    },     
    /** 系统设置-系统开关保存**/
    saveBusiSysConfig(config){
        config.urlObj = saveBusiSysConfig;
        return np(config);
    },     
    /** 系统设置-系统开关查询**/
    querySysConfigByTenantId(config){
        config.urlObj = querySysConfigByTenantId;
        return np(config);
    }, 
    /** 企业头像上传**/
    uploadTenantImg(config){
        config.urlObj = uploadTenantImg;
        return np(config);
    },      
    /** 企业信息保存**/
    saveTenant(config){
        config.urlObj = saveTenant;
        return np(config);
    },        
    /** 企业信息查询**/
    queryTenantInfo(config){
        config.urlObj = queryTenantInfo;
        return np(config);
    },       
    /**新增工作日时间计划 **/
    addSelfWorkdays(config){
        config.urlObj = addSelfWorkdays;
        return np(config);
    },  
    //删除工作日时间计划
    delSelfWorkdays(config){
        config.urlObj = delSelfWorkdays;
        return np(config);
    },  
    //增加时间计划细节
    addfWorkdaysdetail(config){
        config.urlObj = addfWorkdaysdetail;
        return np(config);
    },           
}