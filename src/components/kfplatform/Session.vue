<template>
    <div class="session">
        <Row class="top" >
            <Col span="12" style="text-align:left;">
                <span class="session-title">会话</span>
                <span class="title">最大接待人数</span>
                <Select v-model="maxCustomers" style="width:100px;z-index:2" @on-change="onChange">
                    <Option value="5">5</Option>
                    <Option value="8">8</Option>
                    <Option value="10">10</Option>
                    <Option value="15">15</Option>
                    <Option value="20">20</Option>
                </Select>
            </Col>
            <Col span="12" style="text-align:right;" v-show="false">
                <span class="statistics">接起会话数:{{revSessionNum}} 结束会话数:{{endSessionNum}} 在线时长:{{onlineTime}}</span>
                <span class="statistics">消息提示音
                    <i-switch v-model="tipsSwitch" @on-change="switchChange" size="small"></i-switch>
                </span>
            </Col>
        </Row>

        <Row class="chat">
            <Col span="8" class="left-session">
                <session-left :props="sessionInfo" @deptClick="deptClick"
                    @kfClick="kfClick" @changeTab="changeTab" @search="search"></session-left>
            </Col>
            <Col span="16" class="right-session" v-show="showChatBox">
                <session-right :props="sessionInfo" @signOut="signout" @getSessionByUser="updateSessionList"></session-right>
            </Col>
        </Row>
    </div>
