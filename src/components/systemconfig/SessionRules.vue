<template>
    <div class="sessionRule">
        <Row class="top">
            <Row>会话分配规则</Row>
        </Row>
        <Row class="content">
            <Row class="rule-tips">会话分配的优先级由上至下，上下拖动关联指定等窗口调整优先级。其中，默认指定的优先级最低，且不可调整。</Row>
            <Row class="rule-order" v-for="(rule,x) in ruleList" :key="x" 
                v-dragging="{item: rule, list: ruleList, group: 'ruleinfo'}">
                <Col span='1' class="numbel" >{{x + 1 }}</Col>
                <Col span='12' class="rule-text">
                <p>{{rule.ruleName}}</p>
                </Col>
                <Col span="10" align="right" style="margin-top:15px;">
                    <template v-if="rule.ruleName == '入口指定'">
                        <Select v-model="model1" style="width:200px;text-align:left;" label-in-value @on-change="changEntry">
                            <Option v-for="item in entranceList" :value="item.entryType" :key="item.entryType">{{item.entryTypeName}}</Option>
                        </Select>  
                        <Button type="primary" @click.native="customerpop">绑定客服组</Button>
                    </template>              
                </Col>
            </Row>
        </Row>
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
            curRouteId: '',
            skillGroupId: '',
            ruleCode: '',
            enterType: '',
            curGroup: -1,
            customerList:[],
            ruleList:[],
            entranceList: [],            
            model1: '',
            modal2: false
        }
    },
    methods:{
        /**切换入口 */
        changEntry(value){
            this.enterType = value.value;
        },
        /**选择客服 */
        selectGroup(group, index){
            this.curGroup = index;
            this.skillGroupId = group.busId;
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
        ok() {
            this.ruleList.map( i =>{
                if(i.ruleName == '入口指定'){
                    this.curRouteId = i.busiId
                    this.ruleCode = i.ruleCode
                }
            });
            let config = {
                data: {
                    busiId: this.curRouteId,
                    skillGroupId: this.skillGroupId,
                    ruleCode: this.ruleCode,
                    enterType: this.enterType
                },
                headers: Headers.json
            }
            systemconfigApi.saveRuleAndSkillGroup(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('绑定成功');
                    this.queryRouteByTenantId();
                }else{
                    this.$Message.info(res.message);
                }
            },err=>{
                this.$Message.error(err);
            }) 
        },
        cancel() {},    
        /** 查询会话分配规则**/
        queryRouteByTenantId(){
            let config = {
                headers: Headers.json
            }
            systemconfigApi.queryRouteByTenantId(config).then(res =>{
                if(res.code == '0'){
                    function compare(property){
                        return function(a,b){
                            var value1 = a[property];
                            var value2 = b[property];
                            return value1 - value2;
                        }
                    }
                    this.ruleList = res.resultData.sort(compare('rulePriority'));  
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
        let _this = this;
        this.$dragging.$on('dragged', ({ value }) => {
            
        });
        this.$dragging.$on('dragend', ( value ) => {
            
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
        this.queryEntryTypeList();
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
        background:rgba(247,249,252,1);
        border-radius:4px;
        margin:10px 0px;
        .numbel{
            border-right: 1px solid #f3f3f3;
            padding: 20px;
            text-align: center;
            cursor: move;
        }
        .rule-text{
            padding:20px;
        }
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

