import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {deepClone} from '../utils'

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createPersistedState()],//会自动保存创建的状态。刷新还在
    state: {
        /**当前登录系统的账户logo */
        userLogo: '',
        /**当前登录系统的账户 */
        userName: '',
        /**当前登录系统的账户的id */
        userId: '',
        /**当前登录系统的账户的密码 */
        password: '',
        /**当前会话的客户的id */
        curCustomerId: '',
        /**当前会话的客户的环信账户 */
        curCusHxAccount: '',
        /**环信连接需要的token */
        accessToken: '',
        /**远程连接需要的token */
        remoteToken: '',
        /**环信连接上下文 */
        connContext: {},
        /**消息提示音开关 */
        tipsSwitch: false,
        /**当前账户的菜单 */
        menu:{},
        /**当前登录系统的账户所服务的租户 */
        servedTenant:[],
        /**当前登录系统的账户的环信账户 */
        curHxAccount: '',
        /**当前登录系统的账户的环信账户的密码 */
        curHxPwd: '',
        /**当前选择的租户的id */
        curTenantId: '',
        /**当前会话id */
        curSessionId: '',
        /**会话状态 */
        endSession: false,
        /**会话历史纪录 */
        sessionHistory: '',
        /**是否记住密码 */
        remember: false,
        /**所有敏感词 */
        allSensitiveWords: []
    },
    mutations: {
        setAllSensitiveWords: (state, allSensitiveWords) =>{
            state.allSensitiveWords = allSensitiveWords;
        },
        getAllSensitiveWords: state =>{
            return state.allSensitiveWords;
        },
        setUserLogo: (state, userLogo) =>{
            state.userLogo = userLogo;
        },
        getUserLogo: state =>{
            return state.userLogo;
        },
        setRemember: (state, remember) =>{
            state.remember = remember;
        },
        getRemember: state =>{
            return state.remember;
        },
        setSessionHistory: (state, sessionHistory) =>{
            state.sessionHistory = sessionHistory;
        },
        getSessionHistory: state =>{
            return state.sessionHistory;
        },
        setEndSession: (state, endSession) =>{
            state.endSession = endSession;
        },
        getEndSession: state =>{
            return state.endSession;
        },
        setCurCusHxAccount: (state, curCusHxAccount) =>{
            state.curCusHxAccount = curCusHxAccount;
        },
        getCurCusHxAccount: state =>{
            return state.curCusHxAccount;
        },
        setCurSessionId: (state, curSessionId) =>{
            state.curSessionId = curSessionId;
        },
        getCurSessionId: state =>{
            return state.curSessionId;
        },
        setUserId: (state, userId) =>{
            state.userId = userId;
        },
        getUserId: state =>{
            return state.userId;
        },
        setCurTenantId: (state, curTenantId) =>{
            state.curTenantId = curTenantId;
        },
        getCurTenantId: state =>{
            return state.curTenantId;
        },
        getCurHxPwd: state =>{
            return state.curHxPwd;
        },
        setCurHxPwd: (state, curHxPwd) =>{
            state.curHxPwd = curHxPwd;
        },
        getCurHxPwd: state =>{
            return state.curHxPwd;
        },
        setCurHxAccount: (state, curHxAccount) =>{
            state.curHxAccount = curHxAccount;
        },
        getCurHxAccount: state =>{
            return state.curHxAccount;
        },
        setServedTenant: (state, servedTenant) =>{
            state.servedTenant = servedTenant;
        },
        getServedTenant: state =>{
            return state.servedTenant;
        },
        setMenu: (state, menu) =>{
            state.menu = menu;
        },
        getMenu: state =>{
            return state.menu;
        },
        setUserName: (state, userName) =>{
            state.userName = userName;
        },
        getUserName: state =>{
            return state.userName;
        },
        setPassword: (state, password) =>{
            state.password = password;
        },
        getPassword: state =>{
            return state.password;
        },
        setCurCustomerId: (state, curCustomerId) =>{
            state.curCustomerId = curCustomerId;
        },
        getCurCustomerId: state =>{
            return state.curCustomerId;
        },
        setAccessToken: (state, accessToken) =>{
            state.accessToken = accessToken;
        },
        getAccessToken: state =>{
            return state.accessToken;
        },
        setRemoteToken: (state,  remoteToken) =>{
            state.remoteToken = remoteToken;
        },
        getRemoteToken: state =>{
            return state.remoteToken;
        },
        setConnContext: (state, connContext) =>{
            state.connContext = deepClone( connContext )
        },
        getConnContext: state =>{
            return state.connContext;
        },
        setTipsSwitch: (state, tipsSwitch) =>{
            state.tipsSwitch = tipsSwitch;
        },
        getTipsSwitch: state =>{
            return state.tipsSwitch;
        }
    },
    actions: {
        /**设置 是否记住密码 */
        setAllSensitiveWords: ({ commit }, allSensitiveWords) =>{
            commit('setAllSensitiveWords', allSensitiveWords);
        },
        /**获取 是否记住密码 */
        getAllSensitiveWords: ({ commit }) => {
            commit('getAllSensitiveWords');
        },
        /**设置 是否记住密码 */
        setUserLogo: ({ commit }, userLogo) =>{
            commit('setUserLogo', userLogo);
        },
        /**获取 是否记住密码 */
        getUserLogo: ({ commit }) => {
            commit('getUserLogo');
        },
        /**设置 是否记住密码 */
        setRemember: ({ commit }, remember) =>{
            commit('setRemember', remember);
        },
        /**获取 是否记住密码 */
        getRemember: ({ commit }) => {
            commit('getRemember');
        },
        /**设置 会话历史纪录 */
        setSessionHistory: ({ commit }, sessionHistory) =>{
            commit('setSessionHistory', sessionHistory);
        },
        /**获取 会话历史纪录 */
        getSessionHistory: ({ commit }) => {
            commit('getSessionHistory');
        },
        /**设置 会话状态 */
        setEndSession: ({ commit }, endSession) =>{
            commit('setEndSession', endSession);
        },
        /**获取 会话状态 */
        getEndSession: ({ commit }) => {
            commit('getEndSession');
        },
        /**设置 curSessionId */
        setCurCusHxAccount: ({ commit }, curCusHxAccount) =>{
            commit('setCurCusHxAccount', curCusHxAccount);
        },
        /**获取 curSessionId */
        getCurCusHxAccount: ({ commit }) => {
            commit('getCurCusHxAccount');
        },
        /**设置 curSessionId */
        setCurSessionId: ({ commit }, curSessionId) =>{
            commit('setCurSessionId', curSessionId);
        },
        /**获取 curSessionId */
        getCurSessionId: ({ commit }) => {
            commit('getCurSessionId');
        },
        /**设置 userId */
        setUserId: ({ commit }, userId) =>{
            commit('setUserId', userId);
        },
        /**获取 当前租户id */
        getUserId: ({ commit }) => {
            commit('getUserId');
        },
        /**设置 当前租户id */
        setCurTenantId: ({ commit }, curTenantId) =>{
            commit('setCurTenantId', curTenantId);
        },
        /**获取 当前租户id */
        getCurTenantId: ({ commit }) => {
            commit('getCurTenantId');
        },
        /**设置 当前登录账户默认的环信账户密码 */
        setCurHxPwd: ({ commit }, curHxPwd) =>{
            commit('setCurHxPwd', curHxPwd);
        },
        /**获取 当前登录账户所服务的租户密码 */
        getCurHxPwd: ({ commit }) => {
            commit('getCurHxPwd');
        },
        /**设置 当前登录账户默认的环信账户 */
        setCurHxAccount: ({ commit }, curHxAccount) =>{
            commit('setCurHxAccount', curHxAccount);
        },
        /**获取 当前登录账户默认的环信账户 */
        getCurHxAccount: ({ commit }) => {
            commit('getCurHxAccount');
        },
        /**设置 当前登录账户所服务的租户 */
        setServedTenant: ({ commit }, servedTenant) =>{
            commit('setServedTenant', servedTenant);
        },
        /**获取 当前登录账户所服务的租户 */
        getServedTenant: ({ commit }) => {
            commit('getServedTenant');
        },
        /**设置 菜单 */
        setMenu: ({ commit }, menu) =>{
            commit('setMenu', menu);
        },
        /**获取 菜单 */
        getMenu: ({ commit }) => {
            commit('getMenu');
        },
        /**获取 登录账户 */
        getUserName: ({ commit }) => {
            commit('getUserName');
        },
        /**设置 登录账户 */
        setUserName: ({ commit }, userName) =>{
            commit('setUserName', userName);
        },
        /**获取 登录密码 */
        getPassword: ({ commit }) => {
            commit('getPassword');
        },
        /**设置 登录密码 */
        setPassword: ({ commit }, password) =>{
            commit('setPassword', password);
        },
        /**设置 当前会话客户id */
        setCurCustomerId: ({ commit }, curCustomerId) =>{
            commit('setCurCustomerId', curCustomerId);
        },
        /**获取 当前会话客户id */
        getCurCustomerId: ({ commit }) =>{
            commit('getCurCustomerId');
        },
        /**设置 会话token */
        setAccessToken: ({ commit }, accessToken) =>{
            commit('setAccessToken',accessToken);
        },
        /**获取 会话token */
        getAccessToken: ({ commit }) =>{
            commit('getAccessToken');
        },
        /**设置 远程登录token */
        setRemoteToken: ({ commit }, remoteToken) =>{
            commit('setRemoteToken',remoteToken);
        },
        /**获取 远程登录token */
        getRemoteToken: ({ commit }) =>{
            commit('getRemoteToken');
        },
        /**设置 环信连接上下文 */
        setConnContext: ({ commit }, connContext) =>{
            commit('setConnContext', connContext);
        },
        /**获取 环信连接上下文 */
        getConnContext: state =>{
            commit('getConnContext');
        },
        /**设置 消息提示开关 */
        setTipsSwitch: ({ commit }, tipsSwitch) =>{
            commit('setTipsSwitch', tipsSwitch);
        },
        /**获取 消息提示开关 */
        getTipsSwitch: state =>{
            commit('getTipsSwitch');
        }
    },
    getters: {
        userName: state =>{
            return 'getterUserName' + state.userName;
        },
    }
});
