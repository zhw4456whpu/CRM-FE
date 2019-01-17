<template>
    <div class="sessionRule">
        <Row class="top">
            <Row>会话分配规则</Row>
        </Row>
        <div id="content" class="content" @drop="drop($event)" @dragover="allowDrop($event)">
            <div class="rule-tips">会话分配的优先级由上至下，上下拖动关联指定等窗口调整优先级。其中，默认指定的优先级最低，且不可调整。</div>
            <div :id="'rule'+x" class="rule-order" v-for="(rule,x) in ruleList" :key="x" 
                :draggable="draggable" @dragstart="drag($event)">
                <div class="numbel" >{{x + 1 }}</div>
                
                <div class="rule-text" :style="{'width':rule.ruleName == '入口指定'?'calc(100% - 460px)':'calc(100% - 60px)'}">
                    <p>{{rule.ruleName}}</p>
                </div>
                
                <div style="width:400px;float:left;" v-if="rule.ruleName == '入口指定'">
                    <Select v-model="model1" style="width:200px;text-align:left;">
                        <Option v-for="item in entranceList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>  
                    <Button type="primary" @click.native="customerpop">绑定客服组</Button>
                </div>
                <div style="clear:both"></div>
            </div>
        </div>
        <Modal
            v-model="modal2"
            title="请选择相应的客服组"
            @on-ok="ok"
            @on-cancel="cancel">
             <Row style="margin-left:50px;">
                 <Col span="8" @click.native="selectGroup(item,index)"
                 v-for="(item,index) in customerList"  
                 :key="index" :class="{'group-name': true,'selected': index == curGroup}">
                    {{item.groupName}}
                 </Col>
             </Row>
        </Modal>        
    </div>
</template>
<script>
import systemconfigApi from '../../service/systemconfigApi';
import {Headers} from '../common/Consts.js';
export default {
    data(){
        return{
            draggable: true,
            curGroup: -1,
            customerList:[],
            ruleList:[],
            entranceList: [
                {
                    value: '1',
                    label: '商品详情页1'
                },
                {
                    value: '2',
                    label: '商品详情页2'
                },
                {
                    value: '3',
                    label: '商品详情页3'
                },
                {
                    value: '4',
                    label: '商品详情页4'
                },
                {
                    value: '5',
                    label: '商品详情页5'
                },
                {
                    value: '6',
                    label: '商品详情页6'
                }
            ],            
            model1: '',
            modal2: false
        }
    },
    methods:{
        drag(e) {
            e.dataTransfer.setData("Text",e.target.id);
        },
        allowDrop(e){
            e.preventDefault();
        },
        drop(e){
            e.preventDefault();
            var data= e.dataTransfer.getData("Text");
            if(e.target == 'content'){
                e.target.appendChild(document.getElementById(data));
            }
            
        },
        /**选择客服 */
        selectGroup(group, index){
            this.curGroup = index;
        },
        //点击绑定客服组
        customerpop(){
            this.modal2 = true;
            let config = {
                headers: Headers.json
            }
            systemconfigApi.querySkillGroupByUser(config).then(res =>{
                if(res.code == '0'){
                    this.customerList = res.resultData;
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        ok() {},
        cancel() {},    
        /** 查询会话分配规则**/
        queryRouteByTenantId(){
            let config = {
                headers: Headers.json
            }
            systemconfigApi.queryRouteByTenantId(config).then(res =>{
                if(res.code == '0'){
                    this.ruleList = res.resultData;  
                }else{
                    this.$Message.info(res.message);
                }
            },err=>{
                this.$Message.error(err);
            }) 
        },
        queryEntryTypeList(){
            let config = {
                headers: Headers.json
            }
            systemconfigApi.queryEntryTypeList(config).then(res =>{
                if(res.code == '0'){
                    this.entranceList = res.resultData;  
                }else{
                    this.$Message.info(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })  
        }
    },
    mounted(){
        this.$dragging.$on('dragged', (value) => {
            let list = this.ruleList.map((i,x) =>{
                return {
                    tenantRRouteId: i.tenantRRouteId,
                    rulePriority: x + 1,
                }
            });
            let config = {
                data: list,
                headers: Headers.json
            };
            systemconfigApi.updateRouteById(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('修改成功');
                }else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        })
       this.queryRouteByTenantId();
    }
}
</script>
<style lang="less" scoped>
.sessionRule{
    background: #fff;
    .top{
        height: 107px;
        line-height: 107px;
        font-size: 18px;
        font-family: PingFangSC-Medium;
        font-weight: bold;
        color: rgba(20,41,33,1);
        padding-left: 40px;
    }
    .content{
        border: 1px solid #EBEDF0;
        margin: 0px 40px 40px 40px;
        padding: 0px 40px;
        min-height: 600px;

        .rule-tips{
            font-size: 16px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(117,128,121,1);
            line-height: 16px;
            height: 60px;
            line-height: 60px;
        }
        
    }
    .content::after{
        clear: both;
        content: none;
    }
    h1{
        font-size: 18px;
        color:#333;
        text-align: center;
        border-bottom:1px solid #f3f3f3;
        padding-bottom: 10px;
    }
    h4{
        padding-top:10px;
    }
    .rule-order{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background:rgba(247,249,252,1);
        border-radius:4px;
        margin:10px 0px;
        .numbel{
            border-right: 1px solid #f3f3f3;
            text-align: center;
            cursor: move;
            width: 60px;
            float: left;
            height: 60px;
            line-height: 60px;
        }
        .rule-text{
            width: calc(100% - 60px);
            float: left;
            height: 60px;
            line-height: 60px;
            padding-left: 40px;
        }
    }
    .rule-order::after{
        clear: both;
        content: '';
    }
}
.group-name{
    height: 60px;
    line-height: 60px;
    text-align: center;
    border: 1px solid #EBEDF0;
    border-radius: 4px;
    margin:10px;
    cursor:pointer;
}
.selected{
    background-color: #f0faf6;
}
</style>

