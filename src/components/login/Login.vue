<template>
    <div class="login">
        <Form ref="formValidate" :model="loginForm" :rules="ruleValidate">
            <Row type="flex" justify="center" align="middle" class="login-layout">
                <Row class="login-box">
                    <Row class="title">胚豆编码规范管理</Row>
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

export default {
    name: 'Login',
    data(){
        return {
            remember: false,
            loginForm: {
                userName: '',
                curPwd: '',
                validCode: ''
            },           
            ruleValidate: {
                userName: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
                curPwd: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
                validCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            },              
        }
    },
    computed: {
        userName: {
            get(){
                return this.$store.state.userName;
            },
            set(val){
                this.$store.dispatch('setUserName', val)
            }
        },
        accessToken: {
            get(){
                return this.$store.state.accessToken;
            },
            set() {
                this.$store.dispatch('setAccessToken', val);
            }
        }
    },
    methods:{
        /**登录 */
        login(){
            var mdPwd = crypto.createHash('md5');
            var encodePwd = mdPwd.update(this.loginForm.curPwd.toLowerCase()).digest('hex');
            let config = {
                data: {
                    username: this.loginForm.userName,
                    userpsw: this.loginForm.curPwd
                },
                headers: Headers.json
            },_this = this;
            Login.login(config).then(res =>{
                if(res.code == '0'){
                    _this.$Message.info(res.message);
                    _this.$store.dispatch('setAccessToken', res.message);
                    _this.$store.dispatch('setUserName', this.loginForm.userName);
                    _this.$router.push({
                        path: '/contentmanage',

                    })
                }
                else{
                    _this.$Message.warning(res.message || '登录失败！');
                }
            }, err=>{
                _this.$Message.error(err);
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
        
    },
    mounted(){
    }
}
</script>
<style lang="less">
@import url('../../assets/c/login.less');
</style>