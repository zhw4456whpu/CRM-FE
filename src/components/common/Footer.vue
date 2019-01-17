<template>
    <Row class="footer">
        <Row class="footer-hd">
            <p>
                <a v-for="(item,index) in footerLinks" :key="item.value" :value="item.value"
                    :href="item.href">
                    {{item.label}}
                    <b v-if="index != footerLinks.length-1">|</b>
                </a>
                
            </p>
        </Row>
        <Row class="footer-bd">
            <p>
                <a v-for="item in footerAbout" :key="item.value" :value="item.value">
                    {{item.label}}
                </a>
                <b></b>
            </p>
            <em class="desc">{{footerDesc}}</em>
        </Row>
    </Row>
</template>
<script>
export default{
    name:'sFooter',
    data(){
        return {
            footerLinks:[
                {
                    label:'xx科技',
                    value:'1',
                    href:''
                },
                {
                    label:'商城首页',
                    value:'2',
                    href:'/home'
                },
                {
                    label:'支付宝',
                    value:'3',
                    href:''
                },
                {
                    label:'物流',
                    value:'4',
                    href:''
                }
            ],
            footerAbout:[
                {
                    label:'关于xx',
                    value:'1',
                    href:''
                },
                {
                    label:'合作伙伴',
                    value:'2',
                    href:''
                },
                {
                    label:'联系我们',
                    value:'3',
                    href:''
                },{
                    label:'网站地图',
                    value:'4',
                    href:''
                }
            ],
            footerDesc:'© 2015-2025 xxx.com 版权所有. - Collect from xx'
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../assets/c/footer.less');  
</style>