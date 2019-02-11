import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {deepClone} from '../utils'

Vue.use(Vuex);

export default new Vuex.Store({
    plugins: [createPersistedState()],//会自动保存创建的状态。刷新还在
    state: {
        /**当前登录系统的账户 */
        userName: '',
        /**当前登录系统的账户的密码 */
        password: '',
        /**当前账户的菜单 */
        menu:{},
        /**当前登录系统的账户所服务的租户 */
        /**是否记住密码 */
        remember: false,
        /**所有敏感词 */
        allSensitiveWords: [],
        /**文章id */
        chapterId: '1',
        chapterStatus: '',
        accessToken: ''
    },
    mutations: {
        setChapterStatus: (state, chapterStatus) =>{
            state.chapterStatus = chapterStatus;
        },
        getChapterStatus: state =>{
            return state.chapterStatus;
        },
        setAccessToken: (state, accessToken) =>{
            state.accessToken = accessToken;
        },
        getAccessToken: state =>{
            return state.accessToken;
        },
        setChapterId: (state, chapterId) =>{
            state.chapterId = chapterId;
        },
        getChapterId: state =>{
            return state.chapterId;
        },
        setAllSensitiveWords: (state, allSensitiveWords) =>{
            state.allSensitiveWords = allSensitiveWords;
        },
        getAllSensitiveWords: state =>{
            return state.allSensitiveWords;
        },
        setRemember: (state, remember) =>{
            state.remember = remember;
        },
        getRemember: state =>{
            return state.remember;
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
    },
    actions: {
        setChapterStatus: ({ commit }, chapterStatus) =>{
            commit('setChapterStatus', chapterStatus);
        },
        getChapterStatus: ({ commit }) => {
            commit('getChapterStatus');
        },
        setAccessToken: ({ commit }, accessToken) =>{
            commit('setAccessToken', accessToken);
        },
        getAccessToken: ({ commit }) => {
            commit('getAccessToken');
        },
        /**文章id */
        setChapterId: ({ commit }, chapterId) =>{
            commit('setChapterId', chapterId);
        },
        getChapterId: ({ commit }) => {
            commit('getChapterId');
        },
        /**设置 是否记住密码 */
        setAllSensitiveWords: ({ commit }, allSensitiveWords) =>{
            commit('setAllSensitiveWords', allSensitiveWords);
        },
        /**获取 是否记住密码 */
        getAllSensitiveWords: ({ commit }) => {
            commit('getAllSensitiveWords');
        },
        /**设置 是否记住密码 */
        setRemember: ({ commit }, remember) =>{
            commit('setRemember', remember);
        },
        /**获取 是否记住密码 */
        getRemember: ({ commit }) => {
            commit('getRemember');
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
        
    },
    getters: {
        userName: state =>{
            return 'getterUserName' + state.userName;
        },
    }
});
