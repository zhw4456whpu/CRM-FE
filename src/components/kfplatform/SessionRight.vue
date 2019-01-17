<template>
    <Row class="session-right" @click.native="evtProxy">
        <Row class="right-layout">
            <Col span="16" style="text-align:left;">
                <Row class="chat-top">
                    <Col span="12" style="padding-left:20px;">{{props.cusNickName}}(会话来自:快速创建的关联)</Col>
                    <Col span="12" style="text-align:center;">
                        <Col :xs="1" :sm="2" :md="3" :lg="4" style="float:right;">
                            <Icon class="cursor" size="16" type="power" @click="signout" title="结束会话"></Icon>
                        </Col>
                        <Col :xs="1" :sm="1" :md="1" :lg="1" style="float:right;"><i style="color:#ecebf0;">|</i></Col>
                        <Col :xs="1" :sm="2" :md="3" :lg="4" style="float:right;">
                            <Icon class="cursor" size="16" type="ios-flag" @click="addFlag('popup')" title="会话标签"/>
                            <Modal v-model="endSession" title="会话标签和备注">
                                <Row>
                                    <Row >添加会话标签和备注</Row>
                                    <Row>
                                        <Input v-model="searchKey" placeholder="标签和备注" class="search">
                                            <Button slot="append" icon="ios-search" @click="search(searchKey)"></Button>
                                        </Input>
                                    </Row>
                                    <Row class="tag-list">
                                        <Col span="12">
                                            <Row v-for="(item,index) in tagList" :key="index" class="tag" @click.native="selectTag(item)">
                                                <Col span="20">{{item.tagName}}</Col>
                                                <Col span="4">
                                                    <div class="tag-color"></div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span="12" style="padding:0px 5px;" v-show="showSubTag">
                                            <Row class="tag" v-for="(ci,cx) in curSubTagList" :key="cx" @click.native="selectTag(ci)">{{ci.tagName}}</Row>
                                        </Col>
                                    </Row>
                                    <Row class="selected-tag">
                                        <template v-for="(item,index) in selectedTag">
                                            <template v-if="item.children && item.children.length > 0">
                                                <Tag closable color="blue" v-for="(sitem,sindex) in item.children" :key="sindex">{{item.tagName + '>' + sitem.tagName}}</Tag>
                                            </template>
                                            <template v-else>
                                                <Tag closable color="blue">{{item.tagName}}</Tag>
                                            </template>
                                        </template>
                                    </Row>
                                    <Row class="remark">
                                        <Input type="textarea" v-model="remarkText" row="3" placeholder="备注"></Input>
                                    </Row>
                                </Row>
                                <div slot="footer">
                                    <Button type="primary" size="large" @click="addFlag('save')">确定</Button>
                                </div>
                            </Modal>
                        </Col>
                        <Col :xs="1" :sm="2" :md="3" :lg="4" style="float:right;">
                            <Icon class="cursor" size="16" type="ios-rose" @click="comment('popup')" title="发起评价"></Icon>
                            <Modal v-model="showComment" title="发送评价邀请" @on-ok="comment('save')" >
                                <Row type="flex" justify="center">
                                    <img src="../../../static/i/kfplatform/vote.jpg" style="width:350px;height:270px;" />
                                </Row>
                            </Modal>
                        </Col>
                        <Col :xs="1" :sm="2" :md="3" :lg="4" style="float:right;">
                            <Icon class="cursor" size="16" type="shuffle" @click="changeConnect('popup')" title="选择转接对象"></Icon>
                            <Modal v-model="showModal" title="选择转接对象">
                                <Tabs value="kf" @on-click="changeTab">
                                    <TabPane label="客服" name="kf">
                                        <Input v-model="searchKey" placeholder="客服" class="search">
                                            <Button slot="append" icon="ios-search" @click="search(searchKey)"></Button>
                                        </Input>
                                        <Row type="flex" justify="space-between" align="middle" class="kf-list"
                                            :style="{'overflow-y':kfSource.length > 6?'scroll':'hidden'}">
                                            <Col span="11" v-for="(item,key) in kfSource" :key="key" class="kf-item" 
                                                :class="{'selected':item.busId== curKF.busId}" 
                                                @click.native="changeTo(item, key, 'KF')">
                                                {{item.seatName}}
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane label="技能组" name="kfGroup">
                                        <Input v-model="searchKey" placeholder="技能组" class="search">
                                            <Button slot="append" icon="ios-search" @click="search(searchKey)"></Button>
                                        </Input>
                                        <Row type="flex" justify="space-between" align="middle" class="kf-list" 
                                            :style="{'overflow-y':kfGroupSource.length > 6?'scroll':'hidden'}">
                                            <Col span="11" v-for="(item,key) in kfGroupSource" :key="key" class="kf-item" 
                                                :class="{'selected':item.busId== curKFGroup.busId}" 
                                                @click.native="changeTo(item, key, 'KFG')">
                                                {{item.groupName}}
                                            </Col>
                                        </Row>
                                    </TabPane>
                                </Tabs>
                                <div slot="footer">
                                    <Button type="primary" size="large" @click="changeConnect('save')">确定</Button>
                                </div>
                            </Modal>
                        </Col>
                    </Col>
                </Row>
                <Row class="chat-body">
                    <Col span="24" class="chat-box">
                        <Row class="customer-info">
                            <Col span="22" style="min-height:1px">
                                <Row v-show="props.showInfo">
                                    <Row class="info-item" v-for="(item,index) in props.customerInfo" :key="index">
                                        <Col span="4" class="title">{{item.title}}:</Col>
                                        <Col span="20" class="info">{{item.info}}</Col>
                                    </Row>
                                </Row>
                            </Col>
                            <Col span="2" style="height:60px;line-height:60px;">
                                <span @click="toggleExpand" class="text-btn">{{expand}}</span>
                            </Col>
                            
                        </Row>
                        <!--<div class="chat-history" id="chat-history" v-html="props.sessionHistory">{{props.sessionHistory}}
                        </div>-->
                        <div class="chat-output" id="chat-output" v-html="output">{{output}}
                        </div>
                        <Row class="chat-input">
                            <Row class="input-btn">
                                <Col span="2" style="text-align:center;">
                                    <Icon type="happy-outline" class="cursor" size="16" @click.native="showEmoji"></Icon>
                                    <div class="emoji-pop" v-show="emojiModal">
                                        <Row class="emoji-list">
                                            <button @click="getEmoji(item)" v-for="(item,index) in emojiList" :key="index" class="emoji-btn">
                                                <img :src="item.src" class="emoji"/>
                                            </button>
                                            <!---->
                                        </Row>
                                    </div>
                                </Col>
                                <!--<Col span="2" style="text-align:center;">
                                    <Upload action="//jsonplaceholder.typicode.com/posts/">
                                        <Icon type="image"></Icon>
                                    </Upload>
                                </Col>
                                -->
                            </Row>

                            <Row class="input-wrapper">
                                <Input type="textarea" :rows="5" v-model="input" class="input-area" placeholder="请输入..." @keyup.native.enter="send" @oninput="inputChange"></Input>
                            </Row>

                            <Row class="submit-btn">
                                <Button type="primary" @click="send">发送</Button>
                            </Row>
                        </Row>
                    </Col>
                    
                </Row>
            </Col>
            <Col span="8" class="chatter-info">
                <Tabs value="datum" class="tabs2">
                    <TabPane label="资料" name="datum">
                        <datum :props="props" @refreshSessionList="refreshSessionList"></datum>
                    </TabPane>
                    <TabPane label="常用语" name="commonprase">
                        <common-phrase :ifEmbed="ifEmbed" @sendCommPhrase="sendCommPhrase"></common-phrase>
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
    </Row>
