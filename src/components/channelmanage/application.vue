<template>
    <Row class="application">
        <Row class="top">
            <Col span="10" style="text-align:left;padding-left:10px;font-size:16px;font-weight:bold;">
                手机APP
            </Col>
            <Col span="14" style="text-align:right;padding-right:10px;">
                <Button type="primary" @click="addAppRelate" icon="ios-plus-outline">添加APP关联</Button>
            </Col>
        </Row>
        <Row class="content">
            <Col span="4" class="left">
                <Row v-for="(item,index) in relateList" :key="index" class="list-item">
                    <img class="logo" :src="item.logo" style="margin-top: 8px;"/>
                    <span>{{item.name}}</span>
                </Row>
            </Col>
            <Col span="20" class="right">
                <Row class="inline-content">
                    <Row class="title">关联APP信息</Row>
                    <Row class="desc" v-for="(item,index) in infoList" :key="index">
                        <Col span="4">{{item.label}}</Col>
                        <Col span="20">
                            <template v-if="item.type == 'link'">
                                <a :href="item.src" target="_blank">{{item.val}}</a>
                            </template>
                            <template v-else-if="item.type=='pic'">
                                <img :src="item.val" />
                            </template>
                            <template v-else>
                                {{item.val}}
                            </template>
                        </Col>
                    </Row>
                </Row>
            </Col>
        </Row>
    </Row>
</template>
<script>
export default {
    name: 'Application',
    data(){
        return {
            relateList: [
                {
                    name: 'App',
                    logo: require('../../../static/i/home/1.jpg')
                }
            ],
            infoList: [
                {
                    label: '关联名称',
                    val: '快速创建的关联'
                },
                {
                    label: 'AppKey',
                    val: '1150181010228220#peidou'
                },
                {
                    label: 'Client ID',
                    val: 'YXA6898HSDKJSH_nskjdhBJHBbnjhbJHBJH'
                },
                {
                    label: 'Client Secret',
                    val: '8909KNJDHAKSDH_KNSDsjkdnJDSHHDKFKDJNSAKDJNASJD'
                },
                {
                    label: 'IM服务号',
                    val: 'kefuchannelimid_1464643'
                },
                {
                    label: '组织',
                    val: '145464564645646'
                },
                {
                    label: '应用名称',
                    val: 'kefuchannelapp58982'
                },
                {
                    label: '关联ID',
                    val: '86742'
                },
                {
                    label: '验证状态',
                    val: '通过'
                },
                {
                    label: '接入状态',
                    val: '联通中'
                },
                {
                    label: '关联时间',
                    val: '2018-10-30'
                },
                {
                    label: '集成指南',
                    type: 'link',
                    src: 'http://www.baidu.com',
                    val: '点击查看集成指南'
                },
                {
                    label: '二维码',
                    type: 'pic',
                    val: require('../../../static/i/home/1.jpg')
                }
            ]
        }
    },
    methods:{
        addAppRelate(){}
    }
}
</script>
<style lang="less">
.application{
    background-color: #e6eaf3;
    .top{
        height: 48px;
        line-height: 48px;
    }
    .content{
        
        min-height: 600px;
        
        .left{
            background-color: white;
            min-height: 600px;
            .list-item{
                height: 48px;
                line-height: 48px;
                background-color: #06a9ee;
                color: white;
                .logo{
                    height: 32px;
                    width: 32px;
                    border-radius: 50%;
                }
            }
        }
        .right{
            padding-left: 10px;
            .inline-content{
                background-color: white;
                min-height: 600px; 
                .title{
                    text-align: center;
                    font-size: 16px;
                    font-weight: bold;
                    height: 48px;
                    line-height: 48px;
                    border-bottom: solid 1px #e6eaf3;
                }
                .desc{
                    text-align: left;
                    padding-left: 10px;
                    height: 48px;
                    line-height: 48px;
                }
            }
        }
    }
}
</style>