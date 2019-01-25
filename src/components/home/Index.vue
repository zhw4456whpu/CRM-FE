<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo">
                        <div class="logo"></div>
                    </div>
                    <div class="layout-nav">
                        <MenuItem v-for="(item,index) in topNav" :name="index+1" @click.native="selected(item,index)" 
                          :class="{'ivu-menu-item-active ivu-menu-item-selected':curTopNav.navIdx == index}" :key="index">
                            <Icon :type="item.icon"></Icon>
                            {{item.cat_name}}
                        </MenuItem>
                    </div>
                    <div class="login-info">
                        <!-- <Tooltip placement="bottom">
                            <Row class="palcemaent">
                                <Badge dot style="margin:0px 10px;">
                                    <Icon type="ios-bell-outline" size="26"></Icon>
                                </Badge>
                            </Row>
                            <div slot="content">
                                <Row class="account-info">
                                    暂无消息
                                </Row>
                            </div>
                        </Tooltip> -->
                        <Tooltip placement="bottom">
                            <Row class="palcemaent">
                                <img v-if="userLogo" :src="userLogo" style="width:32px;height:32px;vertical-align:middle;margin-right:10px;border-radius:50%;" />
                                <Avatar v-else style="background-color: #87d068" icon="person" />
                                <span class="user-name">{{userName}}</span>
                            </Row>
                            <div slot="content">
                                <Row class="account-info modify" @click.native="modifyPwd('popup')">修改密码</Row>
                                <Modal v-model="pwdModal" title="修改密码">
                                    <Row class="pwd-input">
                                        <Input type="password" v-model="srcPwd" placeholder="输入原密码"/>
                                    </Row>
                                    <Row class="pwd-input">
                                        <Input type="password" v-model="rePwd" placeholder="输入修改后密码（6-16位数字或字母）"/>
                                    </Row>
                                    <Row class="pwd-input">
                                        <Input type="password" v-model="reRePwd" placeholder="再次输入修改后密码"/>
                                    </Row>
                                    <div slot="footer">
                                        <Button @click="modifyPwd('save')" type="primary">修改密码</Button>
                                    </div>
                                </Modal>
                                <Row class="account-info" @click.native="logout">退出账户</Row>
                            </div>
                        </Tooltip>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff',width: '300px',maxWidth:'300px',minWidth:'300px'}">
                    <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']" class="slide-menu">
                        <Submenu name="1" v-for="(item,index) in curSubMenus" class="submenu" :key="index">
                            <template v-if="item.children && item.children.length> 0">
                                <template slot="title" >
                                    <Icon :type="item.icon"></Icon>
                                    {{item.name}}
                                </template>
                                <template>
                                    <MenuItem v-for="(sitem,sindex) in item.children" :name="sitem.name" :key="sindex"
                                    @click.native="goto(sitem,sindex)" :class="{'ivu-menu-item-active ivu-menu-item-selected':curSubMenuAddress == item.menuAddress}">{{sitem.name}}</MenuItem>
                                </template>
                            </template>
                            <template v-else>
                                <template slot="title">
                                    <span @click="goto(item,index)" class="submenu-title"
                                        :class="{'ivu-menu-item-active ivu-menu-item-selected':curSubMenuAddress == item.chapter_id}">
                                        <Icon :type="item.icon"></Icon>
                                        {{item.chapter_title}}
                                    </span>
                                </template>
                            </template>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 20px 24px'}">
                    <Content :style="{minHeight: '280px'}" class="lcontent">
                        <router-view />
                        <!-- <Row v-html="curChapterContent"></Row> -->
                    </Content>
                </Layout>
            </Layout>
        </Layout>
        <div class="mask" v-show="showMask"></div>
    </div>
