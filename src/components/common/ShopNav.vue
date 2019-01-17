<template>
    <div :class="showFullNav?'shop-nav':'shop-nav-2'">
        <Row :class="showFullNav?'slide-all':'slide-all-2'">
            <Row class="long-title">
                <span class="all-goods">全部分类</span>
            </Row>
            <!-- 水平导航 -->
            <Row class="nav-cont">
                <Col span="20">
                    <ul>
                        <li v-for="item in navList" :value="item.value" :key="item.value">
                            <a>{{item.label}}</a>
                        </li>
                    </ul>
                </Col>
                <Col span="4" class="nav-extra">
                    <i class="nav-user"></i>
                    <b></b>
                    我的福利
                    <i class="angle-right" style="padding-left: 10px;"></i>
                </Col>
            </Row>
            <!-- 左侧导航 -->
            <Row v-if="showFullNav" class="nav-full">
                <Row class="area">
                    <Row class="category-content">
                        <category></category>
                    </Row>
                </Row>
            </Row>
            <!-- 商城头条 -->
            <Row v-if="showMarqueen" class="marqueen">
                <span class="marqueen-title">商城头条</span>
                <div class="demo">

                    <ul>
                        <li class="title-first">
                            <a target="_blank" href="#">
                                <img src="../../../static/i/home/TJ2.jpg" />
                                <span>[特惠] 商城爆品1分秒</span>							
                            </a>
                        </li>
                        <li class="title-first">
                            <a target="_blank" href="#">
                                <img src="../../../static/i/home/TJ.jpg" />
                                <span>[公告] 商城与广州市签署战略合作协议</span>
                            </a>
                        </li>
                            <div class="mod-vip">
                                <div class="m-baseinfo">
                                    <a href="../person/index.html">
                                        <img src="../../../static/i/home/getAvatar.do.jpg">
                                    </a>
                                    <em>
                                        Hi,<span class="s-name">小叮当</span>
                                        <a href="#"><p>点击更多优惠活动</p></a>									
                                    </em>
                                </div>
                                <div class="member-logout">
                                    <a class="am-btn-warning btn" href="login.html">登录</a>
                                    <a class="am-btn-warning btn" href="register.html">注册</a>
                                </div>
                                <div class="member-login">
                                    <a href="#"><strong>0</strong>待收货</a>
                                    <a href="#"><strong>0</strong>待发货</a>
                                    <a href="#"><strong>0</strong>待付款</a>
                                    <a href="#"><strong>0</strong>待评价</a>
                                </div>
                                <div class="clear"></div>	
                            </div>																	    
                        <li class=""><a target="_blank" href="#"><span>[特惠]</span>洋河年末大促，低至两件五折</a></li>
                        <li class=""><a target="_blank" href="#"><span>[公告]</span>华北、华中部分地区配送延迟</a></li>
                        <li class=""><a target="_blank" href="#"><span>[特惠]</span>家电狂欢千亿礼券 买1送1！</a></li>
                        
                    </ul>
                <div class="advTip"><img src="../../../static/i/home/advTip.jpg"></div>
                </div>
            </Row>
        </Row>  
    </div>
</template>
<script>
import category from './Category'
export default{
    name:'ShopNav',
    data(){
        return {
            navList:[
                {
                    label:'首页',
                    value:'1'
                },{
                    label:'闪购',
                    value:'2'
                },{
                    label:'限时抢',
                    value:'3'
                },{
                    label:'团购',
                    value:'4'
                },{
                    label:'大包装',
                    value:'5'
                },
            ]
        }
    },
    props:['showFullNav','showMarqueen'],
    components:{
        category:category
    }
}
</script>
<style lang="less">
@import url('../../assets/c/shopnav.less');
</style>