import {http} from './http'
import Qs from 'qs'
const baseEnvConfig = require('../../config/envConfig');
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
var queryPhrase = {url:'/busi/cs/commonmsg/query',type:'post'}
var addPhrase = {url:'/busi/cs/commonmsg/add',type:'post'}
var addBlack = {url: '/busi/blackcustomer/add', type: 'post'}
var delBlack = {url: '/busi/blackcustomer/del', type: 'post'}
var editPhrase = {url:'/busi/cs/commonmsg/update',type:'post'}
var modifyTag = {url:'/busi/userinfo/modifyTag',type:'post'}
var getKfGroup = {url:'/busi/skillgroup/personcount',type:'post'}
// var getFreeKfSeat = {url:'/api/v1/csmanagement/query/spareseatinfo',type:'post'}
var addKfgroup = {url:'/busi/skillGroup/addSkillGroupByTenant',type:'post'}
var delPhrase = {url:'/busi/cs/commonmsg/del',type:'post'}
var getSessionByUser = {url:'/busi/cs/session/querySessionByUser',type:'post'}
var getHxAccount = {url:'/busi/cs/session/queryHxAccountByUser',type:'post'}
var getWorkMateByUser = {url:'/busi/cs/session/queryWorkMateByUser',type :'post'}
var addTransferSession = {url:'/busi/cs/waitSession/addTransferSession',type :'post'}
var queryCsUser = {url:'/busi/csmanagement/queryCsUserByTenantId',type :'post'}
var querySkillGroup = {url: '/busi/skillGroup/querySkillGroupByTenant',type: 'post'}
var queryCsMemberForPage = {url:'/busi/csmanagement/queryCsMemberForPage',type:'post'}
var queryCsSeatByTenantIdForPage = {url:'/busi/csmanagement/queryCsSeatByTenantIdForPage',type:'post'}
var addSeatInfo = {url:'/busi/csmanagement/addSeatInfo',type:'post'}
var addCsSeatByTenantId = {url:'/busi/csmanagement/addCsSeatByTenantId',type:'post'}
var queryTenantRoleForList = {url:'/sys/role/queryTenantRoleForList',type:'post'}
var cTOIsOnline = {url: '/busi/cs/waitSession/checkTransferObjIsOnline',type: 'post'}
var queryTenantForCenter = {url: '/sys/csCenter/queryTenantForCenter',type: 'post'}
var querySeatIdByUserId = {url: '/busi/csmanagement/querySeatIdByUserId',type: 'post'}
var queryTenantSeatByUserIdForPage = {url: '/busi/csmanagement/queryTenantSeatByUserIdForPage',type: 'post'}
var updateCsSeatBySeatId = {url: '/busi/csmanagement/updateCsSeatBySeatId',type: 'post'}
var getServedTenant = {url:'/busi/cs/session/selectSysUserServeTenantInfo',type: 'post'}
var queryWaitSessionForPage = {url: '/busi/cs/waitSession/queryWaitSessionForPage', type: 'post'}
var updateHxStatusByAccount = {url: '/busi/cs/session/updateHxStatusByAccount', type: 'post'}
var updateJoinSession = {url: '/busi/cs/waitSession/updateJoinSession', type: 'post'}
var updateRefuseSession = {url: '/busi/cs/waitSession/updateRefuseSession', type: 'post'}
var queryPrivateTagByTenant = {url: '/sys/dict/queryPrivateTagByTenant', type: 'post'}
var queryTenantByPermi = {url: '/sys/tenant/queryTenantByPermi', type: 'post'}
var querySeatsByTenantId = {url: '/busi/seat/querySeatsByTenantId', type: 'post'}
var addSeatGroupByTenant = {url: '/busi/skillGroup/addSeatGroupByTenant', type: 'post'}
var sendSessionEvaluateMsg = {url:'/busi/cs/session/sendSessionEvaluateMsg',type:'post'}
var endSessionHandle = {url:'/busi/cs/session/endSessionHandle',type:'post'}
var queryChatMsgBySession = {url:'/busi/cs/session/queryChatMsgBySession',type:'post'}
var modifyPwd = {url:'/sys/user/updateUserPwd',type:'post'}
var queryHistory = {url:'/busi/historySession/queryHistroySession',type:'post'}
var reCall = {url:'/busi/historySession/callBackSession',type:'post'}
var queryCustomerInfoByAccount = {url:'/busi/blackcustomer/queryCustomerInfoByAccount',type:'post'}
var updateCustomerInfoByAccount = {url:'/busi/blackcustomer/updateCustomerInfoByAccount',type:'post'}
var updateSeatMaxWaitNum = {url:'/busi/cs/session/updateSeatMaxWaitNum',type:'post'}
var querySeatMaxWaitNum = {url:'/busi/cs/session/querySeatMaxWaitNum',type:'post'}