</template>
<script>
import SessionLeft from './SessionLeft'
import SessionRight from './SessionRight'
import { mapActions } from 'vuex'
import kfApi from '../../service/kfApi'
import {Headers, Warning} from '../common/Consts.js'
import { formatDate as formatLocalDate, isNull } from '../../utils'
import * as baseEnvConfig from '../../../config/envConfig';
export default {
    name: 'Session',
    computed: {
        userLogo(){
            return this.$store.state.userLogo; 
        },
        curSessionId: {
            get(){
                return this.$store.state.curSessionId;
            },
            set(val){
                this.$store.dispatch('setCurSessionId', val);
            }
        },
        hxAccount: {
            get(){
                return this.$store.state.curHxAccount;
            },
            set(val){
                this.$store.dispatch('setCurHxAccount', val);
            }
        },
        hxPwd: {
            get(){
                return this.$store.state.curHxPwd;
            },
            set(val){
                this.$store.dispatch('setCurHxPwd', val);
            }
        },
        connContext(){
            return this.$store.state.connContext;
        },
        curTenantId: {
            get(){
                return this.$store.state.curTenantId;
            },
            set(val){
                this.$store.dispatch('setCurTenantId', val);
            }
            
        },
        servedTenant:{
            get(){
                return this.$store.state.servedTenant;
            },
            set(val){
                this.$store.dispatch('setServedTenant', val);
            }
        },
        userName:{
            get() {
                return this.$store.state.userName;
            },
            set(val) {
                this.$store.dispatch('setUserName', val);
            }
        },
        curCustomerId: {
            get() {
                return this.$store.state.curCustomerId;
            },
            set(val) {
                this.$store.dispatch('setCurCustomerId', val);
            }
        },
        /**当前会话的客户的环信账户 */
        curCusHxAccount: {
            get() {
                return this.$store.state.curCusHxAccount;
            },
            set(val) {
                this.$store.dispatch('setCurCusHxAccount', val);
            }
        },
        tipsSwitch: {
            get() {
                return this.$store.state.tipsSwitch;
            },
            set(val) {
                this.$store.dispatch('setTipsSwitch', val);
            }
        },
        endSession: {
            get() {
                return this.$store.state.endSession;
            },
            set(val) {
                this.$store.dispatch('setEndSession', val);
            }
        }
    },
    data(){
        return {
            searchDealList: [],
            searchWorkmateList: [],
            curSeatId: '',
            curDept: {},
            access_token: '',
            showChatBox: false,//显示会话框
            curMaxCustomers: 0,
            maxCustomers: '10',
            revSessionNum: 0,
            endSessionNum: 0,
            onlineTime: '1小时',
            sessionInfo: {
                hasMessage: false,
                depts: [],
                searchKey: '',
                dealist: [],
                workmateList: [],
                showInfo: false,//展开折叠显示隐藏客户信息
                customerInfo: [
                    {
                        title: 'IP',
                        info: '192.168.1.1'
                    },
                    {
                        title: '地区',
                        info: '中国.湖北.武汉'
                    },
                    {
                        title: '软件环境',
                        info: 'CustomerSystem-ios/4 CFNetwork/902_2Danwin/17.7.0'
                    },
                    {
                        title: '操作系统',
                        info: 'iPhone_11.4.1'
                    },
                    {
                        title: '系统版本',
                        info: '2.1.6_4'
                    },
                    {
                        title: '运营商',
                        info: '中国移动'
                    }
                ],
                Datum: {},
                customerTags: [],
                logo: require('../../../static/i/home/1.jpg'),//会话中客户的logo
                zxLogo: require('../../../static/i/home/1.jpg'),//会话中坐席的logo
                cusNickName: '',
                sessionHistory: ''
            },
            oldTab: 'dealing'
        }
    },
    components: {
        SessionLeft,
        SessionRight
    },
    methods: {
        ...mapActions(['getCurCustomerId']),
        search(val){
            
            if(val.type == 'dealing'){
                if(isNull(val.searchText)){
                    this.sessionInfo.dealist = this.searchDealList ;
                    return ;
                }
                this.sessionInfo.dealist = this.searchDealList.filter((di,x) =>{
                    let displayName = di.chatUserNickName || '用户' + di.chatUserId;
                    return displayName.indexOf(val.searchText) > -1;
                })
            }
            else{
                if(isNull(val.searchText)){
                    this.sessionInfo.workmateList = this.searchWorkmateList ;
                    return ;
                }
                this.sessionInfo.workmateList = this.searchWorkmateList.filter((di,x) =>{
                    let displayName = di.nickName || '同事' + di.chatUserId;
                    return displayName.indexOf(val.searchText) > -1;
                })
            }
        },
        /**根据环信账号获取访客信息 */
        queryCustomerInfoByAccount(){
            let config = {
                data: {
                    hxAccount: this.curCusHxAccount
                },
                headers: Headers.json
            }
            kfApi.queryCustomerInfoByAccount(config).then(res=>{
                if(res.code == '0'){
                    this.sessionInfo.Datum = res.resultData;
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })
        },
        /**查询客户标签 */
        queryPrivateTagByTenant(){
            let config = {
                data : {
                    tenantId : this.curTenantId,
                    dictTypeCode: 'CUSTOMER_TAG'
                },
                headers : Headers.json
            };
            kfApi.queryPrivateTagByTenant(config).then(res =>{
                if(res.code == '0'){
                    this.sessionInfo.customerTags = res.resultData;
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })
        },
        /**获取环信管理员账户token */
        async getHxAdminToken(){
            let config = {
                data:{
                    grant_type: 'client_credentials',
                    client_id: baseEnvConfig[process.env.NODE_ENV].client_id,
                    client_secret: baseEnvConfig[process.env.NODE_ENV].client_secret,
                },
                headers: Headers.json
            }
            return await kfApi.getHxAdminToken(config);
        },
        /**上线环信账户 */
        onLineHxAccount(hxAccount){
            let config = {
                data: {
                    hxAccount: hxAccount,
                    loginStatus: 1
                },
                headers: Headers.json
            }
            kfApi.updateHxStatusByAccount(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('上线成功');
                }else{
                    this.$Message.warning(res.message);
                }
            }, err =>{
                this.$Message.error(err);
            });
        },
        /**查询环信账户在线状态 */
        async getHxStatus(accessToken){
            let config = {
                path:{
                    username: this.hxAccount.toLowerCase()
                },
                headers: {
                    'Authorization': 'Bearer ' +accessToken,
                    'Content-Type': 'application/json'
                }
            }
            return await kfApi.getHxStatus(config);
        },
        /**连接环信 */
        connect(){
            var _this = this;
            this.$IM.methods.login(this.hxAccount.toLowerCase(), this.hxPwd, _this.connContext.access_token,function(data){
                //_this.updateHxStatusByAccount(_this.hxAccount, 1);
                _this.access_token = data.access_token;
                _this.modifyHxAccountStatus(_this.hxAccount, 1);
            }, function(err){
                _this.$Message.error(err);
                setTimeout(function(){
                    _this.$router.push(
                        {
                            name:'Login',
                        }
                    )
                },1000);
            });
        },
        /**结束会话 */
        signout(){
            let config = {
                data: {
                    busiId: this.curSessionId
                },
                headers: Headers.json
            }
            kfApi.endSessionHandle(config).then(res=>{
                if(res.code == '0'){
                    this.$Message.info('结束会话成功');
                    this.showChatBox = false;
                    this.getSessionByUser();
                }
                else if(res.code == '100011'){
                    this.$Message.warning('请先给本次会话打个标签');
                    this.endSession = true;
                    return false;
                }
                else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })
        },
        /**查询接待人数 */
        querySeatMaxWaitNum(){
            let config = {
                data:{
                    busId: this.curSeatId,
                },
                headers: Headers.json
            }
            kfApi.querySeatMaxWaitNum(config).then(res =>{
                if(res.code == '0'){
                    this.maxCustomers = res.resultData.maxWaitNum + '';
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            });
        },
        /**切换接待人数 */
        onChange(val){
            this.curMaxCustomers = val;
            let config = {
                data:{
                    busId: this.curSeatId,
                    maxWaitNum: this.curMaxCustomers
                },
                headers: Headers.json
            }
            kfApi.updateSeatMaxWaitNum(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('修改成功');
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            });
        },
        /**客服工作台 - 查询当前会话的列表 */
        getSessionByUser(){
            kfApi.getSessionByUser({
                data:{
                    tenantId: this.curTenantId
                },
                headers: Headers.json
            }).then(response =>{
                if(response.code == '0'){
                    this.curCustomerId = '';//刷新会话列表后隐藏会话框
                    this.showChatBox = false;
                    this.sessionInfo.depts.map(item=>{
                        if(item.tenantName == this.curTenantName){
                            this.searchDealList.splice(0,this.searchDealList.length); 
                            this.searchDealList =  response.resultData;
                            this.sessionInfo.dealist.splice(0,this.sessionInfo.dealist.length);
                            this.sessionInfo.dealist = response.resultData;/*.filter((i,x) =>{
                                return i.enableStatus == 0?true: false
                            })*/
                        }
                    })
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            });
        },
        /**客服工作台 - 查询当前同事会话的列表 getWorkMateByUser(config: any): Promise<any> */
        getWorkMateByUser(res,val){
            kfApi.getWorkMateByUser({
                data: {
                    hxAccount: res.resultData.hxAccount
                },
                headers: Headers.json
            }).then(response =>{
                if(response.code == '0'){
                    this.sessionInfo.depts.map(item=>{
                        if(item.tenantName == val.item.tenantName){
                            this.searchWorkmateList.splice(0,this.searchWorkmateList.length); 
                            this.searchWorkmateList =  response.resultData;
                            this.sessionInfo.workmateList.splice(0, this.sessionInfo.workmateList.length);
                            this.sessionInfo.workmateList = response.resultData
                        }
                    })
                }
            });
        },
        /**修改环信账号登录状态 */
        modifyHxAccountStatus(hxAccount, loginStatus){
            this.getHxAdminToken();
        },
        /**获取环信账户登录的设备 */
        async getHxDevice(accessToken){
            let config = {
                path:{
                    username: this.hxAccount
                },
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                }
            }
            return await kfApi.getHxDevice(config);
        },
        /**单击某个公司,获取默认环信账户和密码 */
        deptClick(val){
            this.sessionInfo.hasMessage = false;
            this.curDept = val;
            this.curSeatId = val.item.seatId;
            this.curTenantId = val.item.sysId;
            this.curTenantName = val.item.tenantName;
            let config = {
                data: {
                    tenantId: this.curTenantId
                },
                headers: Headers.json
            },_this = this;
            this.querySeatMaxWaitNum();
            kfApi.getHxAccount(config).then(res=>{
                if(res.code == '0'){
                    if(res.resultData != null){
                        _this.hxAccount = res.resultData.hxAccount.toLowerCase();
                        _this.hxPwd = res.resultData.hxPwd;
                        _this.getHxAdminToken().then(response =>{
                            if(response && response.access_token){
                                _this.getHxStatus(response.access_token).then(res =>{
                                    if(res && res.data){
                                        let x = _this.hxAccount.toLowerCase();
                                        if(res.data[x] == 'offline'){
                                            _this.connect();
                                            _this.onLineHxAccount(_this.hxAccount);
                                        }
                                        else{
                                            _this.getHxDevice(response.access_token).then(devRes=>{
                                                var isLoginWebim = false;
                                                if(devRes && devRes.data){
                                                    devRes.data.map(di=>{
                                                        if(di.res == 'webim'){
                                                            isLoginWebim = true;
                                                        }
                                                    })
                                                };
                                                if(!isLoginWebim){
                                                    _this.connect();
                                                    _this.onLineHxAccount(_this.hxAccount);
                                                }
                                            });
                                        }
                                    }else{
                                        _this.$Message.error('查询环信账户在线状态失败');
                                    }
                                })
                            }else{
                                _this.$Message.error('查询环信管理员账户token失败');
                            }
                        })
                        _this.getSessionByUser();
                        _this.getWorkMateByUser(res, val);
                        
                    }else{
                        _this.$Message.warning('获取租户环信账户失败');
                    }
                }else{
                    _this.$Message.error(res.message);
                }
            }, err =>{
                this.$Message.error(err);
            })
        },
        /**解析表情 */
        parseEmoji(msg){
            var emoji = this.$IM.WebIM.Emoji;

            for (var face in emoji.map) {
                if (emoji.map.hasOwnProperty(face)) {
                    while (msg.indexOf(face) > -1) {
                        msg = msg.replace(face, '<img class="emoji" src="' + emoji.path + emoji.map[face] + '" />');
                    }
                }
            }
            return msg;
        },
        /**滚动到底部 */
        bottomScroll(o){
            if(o){
                o.scrollTop = o.scrollHeight + 400;
            }
        },
        /**根据会话ID 获取聊天记录 */
        queryChatMsgBySession(){
            let _this = this;
            let config = {
                data: {
                    busiId: this.curSessionId
                },
                headers: Headers.json
            };
            kfApi.queryChatMsgBySession(config).then(res =>{
                if(res.code == "0"){
                    if( res.resultData){
                        function compare(prop){
                            return function(a,b){
                                var value1 = a[prop];
                                var value2 = b[prop];
                                return value1 - value2;
                            }
                        };
                        res.resultData = res.resultData.sort(compare('msgSendTime'));//排序消息
                        res.resultData = res.resultData.filter((i,x)=>{//过滤消息
                            return i.msgSender == _this.curCusHxAccount || i.msgReceiver == _this.curCusHxAccount ? true : false
                        });
                        _this.sessionInfo.sessionHistory = '';
                        res.resultData.map((i,x) =>{
                            var innerHtml,from = i.msgSender,to = i.msgReceiver,message = JSON.parse(i.msgContent);
                            var time = formatLocalDate(new Date(i.msgSendTime*1000),"yyyy-MM-dd HH:mm:ss");
                            //1.文本消息2.图片消息3视频4位置5.语音消息6文件7命令8超链接',
                            if(i.msgType == '1'){
                                innerHtml = _this.parseEmoji(message.msg);
                            }
                            else if(i.msgType == '8'){
                                if(message && message.message_attr_is_commodity){
                                    innerHtml = `<a href="${message.message_attr_commodity_url}" target="_blank" style="display:inline-block;">
                                                    <img src="${message.message_attr_commodity_img_url}" style="width:32px;height:32px;">
                                                    <h3>${message.message_attr_commodity_name}</h3>
                                                    <div>价格: ${message.message_attr_commodity_price}</div>
                                                </a>`
                                }
                            }
                            let content = 
                                `<div class="msg-box">
                                    <div class="send-time on-send ${i.msgSender == _this.curCusHxAccount?'receive':''}">[${time}] 
                                        ${i.msgSender == _this.curCusHxAccount?_this.sessionInfo.cusNickName:i.msgSender == _this.hxAccount?_this.userName: from}
                                    </div>
                                    <div class="send-msg">
                                        <div class="logo ${i.msgSender == _this.curCusHxAccount?'receive':''}"><img src="${i.msgSender == _this.curCusHxAccount?_this.sessionInfo.logo:_this.sessionInfo.zxLogo}"/></div>
                                        <div class="${i.msgSender == _this.curCusHxAccount?'ivu-poptip-popper  receive':'ivu-poptip-popper '}" 
                                            style="${i.msgSender == _this.curCusHxAccount?'will-change: top right':'will-change: top left'}" 
                                            x-placement="${i.msgSender == _this.curCusHxAccount?'right-start':'left-start'}">
                                            <div class="ivu-poptip-content">
                                                <div class="ivu-poptip-arrow"></div> 
                                                <div class="ivu-poptip-inner">
                                                    <div class="ivu-poptip-body">
                                                        <div class="ivu-poptip-body-content">
                                                            <div class="ivu-poptip-body-content-inner">${innerHtml}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                    </div>
                                    
                                </div>`
                            _this.sessionInfo.sessionHistory += content;
                            setTimeout(function(){
                                let o = document.getElementById("chat-output");
                                _this.bottomScroll(o);
                            },200);
                        });
                    }
                    setTimeout(function(){
                        if(_this.curCustomerId && _this.curCustomerId!= undefined){
                            _this.showChatBox = true;
                        }
                        else{
                            _this.showChatBox = false;
                        }
                    }, 20);
                }else{
                    _this.$Message.warning(res.message);
                }
            }, err=>{
                _this.$Message.error(err);
            })
        },
        //单击某个客服
        kfClick(value){
            this.sessionInfo.hasMessage = false;
            this.curSessionId = value.di.busiId;
            this.curCustomerId = value.di.chatUserId;
            this.curCusHxAccount = value.di.hxAccount;
            this.sessionInfo.logo = !isNull(value.di.chatUserLogo)?value.di.chatUserLogo:'../../../static/i/home/1.jpg';
            this.sessionInfo.cusNickName = !isNull(value.di.chatUserNickName)?value.di.chatUserNickName:'用户'+this.curCustomerId;
            this.sessionInfo.zxLogo = !isNull(this.userLogo)?this.userLogo:'../../../static/i/home/1.jpg';
            this.queryPrivateTagByTenant();
            this.queryChatMsgBySession();
            this.queryCustomerInfoByAccount();
        },
        /**提示音开关
         * @param val true or false
         */
        switchChange(val){
            this.tipsSwitch = val;
        },
        /**切换进行中、同事页签 */
        changeTab(value){
            if(this.oldTab != value){
                this.showChatBox = false;
                this.curCustomerId = '';
                this.oldTab = value;
            }
        },
        updateSessionList(message){
            if(message){
                this.sessionInfo.hasMessage = true;
            }
            this.getSessionByUser();
        }
    },
    mounted(){
        this.sessionInfo.depts = this.servedTenant;
        this.maxCustomers = this.sessionInfo.depts.maxSeatNum || '10';
    }
}
</script>
<style lang="less" scoped>
.session{
    background-color: white;
    min-width: 1220px;
    
    .top{
        height: 107px;
        line-height: 107px;
        
        border-radius: 5px 5px 0px 0px;

        .session-title{
            font-size: 16px;
            font-weight: bold;
            padding:0px 10px 0px 40px;
        }

        .statistics{
            background-color: white;
            padding: 5px;
            border-radius: 5px;
            margin-right: 10px;
        }
    }
    .chat{
        overflow: hidden;
        width:100%;
        .left-session{
            background-color: white;
            border-radius: 0px 5px 0px 0px;
        }
        .right-session{
        }
    }
}
</style>