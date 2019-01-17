<template>
    <Row class="bread-crumb">
        <ol class="breadcrumb-slash">
            <li v-for="item in paths" :value="item.value" :key="item.value">
                <a href="item.href">{{item.label}}</a>
            </li>
        </ol>
    </Row>
</template>
<script>
export default{
    name:'BreadCrumb',
    data(){
        return {
            paths:[
                {
                    label:'首页',
                    value:'1'
                },
                {
                    label:'分类',
                    value:'2'
                },
                {
                    label:'详情',
                    value:'3'
                }
            ]
        }
    }
}
</script>
<style lang="less" scoped>
.bread-crumb{
    padding: .7em .5em;
    list-style: none;
    background-color: transparent;
    border-radius: 0;
    font-size: 85%;
    margin:10px auto;
    max-width: 1200px;
    text-align:left;

    li{
        display:inline-block;
        font-size:14px;
        width:auto;
    }
    li+li::before{
        content: "/\00a0";
        padding: 0 8px;
        color: #ccc;
    }
}
</style>