</template>
<script>
import Datum from './Datum'
import { mapActions } from 'vuex'
import { formatDate as formatLocalDate, isNull, trim } from '../../utils'
import CommonPhrase from './CommonPhrase'
import kfApi from '../../service/kfApi'
import systemconfigApi from '../../service/systemconfigApi';
import {Headers, IsExpand, specialCharsPatrn} from '../common/Consts.js'
const emojiText = [ '[):]',  
                '[:D]',  
                '[;)]',  
                '[:-o]',  
                '[:p]',  
                '[(H)]',  
                '[:@]',  
                '[:s]',  
                '[:$]',  
                '[:(]',  
                "[:'(]",  
                '[:|]',  
                '[(a)]',  
                '[8o|]',  
                '[8-|]',
                '[+o(]',  
                '[<o)]',  
                '[|-)]',  
                '[*-)]',  
                '[:-#]',  
                '[:-*]',  
                '[^o)]',  
                '[8-)]',  
                '[(|)]',  
                '[(u)]',  
                '[(S)]',  
                '[(*)]',  
                '[(#)]',  
                '[(R)]',  
                '[({)]',  
                '[(})]',  
                '[(k)]',  
                '[(F)]',  
                '[(W)]',  
                '[(D)]'];
export default {
    name: 'SessionRight',
    props: ['props'],
    components: {
        Datum,
        CommonPhrase
    },
    computed: {
        userName(){
            return this.$store.state.userName;
        },
        inputLen(){
            return this.input.length;
        },
        endSession: {
            get() {
                return this.$store.state.endSession;
            },
            set(val) {
                this.$store.dispatch('setEndSession', val);
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
        curTenantId: {
            get(){
                return this.$store.state.curTenantId;
            },
            set(val){
                this.$store.dispatch('setCurTenantId', val);
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
        curSessionId: {
            get(){
                return this.$store.state.curSessionId;
            },
            set(val){
                this.$store.dispatch('setCurSessionId', val);
            }
        },
        output: {
            get(){
                return this.props.sessionHistory;
            },
            set(val){
                this.props.sessionHistory += val;
            }
        },
        allSensitiveWords: {
            get(){
                return this.$store.state.allSensitiveWords;
            },
            set(val){
                this.$store.dispatch('setAllSensitiveWords', val);
            }
        },
    },
    data(){
        return {
            showSubTag: false,
            curTransferType:'',//当前转接类型：kf：客服；kfGroup：客服分组
            curKF: {},
            curKFGroup: {},
            emojiModal: false,
            emojiList: [],
            remarkText: '',
            selectedTag: [],
            showTag: false,
            tagList: [],
            subTagList: [],
            curSubTagList:[],
            starNum: 0,
            showComment: false,
            showModal: false,
            searchKey: '',
            kfSource: [],
            kfGroupSource: [],
            expand: IsExpand.expand,
            input: '',
            ifEmbed: true,
        }
    },
    methods: {
        ...mapActions(['getUserName']),
        /**发送常用语 */
        sendCommPhrase(msg){
            this.input = '';
            this.input = msg.msg;
            this.sendText();
        },
        /**刷新会话列表 */
        refreshSessionList(){
            this.$emit("getSessionByUser");
        },
        /**输入框变化 监听*/
        inputChange(val){
            console.log("inputChange $s",val);
            if(val && val.length > 500){
                this.$Message.warning("最大字符长度限定500字符");
                return false;
            }
        },
        /**获取客服分组 */
        querySkillGroup(){
            let config = {
                data:{
                    tenantId: this.curTenantId
                },
                headers: Headers.json
            };
            kfApi.querySkillGroup(config).then(res=>{
                if(res.code == '0'){
                    this.kfGroupSource = res.resultData;
                }
                else{
                    this.$Message.info(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**获取客服信息列表 */
        queryCsUser(){
            let config = {
                data:{
                    tenantId: this.curTenantId
                },
                headers: Headers.json
            }
            kfApi.queryCsUser(config).then(res=>{
                if(res.code == '0'){
                    this.kfSource = res.resultData.filter(i=>{
                        return i.seatCode != this.hxAccount && i.enableStatus==0;
                    });
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**转接到客服或者客服分组，切换tab */
        changeTab(val){
            this.curTransferType = val;
            if(val == 'kf'){
                this.queryCsUser();
            }
            else{
                this.querySkillGroup();
            }
        },
        /**滚动到底部 */
        bottomScroll(o){
            if(o){
                o.scrollTop = o.scrollHeight + 400;
            }
        },
        /**客服、客服组单击 */
        changeTo(item, key, type){
            if(type == 'KF'){
                this.curKF = item;
            }
            else{
                this.curKFGroup = item;
            }
        },
        /**事件代理 */
        evtProxy(e){
            if(e.target.className == 'emoji-list ivu-row' || e.target.className == 'emoji-pop'
                || e.target.nodeName == 'I'|| e.target.nodeName == 'IMG'){
                return;
            }else{
                this.emojiModal = false;
            }
        },
        /**获取静态表情图片 */
        getEmojiList(){
            this.emojiList.splice(0,this.emojiList.length);
            for(let i=1; i<36; i++){
                let emoji = {
                    src: '../../../static/emoji/ee_' + i + '.png',
                    id: i,
                    text: emojiText[i-1]
                }
                this.emojiList.push(emoji)
            }
        },
        /**点击emoji */
        getEmoji(emoji){
            
            this.input += emoji.text;
        },
        /**显示Emoji */
        showEmoji(e){
            this.emojiModal = !this.emojiModal;
        },
        /**搜索 */
        search(text){
            if(text == '') return;
        },
        /**确定转接 */
        confirmTransfer(){
            let transferObjId = this.curTransferType == 'kf'?this.curKF.busId:this.curKFGroup.busId;
            if(isNull(transferObjId)){
                this.$Message.warning('请选择转接对象');
                return false;
            }
            kfApi.addTransferSession({
                data: {
                    busiId: this.curSessionId,
                    transferObjId: transferObjId,
                    transferObjType: this.curTransferType=='kf'?1:2
                },
                headers: Headers.json
            }).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('转接成功');
                    this.$emit('getSessionByUser');
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, error=>{
                this.$Message.error(error);
            });
        },
        /**发起转接 */
        changeConnect(type){
            var _this = this;
            if(type == 'popup'){
                _this.curKF = {};
                _this.curKFGroup = {};
                _this.showModal = true;
                _this.changeTab('kf');
            }
            else{
                let transferObjId = _this.curTransferType == 'kf'?_this.curKF.busId:_this.curKFGroup.busId;
                if(isNull(transferObjId)){
                    _this.$Message.warning("请选择转接的客服");
                    return false;
                }
                let config = {
                    data: {
                        transferObjId: transferObjId,
                        transferObjType: _this.curTransferType=='kf'?1:2
                    },
                    headers: Headers.json
                }
                kfApi.cTOIsOnline(config).then(res=>{
                    if(res.code == '0'){
                        _this.showModal = false;
                        if(res.resultData){
                            _this.confirmTransfer();
                        }
                        else{
                            _this.$Modal.confirm({
                                title: '请您确认',
                                content: '目前无在线客服,请问您继续转接吗？',
                                onOk: function(){
                                    _this.confirmTransfer();
                                },
                                onCancel(){}
                            })
                        }
                    }
                    else{
                        this.$Message.warning(res.message);
                    }
                },err=>{
                    _this.$Message.error(err);
                })
            }
        },
        /**评论 */
        comment(type){
            if(type == 'popup'){
                this.showComment = true;
            }
            else{
                let config = {
                    data: {
                        hxAccount: this.hxAccount,
                        customerHxAccount: this.curCusHxAccount,
                        busiId: this.curSessionId
                    },
                    headers: Headers.json
                }
                kfApi.sendSessionEvaluateMsg(config).then(res =>{
                    if(res.code == '0'){
                        this.showComment = false;
                    }
                    else{
                        this.$Message.warning(res.message);
                    }
                },err=>{
                    this.$Message.error(err);
                })
            }
            
        },
        /** 查询会话标签**/
        querySessionTag(tagType){
            let config = {
                data: {
                   parentCode: tagType == 'root'?'0':this.parentCode
                },
                headers: Headers.json
            }
            systemconfigApi.querySessionTag(config).then(res =>{
                if(res.code == '0'){
                    if(tagType == 'root'){
                        this.tagList =  res.resultData;
                    }else{
                        this.subTagList = res.resultData;
                    }
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })
        }, 
        /**添加标签 */
        addFlag(type){
            if(type == 'popup'){
                this.endSession = true;
                this.selectedTag.splice(0,this.selectedTag.length);
            }
            else{
                this.submitSessionTag();
            }
        },
        /**单击标签、子标签 */
        selectTag(tag){
            if(tag.parentCode == '0' ){
                this.showSubTag = true;
                this.curSubTagList = this.subTagList.filter((i,x) =>{
                    return i.parentCode == tag.tagCode?true:false;
                })
            }
            else{
                this.selectedTag.splice(0,this.selectedTag.length);
                this.tagList.map((i,x) =>{
                    if(i.tagCode == tag.parentCode){
                        i.children = [];
                        i.children.push(tag);
                        this.selectedTag.push(i);
                    }
                });
            }
        },
        /**结束会话 */
        signout(){
            var _this = this;
            let config = {
                title: '请您确认',
                content:'结束当前会话吗？',
                onOk: function(){
                    console.log("确定结束会话");
                    _this.$emit('signOut','');
                    return true;
                },
                onCancel: function(){
                    console.log("取消结束会话")
                }
            }
            this.$Modal.confirm(config);
        },
        /**折叠展开 客户信息 */
        toggleExpand(){
            this.props.showInfo= !this.props.showInfo;
            if(this.props.showInfo){
                this.expand= IsExpand.pickup;
            }else{
                this.expand= IsExpand.expand;
            }
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
        /**过滤敏感词 */
        filterSensitiveWords(){
            // this.input = '法**纶';
            // for(let i = 0;i < this.allSensitiveWords.length; i++){
            //     let sensitiveWord = this.allSensitiveWords[i];
            //     sensitiveWord = sensitiveWord.replace(specialCharsPatrn, function(special){
            //         let c = '\\';
            //         return c + special;
            //     })

            //     var p = new RegExp(sensitiveWord, 'ig');
            //     this.input = this.input.replace(p,'***');
            // }
            let x = this.allSensitiveWords.indexOf(this.input);
            if(x > -1){
                this.input = "***";
                console.log("this.input %s", this.input);
            }
        },
        /**单聊发送文本消息 */
        sendText(){
            this.input = trim(this.input);
            if(this.input == ''){
                return ;
            }else{
                this.filterSensitiveWords();
            }
            
            if(this.input.length > 500){
                this.$Message.warning("输入框字数不超过500个字符");
                return false;
            }
            var _this = this;
            // 单聊发送文本消息
            var id = _this.$IM.conn.getUniqueId();                 // 生成本地消息id
            var msg = new this.$IM.WebIM.message('txt', id);       // 创建文本消息
            msg.set({
                msg: /*_this.parseEmoji(*/_this.input,//),                  // 消息内容
                to: _this.curCusHxAccount,//'xc',        // 接收消息对象（用户id）
                roomType: false,
                success: function (id, serverMsgId) {
                    var time = formatLocalDate(new Date(),"yyyy-MM-dd HH:mm:ss");
                    var parseMsg = _this.parseEmoji(_this.input); //表情解析工具
                    let content = 
                    `<div class="msg-box">
                        <div class="send-time on-send">[${time}] ${_this.userName || _this.hxAccount}</div>
                        <div class="send-msg">
                            <div class="logo"><img src="${_this.props.zxLogo}"/></div>
                            <div class="ivu-poptip-popper" style="will-change: top, left;" x-placement="left-start">
                                <div class="ivu-poptip-content">
                                    <div class="ivu-poptip-arrow"></div> <!----> 
                                    <div class="ivu-poptip-inner">
                                        <div class="ivu-poptip-body">
                                            <div class="ivu-poptip-body-content">
                                                <div class="ivu-poptip-body-content-inner">${parseMsg}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        
                    </div>`
                    
                    //_this.output += content;
                    _this.props.sessionHistory += content;
                    _this.$nextTick(function(){
                        let o = document.getElementById("chat-output");
                        _this.input = '';
                        
                        _this.bottomScroll(o);
                    })
                },
                fail: function(e){
                    console.log("Send private text error");
                    _this.$Message.error(e || '发送消息失败');
                },
                ext:{
                    conversType : '1',
                    msgSource : '3',
                    sessionId : _this.curSessionId + '',
                    tenantId : _this.curTenantId + ''
                }
            });
            msg.body.chatType = 'txt';//'singleChat';
            this.$IM.methods.sendPrivateText(msg);
        },
        /**发送消息 */
        send(){
            this.sendText();
        },
        /**查询会话列表 */
        getSessionByUser(message){
            this.$emit("getSessionByUser", message);
        },
        /**保存会话标签和备注 */
        submitSessionTag(){
            if(isNull(this.selectedTag[0]) || isNull(this.selectedTag[0].children[0])){
                this.$Message.warning('标签内容不能为空');
                return false;
            }
            let config = {
                data: {
                    busiId: this.curSessionId,
                    sessionTagId: this.selectedTag[0].children[0].busiId,
                    parentSessionTagId: this.selectedTag[0].busiId,
                    sessionRemark: this.remarkText
                },
                headers: Headers.json
            };
            systemconfigApi.submitSessionTag(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('添加会话标签成功');
                    this.endSession = false;
                }else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        }
    },
    created(){
        this.getEmojiList();
    },
    mounted() {
        var _this = this;
        _this.selectedTag.splice(0,_this.selectedTag.length);
        /**环信事件监听 */
        this.$IM.conn.listen({
            //收到文本消息
            onTextMessage: function (message) {
                console.log('收到文本信息message=>', message); 
                _this.getSessionByUser(message);
                var innerHtml = '';
                var time = formatLocalDate(new Date(),"yyyy-MM-dd HH:mm:ss");
                if(message.ext && message.ext.message_attr_is_commodity){
                    innerHtml = `<a href="${message.ext.message_attr_commodity_url}" target="_blank" style="display:inline-block;">
                                    <img src="${message.ext.message_attr_commodity_img_url}" style="width:32px;height:32px;">
                                    <h3>${message.ext.message_attr_commodity_name}</h3>
                                    <div>价格: ${message.ext.message_attr_commodity_price}</div>
                                </a>`
                }
                else{
                    innerHtml = _this.parseEmoji(message.data);
                }
                let content = 
                    `<div class="msg-box">
                        <div class="send-time on-send receive">[${time}] ${_this.props.cusNickName || message.from}</div>
                        <div class="send-msg">
                            <div class="logo receive"><img src="${_this.props.logo}"/></div>
                            <div class="ivu-poptip-popper receive" style="will-change: top, left;" x-placement="right-start">
                                <div class="ivu-poptip-content">
                                    <div class="ivu-poptip-arrow"></div> <!----> 
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
                if(_this.curCusHxAccount == message.from){
                     _this.props.sessionHistory += content;
                }   
                //_this.output += content;
                _this.$nextTick(function(){
                    let o = document.getElementById("chat-output");
                    _this.bottomScroll(o);
                })
            },
            onOpened: function ( message ) {          //连接成功回调
                // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
                // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
                // 则无需调用conn.setPresence();  
                console.log('连接打开=>', message)           
            },  
            onEmojiMessage: function ( message ) {
                // 当为WebIM添加了Emoji属性后，若发送的消息含WebIM.Emoji里特定的字符串，connection就会自动将
                // 这些字符串和其它文字按顺序组合成一个数组，每一个数组元素的结构为{type: 'emoji(或者txt)', data:''}
                // 当type='emoji'时，data表示表情图像的路径，当type='txt'时，data表示文本消息
                console.log('Emoji message %o',message);
                _this.getSessionByUser(message);
                var innerHtml = '';
                var time = formatLocalDate(new Date(),"yyyy-MM-dd HH:mm:ss");
                var data = message.data;
                for(var i = 0 , l = data.length ; i < l ; i++){
                    if(data[i].type == 'emoji'){
                        innerHtml += `<img class="emoji" src="${data[i].data}" />`
                    }
                    else if(data[i].type == 'txt'){
                        innerHtml += data[i].data;
                    }else{
                        innerHtml += '';
                    }
                }
                let content = 
                    `<div class="msg-box">
                        <div class="send-time on-send receive">[${time}] ${_this.props.cusNickName || message.from}</div>
                        <div class="send-msg">
                            <div class="logo receive"><img src="${_this.props.logo}"/></div>
                            <div class="ivu-poptip-popper receive" style="will-change: top, left;" x-placement="right-start">
                                <div class="ivu-poptip-content">
                                    <div class="ivu-poptip-arrow"></div> <!----> 
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
                if(_this.curCusHxAccount == message.from){
                     _this.props.sessionHistory += content;
                } 
                _this.$nextTick(function(){
                    let o = document.getElementById("chat-output");
                    _this.bottomScroll(o);
                })
                
            },   //收到表情消息
            onCmdMessage: function ( message ) {
                console.log("透传消息%m", message);
                if(message){
                    _this.getSessionByUser(message);
                }
            },     //收到命令消息
            onDeliveredMessage: function(message){/**已送达回执的回调函数 */
            },     
            onReadMessage: function(message){/**收到已送达回执的回调函数 */
            }
        });
        
        if(this.sessionHistory){
            this.sessionHistory.map((i,x) =>{
                var innerHtml,from = i.msgSender,to = i.msgReceiver,message = JSON.parse(i.msgContent);
                var time = formatLocalDate(new Date(i.msgSendTime),"yyyy-MM-dd HH:mm:ss");
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
                        <div class="send-time on-send receive">[${time}] ${from}</div>
                        <div class="send-msg">
                            <div class="logo receive"><img src="${_this.props.logo}"/></div>
                            <div class="ivu-poptip-popper receive" style="will-change: top, left;" x-placement="right-start">
                                <div class="ivu-poptip-content">
                                    <div class="ivu-poptip-arrow"></div> <!----> 
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
                _this.output += content;
            });
        }
        this.querySessionTag('root');
        this.querySessionTag('child');
    }
}
</script>
<style lang="less" scoped>
.search{
    margin-bottom: 10px;
}
.kf-list{
    min-height: 100px;
    max-height: 200px;
    
    .kf-item{
        height: 48px;
        line-height: 48px;
        margin: 0px 0px 10px 0px;
        border: 1px solid #EBEDF0;
        border-radius: 5px;
        cursor: pointer;
        padding-left: 20px;
    }
    .kf-item.selected{
        background-color: #f0faf6;
        color: #13C27C;
    }
}
.session-right{
    border: 1px solid #EBEDF0;
    border-left: none;
    color: #142921;
    .cursor{
        cursor: pointer;
    }
    .right-layout{
        .chatter-info{
            border-left: 1px solid #EBEDF0;
            min-height: 675px;
        }
        .chat-top{
            height:60px;
            line-height:60px;
            border-bottom:1px solid #EBEDF0;
            background:rgba(250,250,252,1);
            overflow: hidden;
        }
        .chat-body{
            background-color: white;
            .chat-box{
                min-height: 1px;
                .customer-info{
                    width: 100%;
                    background-color: rgba(255,255,255,0.5);
                    border-bottom: 1px solid #e8e7eb;
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    
                    z-index: 7;
                    .info-item{
                        text-align: left;
                        font-size: 10px;
                        height: 22px;
                        line-height: 22px;
                        .title{
                            color: #424242;
                            font-weight: bold;
                            padding-left:20px;
                        }
                    }
                    .text-btn{
                        color:#13C27C;
                        font-size:12px;
                        cursor:pointer;
                        -moz-user-select:none;/*火狐*/
                        -webkit-user-select:none;/*webkit浏览器*/
                        -ms-user-select:none;/*IE10*/
                        -khtml-user-select:none;/*早期浏览器*/
                        user-select:none;
                        width: 100%;
                    }
                }

                .chat-output{
                    padding-top: 48px;
                    background-color: #f6f7fa;
                    min-height: 400px;
                    max-height: 400px;
                    overflow-y: scroll;
                    overflow-x: hidden;
                }
                .chat-input{
                    .input-btn{
                        height: 32px;
                        line-height: 32px;
                        border-bottom: 1px solid #EBEDF0;
                        .emoji-pop{
                            position: absolute;
                            height: 270px;
                            width: 420px;
                            top: -280px;
                            left: -10px;
                            z-index: 1061;
                            box-shadow:rgba(0, 0, 0, 0.2) 0px 1px 6px 0px;
                            
                            .emoji-list{
                                background-color: white;
                                width: 100%;
                                overflow-y: scroll;
                                height: 270px;
                                border-radius: 5px;
                                text-align: left;
                                padding: 10px;
                                .emoji-btn{
                                    border: none;
                                    background-color: white;
                                    width: 24px;
                                    height: 24px;
                                    margin-right:10px;
                                    .emoji{
                                        width: 24px;
                                        height: 24px;
                                        cursor: pointer;
                                    }
                                }
                                
                            }
                            
                        }
                        .emoji-pop:before{
                                content: "";
                                position: absolute;
                                bottom: -10px;
                                left: 35px;
                                width: 0;
                                height: 0;
                                border-top: 10px solid #fff;
                                border-right: 10px solid transparent;
                                border-left: 10px solid transparent;
                            }
                    }
                    .input-wrapper{
                        margin: 0px 20px;
                    }
                    .submit-btn{
                        text-align: right;
                        padding-right: 20px;
                    }
                }
            }
        }
    }
    
}
.tag-list{
    background-color: #f5f7fa;
    padding: 5px;
    .tag{
        height: 32px;
        line-height: 32px;
        background-color: white;
        border-radius: 5px;
        margin-bottom: 10px;
        text-align: left;
        padding-left: 10px;
        cursor: pointer;
        .tag-color{
            border-radius:50%;
            width:18px;
            height:18px;
            background-color: blue;
            margin: 7px;
        }
    }
    
}
</style>
<style lang="less">
.tabs2{
    background-color:#FAFAFC;
    .ivu-tabs-tab{
        height: 60px;
        line-height: 60px;
        padding: 0px 16px;
        width: 50%;
        text-align: center;
    }
}
.tabs{
    .nav-text.ivu-tabs-nav{
        width: 100%;
    }
    .ivu-tabs-bar{
        background-color:#FAFAFC;
        height: 60px;
        line-height: 60px;
        .ivu-tabs-tab{
            height: 61px;
            line-height: 60px;
            padding: 0px 16px;
            /* width: 50%; */
            width: 100%;
            text-align: center;
        }
    }
    
}

.input-wrapper{
    .input-area{
        .ivu-input{
            border: 1px solid white;
        }
        .ivu-input:focus{
            box-shadow: none;
        }
    }
}
.msg-box::after,.send-time::after,.send-msg::after,
.logo::after,.ivu-poptip-popper::after,
.ivu-poptip-body-content-inner::after,.clear{
    clear: both;
    content: '';
}
.msg-box{
    position: relative;
    .send-time{
        color: #88898d;
        font-size: 12px;
        text-align: right;
        padding-right: 10px;
        margin-top: 20px;
    }
    .send-time.receive{
        text-align: left;
        padding-left: 10px;
    }
    .send-msg{
        color: #050505;
        font-size: 14px;
        text-align: left;
        padding-left: 10px;
        word-wrap:break-word ;
        position: relative;
        .logo{
            position: relative;
            img{
                position: absolute;
                width: 32px;
                height: 32px;
                top: 10px;
                right: 10px;
                border-radius: 50%;
            }
            img::after{
                clear: both;
                content: '';
            }
        }
        .logo.receive{
            img{
                position: absolute;
                width: 32px;
                height: 32px;
                top: 10px;
                left: 10px;
                border-radius: 50%;
            }
            img::after{
                clear: both;
                content: '';
            }
        }
        .ivu-poptip-popper{
            position: relative;
            max-width: 560px;
            width: auto;
            height: auto;
            z-index: 6;
            margin-right: 40px;
            float: right;
            margin-top:20px;
            margin-bottom: 20px;
            .ivu-poptip-body-content-inner{
                white-space: normal;
            }
        }
        .ivu-poptip-popper.receive{
            left: 52px;
            margin-left: 0px;
            margin-top:10px;
            float: left;
        }
    }
}
.on-send{
    text-align: right;
    padding-right: 15px;
}
</style>