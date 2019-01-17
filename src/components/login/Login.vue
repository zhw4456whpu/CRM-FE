<template>
    <div class="login">
        <Form ref="formValidate" :model="loginForm" :rules="ruleValidate">
            <Row type="flex" justify="center" align="middle" class="login-layout">
                <Row class="login-box">
                    <Row class="title">胚豆运营管理平台</Row>
                    <Row class="login-account">
                        <Form-item prop="userName">
                                <Input v-model="loginForm.userName"   placeholder="请输入商家账号"  @keyup.native.enter="login"></Input>
                        </Form-item>
                    </Row>
                    <Row class="login-pwd">
                        <Form-item prop="curPwd">
                            <Input v-model="loginForm.curPwd"  type="password" placeholder="请输入密码" @keyup.native.enter="login"></Input>
                        </Form-item>
                    </Row>
                    <!-- <Row class="valid-code">
                        <Col span="12">
                            <Form-item prop="validCode">
                                <Input v-model="loginForm.validCode" placeholder="请输入验证码" @keyup.native.enter="login"></Input>
                            </Form-item>
                        </Col>
                        <Col span="12" class="valid-pic" @click.native="getValidCode">
                            <img :src="validPic" />
                        </Col>
                    </Row> -->
                    <Row class="remmber-pwd">
                        <Checkbox v-model="remember">记住密码</Checkbox>
                    </Row>
                    <Row class="login-btn">
                        <Button type="primary" @click="login" >登录</Button>
                    </Row>
                </Row>
            </Row>
        </Form>
    </div>
</template>
<script>
// import loginBox from '../common/LoginBox'
import Login from '../../service/loginApi';
import company from '../../service/companyApi';
import crypto from 'crypto';
import {Headers, Warning} from '../common/Consts.js'
import * as menuConfig from '../../../config/menu.config.js'
import ChatBox from '../common/ChatBox'
export default {
    name:'login',
    components: {
        ChatBox
    },
    computed: {
        allSensitiveWords: {
            get(){
                return this.$store.state.allSensitiveWords;
            },
            set(val){
                this.$store.dispatch('setAllSensitiveWords', val);
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
        userId: {
            get(){
                return this.$store.state.userId;
            },
            set(val){
                this.$store.dispatch('setUserId', val);
            }
        },
        menu :{
            get(){
                return this.$store.state.menu;
            },
            set(val){
                this.$store.dispatch('setMenu', val);
            }
        },
        remember:{
            get(){
                return this.$store.state.remember;
            },
            set(val){
                this.$store.dispatch('setRemember', val);
            }
        },
        un(){
            return this.$store.state.userName; 
        },
        pd(){
            return this.$store.state.password; 
        },
    },
    data(){
        return {
            worker: null,
            validPic: '',
            loginForm: {
                userName: '',
                curPwd: '',
                validCode: ''
            },           
            ruleValidate: {
                userName: [{ required: true, message: '请输入商家账号', trigger: 'blur' }],
                curPwd: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
                validCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            },              
        }
    },
    methods:{
        runWebWork(){
            let _this = this;
            this.worker = this.$worker.run((fn) =>{
                fn && fn();
            }, [_this.querySensitiveWordListForPage()])
                .then(res => { console.log(_this.allSensitiveWords);})
                .catch(e => {
                    this.worker = null;
                })
        },
        /**获取所有敏感词 */
        querySensitiveWordListForPage(){
            let _this = this;
            
            let config = {
                data: {},
                headers: Headers.urlencoded
            }            
            company.querySensitiveWordListForPage(config).then(res =>{
                if(res.code == '0'){
                    let sensitiveWord = res.resultData.list.map((i,x) =>{
                        sensitiveWord = i.sensitiveWord;
                        _this.allSensitiveWords.push(sensitiveWord);
                    });
                } else{
                    _this.$Message.warning(res.message);
                }
            },err => {
                _this.$Message.error(err);
            })
        },
        /**获取登陆人员所服务的租户信息 */
        getServedTenant(){
            let config = {
                headers: Headers.json
            };
            Login.getServedTenant(config).then( res =>{
                if(res.code == '0'){
                    this.servedTenant = res.resultData;
                    this.$router.push(
                        {
                            name: "KFPlatform"
                        }
                    )
                }
                else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })
        },
        /**登录 */
        login(){
            let config = {
                data: {
                    username: this.loginForm.userName,
                    userpsw: this.loginForm.curPwd
                },
                headers: Headers.json
            }
            Login.login(config).then(res =>{
                console.log("login res:%o",res);
            })
        },
        //设置cookie
        setCookie(c_name, c_pwd, exdays) {
            var exdate = new Date(); //获取时间
            exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
            //字符串拼接cookie
            window.document.cookie = "userAccount" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
            window.document.cookie = "curPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
        }, 
        //读取cookie
        getCookie: function() {
            if (document.cookie.length > 0) {
                var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
                for (var i = 2; i < arr.length; i++) {
                    var arr3 = arr[i].split('='); //再次切割
                    //判断查找相对应的值
                    if (arr3[0] == 'userName') {
                        this.username = arr3[1]; //保存到保存数据的地方
                    } else if (arr3[1] == 'curPwd') {
                        this.curPwd = arr3[1];
                    }
                }
            }
        }, 
        //清除cookie
        clearCookie: function() {
            this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
        },                      
        /**获取验证码 */
        getValidCode(){
            let config = {
                headers: Headers.json
            };
            Login.getValidCode(config).then(res =>{
                if(res.code == '0'){
                    this.validPic = `data:image/png;base64,${res.resultData }`
                }else{
                    this.$Message.error(res.message || res.resultData);
                }
            }, err=>{
                this.$Message.error(err);
            })
        }
    },
    mounted(){
        this.loginForm.userName = this.un;
        this.loginForm.curPwd = this.pd;
        this.getValidCode();
        this.getCookie();
        this.allSensitiveWords = [];
    }
}
</script>
<style lang="less">
@import url('../../assets/c/login.less');
</style>