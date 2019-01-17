<template>
    <div class="user-info">
        <Col span="8" style="text-align:left;" v-if="userInfo">
            <span class="links">欢迎您,<a @click="userSpace">{{userInfo.userName}}</a><a @click="logout">安全退出</a></span>
                <span class="links"><a></a></span>
        </Col>
        <Col v-else>
            <Col span="8" style="text-align:left;">
                <span class="links">亲,<a @click="login">请登录</a><a>免费注册</a></span>
            </Col>
            
        </Col>
        <Col span="16" style="text-align:right;">
            <span class="links"><a>商场首页</a></span>
            <span class="links"><a><Icon type="android-person"></Icon>个人中心</a></span>
            <span class="links"><a><Icon type="android-cart"></Icon>购物车</a></span>
            <span class="links"><a><Icon type="android-favorite-outline"></Icon>收藏夹</a></span>
        </Col>
    </div>
</template>
<script>
export default{
    name:'userInfo',
    data(){
        return {
            userInfo:{}
        }
    },
    methods:{
        userSpace(){},
        login(){
            this.$router.push(
                {
                    name:'Login'
                }
            )
        },
        logout(){
            this.userInfo = null;
            localStorage.removeItem('userInfo');
        }
    },
    mounted(){
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    }
}
</script>
<style lang="less" scoped>
.user-info{
    width:1200px;
    margin:0px auto;
    height:35px;
    line-height:35px;
    font-size:14px;

    a{
        padding-left:5px;
    }
}
.links{
    padding:10px 10px 2px 10px;
}
</style>