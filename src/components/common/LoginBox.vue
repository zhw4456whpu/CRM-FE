<template>
    <div class="login-form">
        <Row class="login-account">
            <Input v-model="userName" :autofocus="afocus" icon="android-person" placeholder="邮箱/手机/用户名"></Input>
        </Row>
        <Row class="login-pwd">
            <Input v-model="curPwd" icon="android-lock" type="password" placeholder="请输入密码"></Input>
        </Row>
        <Row class="login-links">
            <Col span="12" class="remmber-pwd">
                <Checkbox v-model="remember">记住密码</Checkbox>
            </Col>
            <Col span="12" class="forget-pwd">
                <a v-model="forget">忘记密码</a>
            </Col>
        </Row>
        <Row class="login-btn">
            <Button type="primary" @click="login">登陆</Button>
        </Row>
        <Row class="register">
            <a>注册</a>
        </Row>
    </div>
</template>
<script>
import crypto from 'crypto';
import loginApi from '../../service/loginApi';
import { mapState, mapActions, mapMutations } from 'vuex'
export default{
    name:'loginBox',
    data(){
        return {
            remember:'',
            forget:'',
            afocus:true,
        }
    },
    computed: {
        userName: {
            get(){
                return this.$store.state.userName;
            },
            set(val){
                this.$store.dispatch('setUserName', val);
            }
        },
        curPwd: {
            get(){
                return this.$store.state.password;
            },
            set(val){
                this.$store.dispatch('setPassword', val);
            }
        },
        accessToken: {
            get(){
                return this.$store.state.accessToken;
            },
            set(val){
                this.$store.dispatch('setAccessToken', val);
            }
        }
    },
    methods:{
        //登陆后跳转
        gotoPage(){
            this.$router.push(
                {
                    name:'Index',
                }
            )
        },
        //登陆
        login(){
            this.gotoPage();
            /*
            var _this = this;
            this.$IM.methods.login(_this.userName, _this.curPwd, '', function(token){
                _this.$store.dispatch('setConnContext', token);
                _this.gotoPage();
            }, function(err){
                _this.$Message.error(err);
                _this.gotoPage();
            });
            //业务逻辑：加密、跳转、权限
            /*
            let userName = this.userName;
            let userPwd = this.curPwd;
            var md5 = crypto.createHash('md5');
            userName = md5.update(userName).digest('hex');
            var md = crypto.createHash('md5');
            userPwd = md.update(userPwd).digest('hex');
            if(userName == '21232f297a57a5a743894a0e4a801fc3' && userPwd == 'e10adc3949ba59abbe56e057f20f883e' 
                || userName == '63a9f0ea7bb98050796b649e85481845' && userPwd == 'f379eaf3c831b04de153469d1bec345e'
                || userName == '232059cb5361a9336ccf1b8c2ba7657a' && userPwd =='bada256fc800d8de50e51da5c1db2a3f'){
                let config = {},_this = this;
                loginApi.login(config).then(res =>{
                    if(res.status =='200' || res.status == '304'){
                        localStorage.removeItem("userInfo");
                        localStorage.setItem('userInfo',JSON.stringify(res.data));
                        this.$store.dispatch('setUserName', _this.userName);
                        
                        this.gotoPage(res);
                    }
                }, error =>{
                    
                });
            }
            else
            {
                this.$Message.error("用户名或密码错误")
            }*/

        }
    },
    comments:{
        crypto:crypto,
    }
}    
</script>