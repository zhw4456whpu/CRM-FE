<template>
    <div class="tree-leaf">
        <div class="left-line" >
            <div class="tcover" v-show="index==0"></div>
            <div class="bline" v-show="leaf.hasParent"></div>
            <div class="bcover" v-show="index==childlength - 1"></div>
        </div>
        <div class="center-content">
            <div class="logo">
                <img :src="leaf.logo" width="60px" height="40px"/>
            </div>
            <div class="title">
                <span>{{leaf.title}}</span>
            </div>
        </div>
        <div class="right-line">
            <div class="bline" v-show="leaf.hasChildren"></div>
        </div>
    </div>
</template>
<script>
export default{
    name : 'TreeLeaf',
    props : ['leaf', 'index', 'childlength']
}
</script>
<style lang="less" scoped>
.tree-leaf{
    border-left : 1px solid black;
    width : 300px;
    height : 100px;
    .left-line,.center-content{
        position : relative;
        height : 100px;
        width : 100px;
        float : left;
    }
    .center-content{
        padding-top : 25px;
        
    }
    .right-line{
        height : 100px;
        width : 98px;
        float : left;
    }
    .tcover{
        position : absolute;
        top : 0px;
        left : -2px;
        border : none;
        width : 100px;
        height : 49px;
        background : white;
        z-index : 1;
    }
    .bcover{
        position : absolute;
        top : 50px;
        left : -2px;
        border : none;
        width : 100px;
        height : 49px;
        background : white;
        z-index : 1;
    }
    .bline{
        margin-top : 49px;
        height : 1px;  
        border-bottom : 1px solid #666666;      
    }
    .logo{

    }
}
    
</style>