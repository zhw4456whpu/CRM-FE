<template>
    <div class="layout">
        <Layout>
            <Header>
                <Row class="header">
                    <section class="logo">
                        <section class="avater">
                            <Icon type="social-twitch-outline" size=36></Icon>
                        </section>
                        <section class="title">前端编码规范</section>
                    </section>
                    <section class="msg-status">
                        <Row class="logout" @click.native="login" v-if="accessToken">
                            <img :src="loginImg" />
                        </Row>
                        <Row class="logout" @click.native="login" v-else="!accessToken">
                            <img :src="loginImg" />
                        </Row>
                        <section class="user-login" v-show="accessToken">
                            <Button type="primary" @click="addChapter" icon="edit">去发布</Button>
                        </section>
                        <!-- <section class="spliter-line"></section>
                        <section class="status">
                            <Icon type="ios-person" size=24></Icon>
                            <section class="status-text">在线</section>
                        </section>
                        <section class="unread-msg">
                            <Tooltip placement="bottom" transfer>
                                <Row class="palcemaent">
                                    <Badge dot>
                                        <Icon type="android-volume-up" size=24></Icon>
                                    </Badge>
                                </Row>
                                <div slot="content">
                                    <Row class="account-info">
                                        暂无消息
                                    </Row>
                                </div>
                            </Tooltip>
                        </section> -->
                    </section>
                </Row>
            </Header>
            <Layout :style="{minHeight: '100vh'}">
                <Sider collapsible :collapsed-width="60" v-model="isCollapsed" :style="!isCollapsed?'width:240px;max-width:240px;min-width:240px;':''">
                    <Menu :active-name="activeName" theme="light" width="auto" :open-names="openNames" ref="omsMenu">
                        <Submenu :name="item.cat_code" v-for="(item,index) in topNav" :key="index"
                             class="submenu" 
                             :style="isCollapsed?'text-overflow:ellipsis;white-space:nowrap;overflow:hidden;':''">
                            <template slot="title" >
                                <Row class="submenu-title" @click.native="selected(item,index)" 
                                    :style="isCollapsed?'text-overflow:ellipsis;white-space:nowrap;overflow:hidden;':''">
                                    <Icon :type="menuIcons[item.cat_code]?menuIcons[item.cat_code]:'ionic'"></Icon>
                                    {{isCollapsed?'':item.cat_name}}
                                </Row>
                            </template>
                            <MenuItem :name="sitem.chapter_id" v-for="(sitem,sindex) in item.children" 
                                @click.native="goto(sitem,sindex)" :key="sindex">
                                {{isCollapsed?'':sitem.chapter_title}}
                            </MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 0px 20px'}">
                    <Breadcrumb :style="{margin: '20px',padding: '10px 20px',textAlign: 'left',background: 'white'}">
                        <BreadcrumbItem :to="curTopNav.menuAddress">{{curTopNav.cat_name}}</BreadcrumbItem>
                        <BreadcrumbItem :to="curSubMenu.menuAddress">{{curSubMenu.chapter_title}}</BreadcrumbItem>
                        <!-- <BreadcrumbItem>index</BreadcrumbItem> -->
                    </Breadcrumb>
                    <Content :style="{minHeight: '280px',margin: '0px 20px'}">
                        <router-view />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
        <div class="mask" v-show="showMask"></div>
    </div>
