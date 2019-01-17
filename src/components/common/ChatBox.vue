<template>
    <Row class="wrapper">
        <Row :class="{'chat-box': true ,'minite-box': minus }" @click.native="evtProxy">
            <Row class="header" @click.native="maximize">
                <Row class="logo" @click.ctrl.native="showMenu">
                    <!-- <img class="zxlogo" :src="zxLogo" /> -->
                    <Icon class="zxlogo" type="social-whatsapp-outline" size="40"></Icon>
                    <Modal v-model="showMenuModal" title="xmpp登录">
                        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline :label-width="120">
                            <FormItem prop="user" label="From">
                                <Input type="text" v-model="formInline.user" placeholder="Username">
                                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="password" label="Password">
                                <Input type="password" v-model="formInline.password" placeholder="Password">
                                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="to" label="To">
                                <Input type="text" v-model="formInline.to" placeholder="To">
                                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                        </Form>
                        <div slot="footer">
                            <Button type="primary" size="large" @click="manualConnetc">确定</Button>
                        </div>
                    </Modal>
                </Row>
                <section class="title" :title="title">{{title}}</section>
                <section class="btns">
                    <Icon v-show="!minus" type="minus" class="cursor" size="16" @click.native.stop="minimize"></Icon>
                </section>
            </Row>
            <div class="content">
                <Row class="output" id="output">
                    <Row v-for="(i,x) in chatLog" class="msg-box" :key="x">
                        <section :class="i.type + '-time on-send'">[{{i.timeStamp}}] {{i.from}}</section>
                        <section :class="i.type + '-msg'">
                            <section class="logo"><img :src="i.logo"/></section>
                            <section class="ivu-poptip-popper" style="will-change: top, left;" :x-placement="i.type=='send'?'left-start':'right-start'">
                                <section class="ivu-poptip-content">
                                    <section class="ivu-poptip-arrow"></section>
                                    <section class="ivu-poptip-inner">
                                        <section class="ivu-poptip-body">
                                            <section class="ivu-poptip-body-content">
                                                <section class="ivu-poptip-body-content-inner">
                                                    <img :src="i.content" v-if="i.msgType=='img'" />
                                                    <Row v-html="i.content" v-else ></Row>
                                                </section>
                                            </section>
                                        </section>
                                    </section>
                                </section>
                            </section>
                            <section class="clear"></section>
                        </section>
                    </Row>
                </Row>
                <Row class="input">
                    <Row class="input-btn">
                        <section class="btn-item">
                            <Icon type="happy-outline" class="cursor" size="16" @click.native="showEmoji"></Icon>
                            <section class="emoji-pop" v-show="emojiModal">
                                <Row class="emoji-list">
                                    <button @click="getEmoji(item)" v-for="(item,index) in emojiList" :key="index" class="emoji-btn">
                                        <img :src="item.src" class="emoji"/>
                                    </button>
                                </Row>
                            </section>
                        </section>
                        <section class="btn-item">
                            <Upload action="/sys/tenant/uploadTenantImg" :show-upload-list="FALSE" 
                                :on-success="uploadSucc" :on-error="uploadErr" :before-upload="beforeUpload" :on-progress="progress"
                                accept="jpg,jpeg,png" :format="['jpg','jpeg','png']" :max-size="maxSize">
                                <Icon type="ios-folder-outline" class="cursor" size="16" @click.native="uploadImg"></Icon>
                            </Upload>
                        </section>
                    </Row>

                    <Row class="input-wrapper">
                        <Input type="textarea" v-model="input" class="input-area" placeholder="请输入..." 
                            @keyup.native.enter="send" @oninput="inputChange"
                            :autosize="{minRows: 2,maxRows: 28}"></Input>
                    </Row>

                    <Row class="submit-btn">
                        <Button type="primary" @click="send">发送</Button>
                    </Row>
                </Row>
            </div>
            <div class="footer"></div>
        </Row>
    </Row>
