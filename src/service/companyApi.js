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
var addCompany = {url:'/sys/tenant/saveTenant',type:'post'}
var companyList = {url:'/sys/tenant/queryListForPage',type:'post'}
var delCompany = {url:'/sys/tenant/deleteTenantById',type:'post'}
var editCompany = {url:'/sys/tenant/updateTenantById',type:'post'}

var getDefaultRole = {url:'/sys/role/queryListForPage',type:'post'}
var getCompanyRole = {url:'/sys/tenant/queryTenantForPage',type:'post'}
var getTenantRole = {url:'/sys/role/queryTenantRoleForPage',type:'post'}
var addRole = {url:'/sys/role/addRoleAndPermi',type:'post'}
var editRole = {url:'/sys/role/updateRoleById',type:'post'} 
var delRole = {url:'/sys/role/deleteRoleAndPermi',type:'post'} 
var getAuthority = {url:'/sys/menu/queryMenuByRoleId',type:'post'} 
var getCustomerCenter =  {url:'/sys/csCenter/queryAllForList',type:'post'}
var getCenterCompany =  {url:'/sys/csCenter/queryCenterTenantForPage',type:'post'}
var addCustomerCenter =  {url:'/sys/csCenter/addCsCenter',type:'post'}
var editCustomerCenter =  {url:'/sys/csCenter/updateCsCenter',type:'post'}
var delCustomerCenter =  {url:'/sys/csCenter/deleteCsCenter',type:'post'}
var getNoCenterCompany = {url:'/sys/csCenter/queryTenantNotInCenter',type:'post'}
var getCenterAllCompany = {url:'/sys/csCenter/queryTenantInCenter',type:'post'}
var addCenterCompany = {url:'/sys/csCenter/addTenantInCenter',type:'post'}
var removeCenterCompany = {url:'/sys/csCenter/deleteTenantInCenter',type:'post'}
var setDefaultCompany = {url:'/sys/csCenter/updateTenantForAdmin',type:'post'}
var queryAllForList = {url:'/sys/menu/queryAllForList',type:'post'}
var queryAllTenantForList = {url:'/sys/csCenter/queryAllTenantForList',type:'post'}
var querySensitiveWordListForPage = {url:'/sys/sensitiveWord/querySensitiveWordListForPage',type:'post'}
var updateSensitiveWordById = {url:'/sys/sensitiveWord/updateSensitiveWordById',type:'post'}
var updateSensitiveWordById = {url:'/sys/sensitiveWord/updateSensitiveWordById',type:'post'}
var deleteSensitiveWordById = {url:'/sys/sensitiveWord/deleteSensitiveWordById',type:'post'}
var saveSensitiveWord = {url:'/sys/sensitiveWord/saveSensitiveWord',type:'post'}
var synchronizeVersionNo = {url:'/sys/sensitiveWord/synchronizeVersionNo',type:'post'}
export default {
    /**同步 */
    synchronizeVersionNo(config){
        config.urlObj = synchronizeVersionNo;
        return np(config);
    },     
    /**添加敏感词 */
    saveSensitiveWord(config){
        config.urlObj = saveSensitiveWord;
        return np(config);
    },      
    /**删除敏感词 */
    deleteSensitiveWordById(config){
        config.urlObj = deleteSensitiveWordById;
        return np(config);
    },       
    /**修改敏感词 */
    updateSensitiveWordById(config){
        config.urlObj = updateSensitiveWordById;
        return np(config);
    },     
    /**获取敏感词列表 */
    querySensitiveWordListForPage(config){
        config.urlObj = querySensitiveWordListForPage;
        return np(config);
    },    
    /**查询所有租户 */
    queryAllTenantForList(config){
        config.urlObj = queryAllTenantForList;
        return np(config);
    },
    /**查询所有菜单 */
    queryAllForList(config){
        config.urlObj = queryAllForList;
        return np(config);
    },
    /**设置租户为负责租户接口 */
    setDefaultCompany(config){
        config.urlObj = setDefaultCompany;
        return np(config);
    },
    /**客服中心移除租户接口 */
    removeCenterCompany(config){
        config.urlObj = removeCenterCompany;
        return np(config);
    },
    /**客服中心新增租户信息接口 */
    addCenterCompany(config){
        config.urlObj = addCenterCompany;
        return np(config);
    },
    /**查询该客服中心下的所有租户信息 */
    getCenterAllCompany(config){
        config.urlObj = getCenterAllCompany;
        return np(config);
    },
    /**查询未加入客服中心的租户 */
    getNoCenterCompany(config){
        config.urlObj = getNoCenterCompany;
        return np(config);
    },
    /**客服中心删除接口 */
    delCustomerCenter(config){
        config.urlObj = delCustomerCenter;
        return np(config);
    },
    /**客服中心修改接口 */
    editCustomerCenter(config){
        config.urlObj = editCustomerCenter;
        return np(config);
    },
    /**客服中心新增接口 */
    addCustomerCenter(config){
        config.urlObj = addCustomerCenter;
        return np(config);
    },
    /**客服中心租户分页查询接口 */
    getCenterCompany(config){
        config.urlObj = getCenterCompany;
        return np(config);
    },
    /**客服中心查询接口 */
    getCustomerCenter(config){
        config.urlObj = getCustomerCenter;
        return np(config);
    },
    /**查询菜单按钮列表接口（根据角色ID） */
    getAuthority(config){
        config.urlObj = getAuthority;
        return np(config);
    },
    /**租户列表分页查询 */
    getCompany(config = {}){
        config.urlObj = companyList;
        return np(config);
    },
    /**新增租户 */
    addCompany(config = {}) {
        config.urlObj = addCompany;
        return np(config);
    },
    /**修改租户信息接口 */
    editCompany(config){
        config.urlObj = editCompany;
        return np(config);
    },
    /**删除租户 */
    delCompany(config){
        config.urlObj = delCompany;
        return np(config);
    },
    /**默认角色分页查询列表 */
    getDefaultRole(config){
        config.urlObj = getDefaultRole;
        return np(config);
    },
    /**角色管理-租户角色分页查询接口 */
    getCompanyRole(config){
        config.urlObj = getCompanyRole;
        return np(config);
    },
    /**角色管理-租户对应角色分页查询接口 */
    getTenantRole(config){
        config.urlObj = getTenantRole;
        return np(config);
    },
    /**新增角色及权限接口 */
    addRole(config){
        config.urlObj = addRole;
        return np(config);
    },
    /**修改角色权限信息接口 */
    editRole(config){
        config.urlObj = editRole;
        return np(config);
    },
    /**删除角色权限信息接口 */
    delRole(config){
        config.urlObj = delRole;
        return np(config);
    }
}