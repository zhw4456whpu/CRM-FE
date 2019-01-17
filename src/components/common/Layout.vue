<template>
    <Row class="layout">
        <!-- home 头部 -->
        <top></top>
        <!-- home 导航 -->
        <a-nav></a-nav>
        <Row class="line"></Row>
        <router-view></router-view>
        <!-- footer -->
        <a-footer></a-footer>
        
    </Row>
</template>
<script>
import top from './Top'
import aNav from './ShopNav'
import aFooter from './Footer'

export default{
    name:'Layout',
    components:{
        top:top,
        aNav:aNav,
        aFooter:aFooter
    }
}
</script>