<template>
    <div class="search-bar">
        <Row>
            <Col style="width:200px;float:left;">
                <img src="../../assets/i/login/logobig.png" class="top-img"></img>
            </Col>
            <Col style="width:800px;float:right;margin:25px 0px;">
                <Col class="s-form">
                    <Select class="suggest-input" 
                        v-model="showSuggest" clearable filterable remote 
                        :remote-method="suggest" :label="defaultLabel" size="large" 
                        @on-query-change="queryChange" 
                        @on-change="changeOpt"
                        :loading="loading"
                    >
                        <Option v-for="sli in suggestList" :value="sli.label" :key="sli.value">{{sli.label}}</Option>
                    </Select>
                    <Button class="s-btn" type="error" :loading="searchLoading" @click="search(showSuggest)">搜索</Button>
                    <div class="clear"></div>
                </Col>
            </Col>
        </Row>
    </div>
</template>
<script>
import searchApi from '../../service/search'
import utils from '../../assets/j/utils'
export default{
    name:'SearchBar',
    data(){
        return {
            keyWords:'',
            loading:false,
            showSuggest:'',
            defaultLabel:'搜索',
            suggestList:[],
            searchLoading:false,
            debounce:true
        }
    },
    methods:{
        //关键字联想
        suggest(keywords){
            if(utils.isNullObject(keywords) || this.debounce) return false;
            this.loading =true;
            this.defaultLabel = keywords;
            let config = {
                data:{
                    keywords:keywords
                }
            }
            this.debounce = true;
            var that = this;
                
            searchApi.suggest(config).then(res =>{
                that.loading =false;
                that.debounce =true;//恢复成延时联想
                that.suggestList = res.data.map(item =>{
                    return {
                        label:item.label,
                        value:item.value
                    }
                });
            },err =>{
                this.$Message.error(err);
            });
        },
        search(keywords){
            this.loading =true;
            let config = {
                data:{
                    keywords:keywords
                }
            }
            searchApi.search(config).then(res =>{
                this.loading =false;
                this.suggestList = res.data.map(item =>{
                    return {
                        label:item.label,
                        value:item.value
                    }
                });
            },err =>{
                this.$Message.error(err);
            });
            
        },
        //选中的option变化触发的事件
        changeOpt(val){
        },
        //搜索词改变时触发
        queryChange(val){
            //搜索词改变了，开始联想（不延时了）
            this.debounce = false;  
        }
    }
}
</script>
<style>
.ivu-select-large.ivu-select-single .ivu-select-selection{
    border: none;
    height: 46px;
    line-height: 46px;
    outline: 0;
    border-radius:0px;
}
</style>
<style lang="less" scoped>
.search-bar{
    width:1000px;
    margin:0px auto;
    .top-img{
        width:200px;
        height:90px;
    }
    .s-form{
        border: 2px solid #F03726;
        max-width: 670px;
        width:660px;
        margin:0px auto;
        box-sizing: content-box;
        .suggest-input.ivu-select.ivu-select-single{
            width:530px;
            border:none;
            float:left;
        }
        .s-btn {
            width:130px;
            float:left;
            height:46px;
            border-radius:0px;
            font-size:18px;
        }
        .ivu-select-large .ivu-select-input{
            height:46px;
        }

        .ivu-select-dropdown-list{
            max-height:200px;
            li{
                text-align:left;
            }
        }
    }
}

</style>