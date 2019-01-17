

<template>
    <section class="root">
        <div v-for="(item,index) in treeData">
            <div class="parent">
                <leaf :leaf="item" :index="index" :childlength="treeData.length"></leaf>
            </div>
            <div v-show="item.children.length" class="children lv2">
                <div v-for="(citem,cindex) in item.children" class="v-for">
                    <div class="parent">
                        <leaf :leaf="citem" :index="cindex" :childlength="item.children.length"></leaf>
                    </div>
                    <div v-show="citem.children.length" class="children lv3">
                        <div v-for="(ditem,dindex) in citem.children" class="v-for">
                            <div class="parent">
                                <leaf :leaf="ditem" :index="dindex" :childlength="citem.children.length"></leaf>
                            </div>
                            <div v-show="ditem.children.length" class="children lv4">
                                <div v-for="(eitem,eindex) in ditem.children" class="v-for">
                                    <leaf :leaf="eitem" :index="eindex" :childlength="ditem.children.length"></leaf>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </section>
</template>
<script>
import Leaf from './TreeLeaf'
export default {
    name : 'tuoputree',
    components : {
        Leaf
    },
    data(){
        return {
            treeData : [
                {
                    title : '170LD-1',
                    logo : '../../../static/i/toptree/home_32.png',
                    hasParent : false,
                    hasChildren : true,
                    children : [
                        {
                            title : 'MCU-1',
                            logo : '../../../static/i/toptree/mcu.png',
                            hasParent : true,
                            hasChildren : false,
                            children : [
                                
                            ]
                        },
                        {
                            title : 'MCU-2',
                            logo : '../../../static/i/toptree/mcu.png',
                            hasParent : true,
                            hasChildren : true,
                            children : [
                                {
                                    title : '基岩变形计',
                                    logo : '../../../static/i/toptree/jybx.png',
                                    hasParent : true,
                                    hasChildren : false,
                                    children : [
                                        
                                    ]
                                },
                                {
                                    title : '渗压计',
                                    logo : '../../../static/i/toptree/sy.png',
                                    hasParent : true,
                                    hasChildren : true,
                                    children : [
                                        {
                                            title : 'P01Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        },
                                        {
                                            title : 'P03Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        },
                                        {
                                            title : 'P04Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        },
                                        {
                                            title : 'P02Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        },
                                        {
                                            title : 'P01YL1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        },
                                        {
                                            title : 'P02YL1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        }
                                    ]
                                },
                                {
                                    title : '无应力计',
                                    logo : '../../../static/i/toptree/wyl.png',
                                    hasParent : true,
                                    hasChildren : true,
                                    children : [
                                        {
                                            title : 'N01Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        },
                                        {
                                            title : 'N02Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        }
                                    ]
                                },
                                {
                                    title : '应变计',
                                    logo : '../../../static/i/toptree/yb.png',
                                    hasParent : true,
                                    hasChildren : true,
                                    children : [
                                        {
                                            title : 'S01Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        },
                                        {
                                            title : 'S02Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        },
                                        {
                                            title : 'S03Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        },
                                        {
                                            title : 'S04Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        },
                                        {
                                            title : 'S05Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        },
                                        {
                                            title : 'C01Y1',
                                            hasParent : true,
                                            hasChildren : false,
                                            children : [
                                                {}
                                            ]
                                        }
                                    ]
                                },
                                {
                                    title : '温度计',
                                    logo : '../../../static/i/toptree/temprature.png',
                                    hasParent : true,
                                    hasChildren : false,
                                    children : [
                                        
                                    ]
                                }
                            ]
                        },
                        {
                            title : 'MCU-3',
                            logo : '../../../static/i/toptree/mcu.png',
                            hasParent : true,
                            hasChildren : false,
                            children : [
                                
                            ]
                        }
                    ]
                }
            ]
        }
    },
    methods:{
        init(){
        }
    },
    mounted(){
        this.init();
    }
}
</script>
<style lang="less" scoped>
.root{
    .parent{
        width : 300px;
        float :left;
    }
    .children{
        width : 300px;
        float :left;
    }
    .lv3 {
        position : absolute;
        top : 0px;
        left : 600px;
        width : 300px;
    }
    .lv4{
        position : absolute;
        top : 0px;
        left : 300px;
        width : 300px;
    }
}
</style>