</template>
<script>
import kfApi from '../../service/kfApi';
import Login from '../../service/loginApi';
import {Headers, menuIcons} from '../common/Consts.js';
import crypto from 'crypto';
import * as menuConfig from '../../../config/menu.config.js'
import router from '../../router';
export default {
    name: 'Index',
    data(){
        return {
            loginImg: '',
            menuIcons: {},
            curTopNav:{
                menuName: '',
                menuCode: '',
                index: -1
            },
            curSubMenu: {
                menuName: '',
                menuCode: '',
                menuAddress: '',
                index: -1
            },
            openNames: [],
            activeName: '',
            isCollapsed: false,
            topNav: [],
            subMenus: [],
            // curChapterContent: '',
            showMask: false,
            srcPwd: '',
            rePwd: '',
            reRePwd: '',
            pwdModal: false,
            curTopNav: {
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
                this.loginImg = this.$store.state.accessToken?require('../../../static/i/home/logout.png'):require('../../../static/i/home/login.png')
                return this.$store.state.accessToken;
            },
            set() {
                this.loginImg = this.$store.state.accessToken?require('../../../static/i/home/logout.png'):require('../../../static/i/home/login.png')
                this.$store.dispatch('setAccessToken', val);
            }
        },
        chapterId: {
            get(){
                return this.$store.state.chapterId;
            },
            set() {
                this.$store.dispatch('setChapterId', val);
            }
        },
        chapterStatus: {
            get(){
                return this.$store.state.chapterStatus;
            },
            set() {
                this.$store.dispatch('setChapterStatus', val);
            }
        },
    },
    methods:{
        /**去发布 */
        addChapter(){
            this.$store.dispatch('setChapterId', 0);
            this.$router.push({
                path: '/contentmanage/content'
            })
        },
        login(){
            this.$store.dispatch('setAccessToken', '');
            this.$router.push({
                path: '/'
            })
        },
        /**加载菜单icon */
        loadMenuIcon(){
            this.menuIcons = menuIcons;
        },
        /**获取分类 */
        async getCategoryList(){
            let config = {
                data: {},
                headers: Headers.urlencoded
            },_this = this;
            return await Login.queryAllCategory(config).then(res =>{
                if(res.code == '0'){
                    _this.topNav= res.data
                }
                return res;
            }, err=>{
                return err;
            })
        },
        async getAllChapters(){
            let config = {
                data: {},
                headers: Headers.urlencoded
            },_this = this;
            return await Login.queryAllChapters(config).then(res =>{
                if(res.code == '0'){
                    _this.subMenus= res.data
                }
                return res;
            }, err=>{
                return err;
            })
        },
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
        selected(menu, index){
            this.curTopNav = menu;
            this.curTopNav.index = index;
            if(this.curTopNav.children && this.curTopNav.children.length > 0){
                this.curSubMenu = this.curTopNav.children[0];
                this.curSubMenu.index = 0;
            }
            
            // this.$router.push(
            //     {
            //         path: menu.menuAddress
            //     }
            // )
        },
        goto(menu, index){
            this.curSubMenu = menu;
            this.curSubMenu.index = index;
            this.$store.dispatch('setChapterId', menu.chapter_id);
            this.$store.dispatch('setChapterStatus', 'add');
            this.$router.push(
                {
                    path: '/contentmanage/detail',
                }
            )
        }, 
        /**映射父子菜单 */
        mapMenu(){
            this.topNav = this.menu.topNav;
            this.subMenus = this.menu.subMenus;
            /**设置topNav的子菜单 */
            this.topNav.map((item,index) =>{
                item.children = [];
                this.subMenus.map((i,x) =>{
                    if(i.cat_code == item.cat_code){
                        item.children.push(i);
                    }
                })
            })
            console.log("映射父子菜单this.topNav:%o", this.topNav);
        },
        /**过滤路由，使面包屑导航时正确显示父子菜单名称 */
        filterRouter(){
            let _this = this;
            router.beforeEach((to, from, next) => {
                if(to.redirectedFrom){
                    _this.menu.topNav.map((pi,px) =>{
                        if(to.path.indexOf(pi.menuAddress) > -1){
                           
                            _this.curTopNav = pi;
                            _this.curSubMenu = pi.children[0];
                            _this.$nextTick(()=>{
                                _this.activeName = pi.children[0].menuCode;
                                _this.openNames = [pi.menuCode];
                                _this.$refs.omsMenu.currentActiveName = _this.activeName;
                            })
                            _this.curSubMenu.index = 0;
                        }
                    })
                }
                else{
                    _this.menu.subMenus.map((i,x)=>{
                        if(i.menuAddress == to.path){
                            _this.curSubMenu = i;
                        }
                    });
                    _this.menu.topNav.map((pi,px) =>{
                        if(_this.curSubMenu.parentCode == pi.menuCode){
                            _this.curTopNav = pi;
                        }
                    })
                }
                next();
            })
        },
        /**设置当前父子菜单信息 */
        setCurMenu(){
            let path = this.$route.path;//浏览器中的路由
            this.curSubMenu.menuAddress = path;
            let hasTop = false;//包含topMenu
            this.topNav.map((item,index) =>{
                if(path.indexOf(item.menuAddress) > -1){
                    this.curTopNav = item;
                    this.curTopNav.index = index;
                    let childIndex = -1;
                    this.curTopNav.children.map((i,x) =>{
                        if(path == i.menuAddress){
                            childIndex = x;
                        }
                    })
                    this.curSubMenu = this.curTopNav.children[childIndex];
                    hasTop = true;
                }
            });
            if(!hasTop){
                this.topNav.map((item,index) =>{
                    if(index == 0){
                        this.curTopNav = item;
                        this.curTopNav.index = index;
                        this.selected(item, index);
                    }
                });
            }
        }
    },
    mounted(){
        this.getCategoryList().then( res=>{
            this.getAllChapters().then(res =>{
                this.menu = {
                    topNav: this.topNav,
                    subMenus: this.subMenus
                }
                this.filterRouter();
                this.loadMenuIcon();
                this.mapMenu();
                this.setCurMenu();
            })
        },err =>{
            this.$Message.error('获取分类失败:%o', err);
        })
        console.log("当前token:%s", this.accessToken);
    }
}
</script>
<style scoped lang="less">
@import url('../../assets/c/index.less');
</style>
<style lang="less">
.layout{
    min-width: 750px;
    overflow: scroll;
    .header{
        height: 80px;
        line-height: 80px;
        overflow: hidden;
        
        .logo{
            float: left;
            min-width: 300px;
            .avater{
                text-align: center;
                width: 64px;
                float: left;
                margin: 10px 0px;
                height: 60px;
            }
            .title{
                font-size: 30px;
            }
        }
        .msg-status{
            .logout,.login{
                float: right;
                cursor: pointer;
                img{
                    width: 32px;
                    height: 32px;
                }
            }
            width: 25%;
            min-width: 450px;
            float: right;
            height: 80px;
            overflow: hidden;
            .user-login,.spliter-line{
                float: right;
            }
            .spliter-line{
                width: 1px;
                background: #DFE6E5;
                height: 40px;
                margin: 20px 20px 0px 0px;
            }
            .unread-msg,.status,.logout,.login{
                width: 100px;
                height: 80px;
                line-height: 100px;
                float: right;
                text-align: center;
            }
            .status{
                i{
                    float: left;
                    height: 80px;
                    line-height: 80px;
                    margin: 0px 10px 0px 20px;
                }
                .status-text{
                    float: left;
                    height: 80px;
                    line-height: 80px;
                }
            }
            .unread-msg{
                text-align: right;
                padding-right: 10px;
            }
            .user-login{
                padding: 0px 10px;
                span{
                    margin-right: 10px;
                }
            }
        }
    }
    
    .content-title{
        text-align: left;
        padding-left: 20px;
    }
    .pwd-input{
        margin: 10px 20px;
    }
    .ivu-menu-vertical{
        margin-top: 40px;
        .submenu{
            border-bottom: 1px solid #3DE0D8;
            .ivu-icon-ios-arrow-down{
                top: 23px;
            }
            .submenu-title{
                display: inline-block;
                width: calc(100% - 20px);
                height: 60px;
                line-height: 60px;
                text-align: left;
                padding: 0px 20px;
                font-size: 16px;
            }
            .ivu-menu-submenu-title{
                padding: 0px;
                height: 60px;
                overflow: hidden;
            }
        }
        .submenu.ivu-menu-opened{
            .ivu-menu-submenu-title{
                border-right: none;
                border-left: 4px solid white;
                background: #3DE0D8;
                color: white;
            }
        }
    }
    .ivu-menu-light.ivu-menu-vertical{
        text-align: left;
    }
    .ivu-menu-light.ivu-menu-vertical {
        .ivu-menu-item-active:not(.ivu-menu-submenu){
            background: #3DE0D8;
            color: white;
        }
    }
    .ivu-menu-dark.ivu-menu-horizontal .ivu-menu-item:hover{
        color: #13c27c;
    }
    .ivu-layout-sider-trigger{
        width: 240px !important;
    }
    .ivu-layout-sider-trigger.ivu-layout-sider-trigger-collapsed{
        width: 50px !important;
    }

    /**自定义tab样式*/
    .tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
        border-radius: 0;
        background: #fff;
    }
    .tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
        border-top: 1px solid #3399ff;
    }
    .tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: #3399ff;
        position: absolute;
        top: 0;
        left: 0;
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