</template>
<script>
import kfApi from '../../service/kfApi';
import {Headers} from '../common/Consts.js';
import crypto from 'crypto';
export default {
    name: 'Index',
    data(){
        return {
            // curChapterContent: '',
            showMask: false,
            srcPwd: '',
            rePwd: '',
            reRePwd: '',
            pwdModal: false,
            curTopNav:{
                navCode: '',
                navIdx: 0
            },
            curSubMenus: [],
            curSubMenuAddress: '',
            topNav: [],
            subMenus: []
        }
    },
    computed: {
        menu :{
            get(){
                return this.$store.state.menu;
            },
            set(val){
                this.$store.dispatch('setMenu', val);
            }
        },
        userLogo(){
            return this.$store.state.userLogo; 
        },
        userName: {
            get(){
                return this.$store.state.userName;
            },
            set(val){
                this.$store.dispatch('setUserName', val)
            }
        },
        password: {
            get(){
                return this.$store.state.password;
            },
            set(val){
                this.$store.dispatch('setPassword', val)
            }
        },
        remember:{
            get(){
                return this.$store.state.remember;
            },
            set(val){
                this.$store.dispatch('setRemember', val);
            }
        }
    },
    methods:{
        /**重置密码 */
        resetPwd(){
            var _this = this;
            var md = crypto.createHash('md5');
            let config = {
                data: {
                    userAccount: _this.userName,
                    userPwd: md.update(_this.rePwd).digest('hex'),
                },
                headers: Headers.json
            }
            kfApi.modifyPwd(config).then(res =>{
                if(res.code == '0'){
                    _this.$Message.info("修改密码成功,2秒后跳转登录");
                    setTimeout(function(){
                        _this.$router.push({
                            path: '/login'
                        });
                    },2000);
                }
                else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            });
        },
        /**修改密码 */
        modifyPwd(type){
            if(type == 'popup'){
                this.pwdModal = true;
            }
            else{
                let reg= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
                if(!reg.test(this.rePwd)){
                    this.$Message.warning("请输入修改后密码（6-16位数字或字母）");
                    return false;
                }
                if(this.rePwd != this.reRePwd){
                    this.$Message.warning("密码和确认密码不一致");
                    return false;
                }
                this.resetPwd();
            }
        },
        /**退出登录 */
        logout(){
            if(!this.remember){
                this.userName = '';
                this.password = '';
            }
            this.$router.push({
                path:'/login'
            })
        },
        //顶级菜单单击事件
        selected(topNav, index){
            this.curTopNav.navCode = topNav.cat_code;
            this.curTopNav.navIdx = index;
            
            this.curSubMenus = this.menu.subMenus.filter((i,x) =>{
                return i.cat_code == this.curTopNav.navCode;
            });
            this.$router.push(
                {
                    path: 'content'
                }
            )
        },
        goto(item,index){
            this.curSubMenuAddress = item.chapter_id;
            this.$router.push(
                {
                    path: 'detail',
                    query: {
                        chapterId: item.chapter_id
                    }
                }
            )
            // this.curChapterContent = item.chapter_content;
        }
    },
    mounted(){
        this.topNav = this.menu.topNav || [];
        this.subMenus = this.menu.subMenus || [];
        this.topNav.map((item,index) =>{
            if(index == 0){
                this.selected(item, index);
            }
        });
        
    }
}
</script>
<style scoped lang="less">
@import url('../../assets/c/index.less');
</style>
<style lang="less">
.pwd-input{
    margin: 10px 20px;
}
.ivu-menu-vertical{
    margin-top: 40px;
    .submenu{
        .ivu-icon-ios-arrow-down:before{
            content: '';
        }
        .submenu-title{
            display: inline-block;
            width: 100%;
            height: 60px;
            line-height: 60px;
            text-align: center;
            font-size: 16px;
        }
    }
    .submenu{
        .ivu-menu-submenu-title{
            padding: 0px;
        }
    }
    
}
.layout{
    .lcontent{
        text-align: left;
        background-color: white;
        padding:20px;
    }
    .ivu-menu-dark.ivu-menu-horizontal .ivu-menu-item:hover{
        color: #13c27c;
    }
}
.mask{
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    background-color: rgba(255,255,255,0.6);
}
</style>