var getHxAdminToken = {url:`http://a1.easemob.com/1150181010228220/${baseEnvConfig[process.env.NODE_ENV].appName}/token`,type:'post',hasProxy: true}
var getHxStatus = {url:`http://a1.easemob.com/1150181010228220/${baseEnvConfig[process.env.NODE_ENV].appName}/users/:username/status`,type:'get',hasProxy: true}
var getHxDevice = {url:`https://a1.easemob.com/1150181010228220/${baseEnvConfig[process.env.NODE_ENV].appName}/user/:username/resources`,type:'get',hasProxy: true}
export default {
    /**使用 APP 的 client_id 和 client_secret 获取授权管理员 token */
    getHxAdminToken(config){
        config.urlObj = getHxAdminToken;
        return np(config);
    },
    /**获取环信账户登录的设备 */
    getHxDevice(config){
        config.urlObj = getHxDevice;
        return np(config);
    },
    /**获取环信账户状态 */
    getHxStatus(config){
        config.urlObj = getHxStatus;
        return np(config);
    },
    /**客服工作台 - 当前会话 - 修改坐席最大接待数 */
    updateSeatMaxWaitNum(config){
        config.urlObj = updateSeatMaxWaitNum;
        return np(config);
    },
    /**客服工作台 - 当前会话 - 查询坐席最大接待数 */
    querySeatMaxWaitNum(config){
        config.urlObj = querySeatMaxWaitNum;
        return np(config);
    },
    /**客服工作台 - 当前会话 - 修改访客信息 */
    updateCustomerInfoByAccount(config){
        config.urlObj = updateCustomerInfoByAccount;
        return np(config);
    },
    /**客服工作台 - 当前会话 - 访客信息 */
    queryCustomerInfoByAccount(config){
        config.urlObj = queryCustomerInfoByAccount;
        return np(config);
    },
    /**客服工作台 - 会话历史 - 回呼 */
    reCall(config){
        config.urlObj = reCall;
        return np(config);
    },
    /**客服工作台 - 会话历史 - 历史记录 */
    queryHistory(config){
        config.urlObj = queryHistory;
        return np(config);
    },
    /**客服管理 - 成员管理 - 重置密码 */
    modifyPwd(config){
        config.urlObj = modifyPwd;
        return np(config);
    },
    /**客服工作台 - 当前会话 - 根据会话ID 获取聊天记录 */
    queryChatMsgBySession(config){
        config.urlObj = queryChatMsgBySession;
        return np(config);
    },
    /**客服工作台 - 当前会话 - 结束会话 */
    endSessionHandle(config){
        config.urlObj = endSessionHandle;
        return np(config);
    },
    /**客服工作台 - 当前会话 - 发送评价邀请 */
    sendSessionEvaluateMsg(config){
        config.urlObj = sendSessionEvaluateMsg;
        return np(config);
    },
    /**客服管理 - 客服组 - 绑定技能组与坐席关系 */
    addSeatGroupByTenant(config){
        config.urlObj = addSeatGroupByTenant;
        return np(config);
    },
    /**客服管理 - 客服组 - 根据技能组ID 租户ID 获取租户下坐席以及勾选状态 */
    querySeatsByTenantId(config){
        config.urlObj = querySeatsByTenantId;
        return np(config);
    },
    /**客服管理 - 客服组 - 根据权限获取对应的租户列表 */
    queryTenantByPermi(config){
        config.urlObj = queryTenantByPermi;
        return np(config);
    },
    /**查询客户标签 */
    queryPrivateTagByTenant(config){
        config.urlObj = queryPrivateTagByTenant;
        return np(config);
    },
    /**客服工作台 - 客服拒接会话 */
    updateRefuseSession(config){
        config.urlObj = updateRefuseSession;
        return np(config);
    },
    /**客服工作台 - 会话直接接入 */
    updateJoinSession(config){
        config.urlObj = updateJoinSession;
        return np(config);
    },
    /**客服工作台 - 修改环信账号登录状态 */
    updateHxStatusByAccount(config){
        config.urlObj = updateHxStatusByAccount;
        return np(config);
    },
    /**客服工作台 - 根据用户查询待接入会话列表 */
    queryWaitSessionForPage(config){
        config.urlObj = queryWaitSessionForPage;
        return np(config);
    },
    /**客服工作台 - 查询当前登录人员服务的租户列表接口 */
    getServedTenant(config){
        config.urlObj = getServedTenant;
        return np(config);
    },
    /**客服编辑保存接口 */
    updateCsSeatBySeatId(config){
        config.urlObj = updateCsSeatBySeatId;
        return np(config);
    },
    /**其他服务租户分页查询接口 */
    queryTenantSeatByUserIdForPage(config){
        config.urlObj = queryTenantSeatByUserIdForPage;
        return np(config);
    },
    /**客服编辑查询接口 */
    querySeatIdByUserId(config){
        config.urlObj = querySeatIdByUserId;
        return np(config);
    },
    /**查询租户所属的客服中心 */
    queryTenantForCenter(config){
        config.urlObj = queryTenantForCenter;
        return np(config);
    },
	/**客服工作台 - 检测转接对象是否在线 
     * (check Transfer Object Is Online)
    */
    cTOIsOnline(config){
        config.urlObj = cTOIsOnline;
        return np(config);
    },
    /**查询租户对应角色列表*/
    queryTenantRoleForList(config){
        config.urlObj = queryTenantRoleForList;
        return np(config);
    },     
    /**添加客服接口 */
    addCsSeatByTenantId(config){
        config.urlObj = addCsSeatByTenantId;
        return np(config);
    },     
    /**添加服务租户接口 */
    addSeatInfo(config){
        config.urlObj = addSeatInfo;
        return np(config);
    },     
    /**获取租户对应坐席以及人员信息 */
    queryCsSeatByTenantIdForPage(config){
        config.urlObj = queryCsSeatByTenantIdForPage;
        return np(config);
    },     
    /**客服分页查询接口 */
    queryCsMemberForPage(config){
        config.urlObj = queryCsMemberForPage;
        return np(config);
    },     
    /**根据租户ID查询租户下技能组的信息 */
    querySkillGroup(config){
        config.urlObj = querySkillGroup;
        return np(config);
    },
    /**客服管理 获取租户对应坐席以及人员信息 */
    queryCsUser(config){
        config.urlObj = queryCsUser;
        return np(config);
    },
    /**客服待接入  客服转接会话 */
    addTransferSession(config){
        config.urlObj = addTransferSession;
        return np(config);
    },
    /**客服会话  查询当前同事会话的列表 */
    getWorkMateByUser(config){
        config.urlObj = getWorkMateByUser;
        return np(config);
    },
    /**根据租户ID 获取环信账号信息 */
    getHxAccount(config){
        config.urlObj = getHxAccount;
        return np(config);
    },
    /**客服管理 查询当前会话的列表 */
    getSessionByUser(config){
        config.urlObj = getSessionByUser;
        return np(config);
    },
    /**删除常用语/常用语类型 */
    delPhrase(config){
        config.urlObj = delPhrase;
        return np(config);
    },
    /**租户下添加技能组 */
    addKfgroup(config){
        config.urlObj = addKfgroup;
        return np(config);
    },
    /**查询登陆用户所在租户下的空闲坐席（未分配人员坐席） */
    // getFreeKfSeat(config){
    //     config.urlObj = getFreeKfSeat;
    //     return np(config);
    // },
    /**查询租户下技能组信息（包含技能组下的人数） */
    getKfGroup(config){
        config.urlObj = getKfGroup;
        return np(config);
    },
    /**获取登陆人员所服务的租户信息 */
    getServedTenant(config){
        config.urlObj = getServedTenant;
        return np(config);
    },
    /**查询客户信息 */
    /**删除黑名单 */
    delBlack(config){
        config.urlObj = delBlack;
        return np(config);
    },
    /**修改客户标签 */
    modifyTag(config){
        config.urlObj = modifyTag;
        return np(config);
    },
    /**添加客户黑名单 */
    addBlack(config){
        config.urlObj = addBlack;
        return np(config);
    },
     /**查询常用语 **/
     queryPhrase(config){
        config.urlObj = queryPhrase;
        return np(config);
    },      
     /**新增常用语 **/
     addPhrase(config){
        config.urlObj = addPhrase;
        return np(config);
    },  
     /**编辑常用语 **/
     editPhrase(config){
        config.urlObj = editPhrase;
        return np(config);
    },  
}