</template>
<script>
import { formatDate, trim, Base64, generateId } from '../../utils'
import { emojiCode, emojiMap } from './Consts'
import xmpp from '../../xmpp'
import { Strophe } from 'strophe.js';
import * as baseEnvConfig from '../../../config/envConfig';
export default {
    name: 'ChatBox',
    props: ['data'],
    data(){
        return {
            receiver: '',
            sender: '',
            showMenuModal: false,
            ruleInline: {
                user: [
                    { required: true, message: 'Please fill in the user name', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please fill in the password.', trigger: 'blur' },
                    { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
                ],
                to: [
                    { required: true, message: 'Please fill in the receiver.', trigger: 'blur' },
                    { type: 'string', min: 6, message: 'The receiver length cannot be less than 6 bits', trigger: 'blur' }
                ]
            },
            formInline: {
                user: '',
                password: '',
                to: ''
            },
            chatType: 'chat',//默认单聊
            msgType: 'text',//默认文本消息
            connected: false,//默认断开连接
            connection: null,//默认连接为null
            curMsgId: '',
			chatLog: [
                // {
                //     type: 'receive',
                //     msgType: 'img',
                //     timeStamp: '2018-12-12 10:06:45',
                //     from: 'test9@',
                //     to: 'test8@',
                //     content: '../../../static/i/home/1.gif',
                //     logo: '../../../static/i/home/1.jpg',
                // }
            ],
            imgLoading: '../../../static/i/home/1.gif',
            maxSize: 1024,
            FALSE: false,
            uploadProps: {},
            minus: false,
            zxLogo: '../../../static/i/home/1.jpg',
            title: '',
            output: '',
            input: '',
            emojiList: [],
            emojiModal: false
        }
    },
    methods: {
        manualConnetc(){
            this.connection = null;
            this.connection = new Strophe.Connection(xmpp.config.BOSH_SERVICE);
            this.receiver = this.title = this.formInline.to;
            this.sender = this.formInline.user;//xmpp.config.jid可以根据分配算法变化，后续发送消息使用此jid
            this.connection.connect(this.formInline.user, this.formInline.password, this.onListen);
        },
        showMenu(){
            this.showMenuModal = !this.showMenuModal;
            this.formInline.user = xmpp.config.acAccount;
            this.formInline.password = xmpp.config.acPwd;
            this.formInline.to = xmpp.config.acCusAccount;
        },
        /**文件上传失败时的钩子，返回字段为 error, file, fileList */
        uploadErr(error, file, fileList){
            console.log("uploadErr error:%o, file:%o, fileList:%o",error, file, fileList);
            let _this = this;
            if(error.status == '500'){
                _this.$Message.warning(error.message);
                console.log()
                _this.chatLog.map((i,x) =>{
                    if(i.msgId == _this.curMsgId){
                        i.content = require('../../../static/i/home/500.png');
                    }
                })
            }
        },
        /**文件上传成功时的钩子，返回字段为 response, file, fileList */
        uploadSucc(response, file, fileList){
            let _this = this;
            if(response.code == '0'){
                _this.chatLog.map((i,x) =>{
                    if(i.msgId == _this.curMsgId){
                        i.content = response.resultData
                    }
                })
                _this.sendIM(response.resultData, 'chat', 'img');
            }
            else if(response.code == '100008'){
                _this.$router.push({
                    path: '/login'
                })
            }
            else{
                _this.$Message.warning(response.message);
            }
        },
        /**上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传 */
        beforeUpload(file){
            console.log("beforeUpload file:%o", file);
        },
        /**文件上传时的钩子，返回字段为 event, file, fileList */
        progress(event, file, fileList){
            let chat = this.wrapperLocalMsg(this.imgLoading, 'img', 'send');
            
            this.chatLog.push(chat);
            this.$nextTick(function(){
                let o = document.getElementById("output");
                this.bottomScroll(o);
            })
            console.log("progress event:%o, file:%o, fileList:%o",event, file, fileList);
        },
        uploadImg(){
            console.log("uploadImg");
        },
        /**监听IM */
        onListen(status){
            if (status == Strophe.Status.CONNFAIL) {
                console.log("连接失败！");
            } else if (status == Strophe.Status.AUTHFAIL) {
                console.log("登录失败！");
            } else if (status == Strophe.Status.DISCONNECTED) {
                console.log("连接断开！");
                this.connected = false;
            } else if (status == Strophe.Status.CONNECTED) {
                console.log("连接成功！");
                this.showMenuModal = false;
                this.connected = true;
                // 当接收到<message>节，调用onMessage回调函数
                this.connection.addHandler(this.onMessage, null, 'message', null, null, null);
                // 首先要发送一个<presence>给服务器（initial presence）
                this.connection.send($pres().tree());
            }
        },
        /**消息处理 */
        onMessage(msg){
            console.log("onMessage", msg);
            let _this = this;
            // 解析出<message>的from、type属性，以及body\mobilePeidou\mobileChat子元素 获取content属性内容
            this.receiver = msg.getAttribute('from');
            let type = msg.getAttribute('type');
            let elems = msg.getElementsByTagName('body');
            if(process.env.NODE_ENV == 'development'){
                if (type == "chat" && elems.length > 0){
                    let body = elems[0];
                    let content = Strophe.getText(body);
                    let time = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    let zxlogo = require('../../../static/i/home/1.jpg');
                    let chat = _this.wrapperLocalMsg(content, 'text', 'receive');
                    _this.chatLog.push(chat);
                }
            }
            else{
                let mobilePeidou = msg.getElementsByTagName('mobilePeidou');
                let mobileChat = mobilePeidou[0].getElementsByTagName('mobileChat');
                
                let mobileChatContent = mobileChat[0].getAttribute('content');
                let msgType = mobileChat[0].getAttribute('msgType');
                if(mobileChatContent)
                {
                    if(type == "received"){ //回执类型
                        return true;
                    }

                    if (type == "chat" && elems.length > 0){
                        let time = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
                        
                        let zxlogo = require('../../../static/i/home/1.jpg');
                        // _this.output += receiveMessageTpl(time, from, zxlogo, mobileChatContent);
                        let chat = _this.wrapperLocalMsg(mobileChatContent, msgType, 'receive');
                        _this.chatLog.push(chat);
                    }
                }
                else{
                    console.log("onMessage-6");
                }
            }
            
        },
        /**滚动到底部 */
        bottomScroll(o){
            if(o){
                o.scrollTop = o.scrollHeight + 500;
            }
        },
        /**包装本地消息
         * @param msg:消息内容
         * @param msgType:消息类型
         * @param sor:发送或接收
         */
        wrapperLocalMsg(msg, msgType, sor='send'){
            this.curMsgId = generateId(6);
            return {
                msgId: this.curMsgId,
                type: sor,//本地消息自定义类型send：发送出去的消息；receive：接收到的消息
                msgType: msgType,
                timeStamp: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                from: sor=='send'?this.sender:this.receiver,
                content: msg,
                logo: '../../../static/i/home/1.jpg',
            }
        },
        /**发消息 */
        sendIM(){
            let _this = this;
            if(_this.connected) {
                // 创建一个<message>元素并发送
                this.sender = this.formInline.user;
                if(process.env.NODE_ENV == 'development'){
                    var msg = $msg({
                        to: this.receiver, 
                        from: this.sender, 
                        type: 'chat',
                    }).cnode(Strophe.xmlElement("body", null, _this.input));
                    _this.connection.send(msg.tree());
                    
                }
                else{
                    var IM = $msg({
                        to: this.receiver, 
                        from: this.sender, 
                        type: _this.chatType,
                        xmlns: 'peidou',
                        msgId: generateId(6)
                    }).c("body", null, 'chat-msg')
                        .c("mobilePeidou",null,)
                        .c("mobileChat", { msgtype: _this.msgType,content: Base64.encode(_this.input) }, '');
                    _this.connection.send(IM.tree());
                }
                if(_this.msgType != 'img'){
                    _this.input = _this.parseEmoji(_this.input);//（如果有表情）解析表情
                    let chat = _this.wrapperLocalMsg(_this.input, _this.msgType, 'send');
                    _this.chatLog.push(chat);
                }
                setTimeout(function(){
                    let o = document.getElementById("output");
                    _this.bottomScroll(o);
                },200)
                
            } else {
                this.$Message.warning('sendIM -> 请先登录!');
            }
        },
        /**自动连接im */
        autoConnect(){
            if(!this.connected) {
                this.connection = new Strophe.Connection(xmpp.config.BOSH_SERVICE);
                xmpp.config.jid = xmpp.config.acAccount;//xmpp.config.jid可以根据分配算法变化，后续发送消息使用此jid
                this.title = xmpp.config.acCusAccount;
                this.connection.connect(xmpp.config.acAccount, xmpp.config.acPwd, this.onListen);
            }
        },
        /**最大化会话框 */
        maximize(){
            if(this.minus){
                this.minus = !this.minus;
            }
        },
        /**最小化会话框 */
        minimize(){
            this.minus = true;
        },
        /**发送消息 */
        send(){
            let _this = this;
            if(trim(_this.input) != ''){
                _this.sendIM();
                _this.input = '';
            }
        },
        /**输入框校验 */
        inputChange(){},
        /**解析emoji */
        parseEmoji(msg){
            for (var face in emojiMap.map) {
                if (emojiMap.map.hasOwnProperty(face)) {
                    while (msg.indexOf(face) > -1) {
                        let staticPath = emojiMap.path + emojiMap.map[face];
                        msg = msg.replace(face, '<img class="emoji" src="' + staticPath + '" />');
                    }
                }
            }
            return msg;
        },
        /**emoji窗体事件代理 */
        evtProxy(e){
            if(e.target.className == 'emoji-list ivu-row' || e.target.className == 'emoji-pop'
                || e.target.nodeName == 'I'|| e.target.nodeName == 'IMG'){
                return;
            }else{
                this.emojiModal = false;
            }
        },
        /**显示-隐藏emoji窗体 */
        showEmoji(){
            this.emojiModal = !this.emojiModal;
        },
        /**获取emoji图片 */
        getEmojiList(){
            this.emojiList.splice(0,this.emojiList.length);
            for(let i=1; i<98; i++){
                let emoji = {
                    src: '../../../static/emoji/' + i + '.png',
                    id: i,
                    text: emojiCode[i-1]
                }
                this.emojiList.push(emoji);
            }
        },
        getEmoji(emoji){
            this.input += emoji.text;
        }
    },
    mounted(){
        this.getEmojiList();
    }
}
</script>
<style lang="less">
.wrapper{
    .chat-box{
        .btns {
            .ivu-icon{
                padding: 5px 10px;
                border-radius: 4px;
                &:hover{
                    background-color: #13A36A;
                }
            }
        }
        
        textarea{
            border: none;
            outline: 0;
            min-height: 80px;
        }
        .ivu-input:hover,.ivu-input:focus{
            border-color: white;
            box-shadow: none;
        }

        .msg-box::after,.send-time::after,.send-msg::after,
        .logo::after,.ivu-poptip-popper::after,
        .ivu-poptip-body-content-inner::after,.clear{
            clear: both;
            content: '';
        }
        .msg-box{
            position: relative;
            .ivu-poptip-popper{
                .ivu-poptip-inner{
                    max-width: 252px;
                }
                img{
                    max-width: 220px;
                }
            }
            .send-time{
                color: #88898d;
                font-size: 12px;
                text-align: right;
                padding-right: 10px;
                margin-top: 20px;
            }
            .receive-time{
                color: #88898d;
                font-size: 12px;
                text-align: left;
                padding-left: 10px;
                margin-top: 20px;
            }
            .send-msg{
                color: #050505;
                font-size: 14px;
                text-align: left;
                padding-left: 10px;
                word-wrap:break-word ;
                position: relative;
                .logo{
                    margin-top: 5px;
                    width: 32px;
                    height: 32px;
                    float: right;
                    margin-right: 10px;
                    img{
                        width: 32px;
                        height: 32px;
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
                        left: 0px;
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
                    margin: 10px 0px;
                    float: right;
                    .ivu-poptip-body-content-inner{
                        white-space: normal;
                    }
                }
            }

            .receive-msg{
                color: #050505;
                font-size: 14px;
                text-align: left;
                padding-left: 10px;
                word-wrap: break-word ;
                position: relative;
                
                .logo{
                    margin-top: 5px;
                    width: 32px;
                    height: 32px;
                    float: left;
                    img{
                        width: 32px;
                        height: 32px;
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
                    float: left;
                    margin-left: 5px;
                    margin-top: 5px;
                    margin-bottom: 10px;
                    .ivu-poptip-body-content-inner{
                        white-space: normal;
                    }
                }
            }
        }
        .on-send{
            text-align: right;
            padding-right: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
<style lang="less" scoped>
.wrapper{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0px;
    .chat-box.minite-box{
        background-color: white;
        position: fixed;
        bottom: 100px;
        right: 10px;
        min-width: 50px;
        max-width: 50px;
        min-height: 50px;
        max-height: 50px;
        overflow: hidden;
        .header{
            cursor: pointer;
        }
    }
    .chat-box{
        display: flex;
        flex-direction: column;
        background-color: white;
        border-radius: 8px;
        box-shadow: rgb(51, 51, 51) 0px 0px 10px;
        flex-flow: column;
        height: 100%;
        .header{
            width: 100%;
            height: 50px;
            cursor: move;
            background-color: #13C27C;
            color: white;
            border-radius: 8px 8px 0px 0px;
            .logo{
                width: 50px;
                height: 50px;
                line-height: 50px;
                float: left;
                text-align: center;
                .zxlogo{
                    width: 40px;
                    height: 40px;
                    margin-top: 5px;
                    border-radius: 50%;
                }
            }
            
            .title{
                max-width: 240px;
                font-size: 18px;
                float: left;
                height: 50px;
                line-height: 50px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .btns{
                float: right;
                height: 50px;
                line-height: 50px;
                width: 50px;
                text-align: center;
                cursor: pointer;
            }
        }

        .content{
            flex: 1;
            display: flex;
            flex-direction: column;
            .output{
                flex: 2;
                padding-top: 10px;
                background-color: #f6f7fa;
                overflow-y: scroll;
                overflow-x: hidden;
            }

            .input{
                flex: 1;
                display: flex;
                flex-direction: column;
                .input-btn{
                    height: 32px;
                    line-height: 32px;
                    border-bottom: 1px solid #EBEDF0;

                    .btn-item{
                        text-align: center;
                        width: 32px;
                        float: left;
                        i{
                            cursor: pointer;

                            &:hover{
                                color: #42ce96;
                            }
                        }
                    }
                    .emoji-pop{
                        position: absolute;
                        height: 150px;
                        width: 340px;
                        top: -160px;
                        left: 0px;
                        z-index: 1061;
                        box-shadow:rgba(0, 0, 0, 0.2) 0px 1px 6px 0px;
                        
                        .emoji-list{
                            background-color: white;
                            width: 100%;
                            overflow: hidden;
                            overflow-y: auto;
                            white-space: normal;
                            height: 150px;
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
                        left: 10px;
                        width: 0;
                        height: 0;
                        border-top: 10px solid #fff;
                        border-right: 10px solid transparent;
                        border-left: 10px solid transparent;
                    }
                    
                }
                .input-wrapper{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    .input-area{
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        
                    }
                    
                }
                .submit-btn{
                    align-self: flex-end;
                    margin: 0px 10px 10px 0px;
                }
            }
        }

        .footer{
        }
    }
}
</style>