<template>
    <div class="workdays-tbl">
        <Row class="help">
            <span>节假日</span>
            <span><Icon type=" ios-help-circle" /></span>
        </Row>
        <Row class="help">
            <Col span="4">
                <span>
                    <Icon type=" ios-help-circle" />
                </span>
            </Col>
            <Col span="20" style="text-align:right;">
                <Button  style="margin:0 20px 15px 0;"
                type="ghost"
                 @click="addSelfholidays">+ 添加节假日</Button>
            </Col>
        </Row>        
        <x-table :data="tableData" :show-header="showHeader" ref="selection" no-data-text="没有数据">
            <x-table-column type="selection" :width="60" align="center"></x-table-column>
            <x-table-column title="名字" prop="name" :width="310"></x-table-column>
            <x-table-column title="时间" prop="planTime">
                <template slot-scope="scope">
                    <TimePicker confirm type="timerange" placement="bottom-end" 
                        placeholder="9:00         -         18:00" style="width: 400px" :transfer="transfer">
                    </TimePicker>
                </template>
            </x-table-column>
            <x-table-column title="操作">
                <template slot-scope="scope">
                    <Button type="text" size="large" @click="$Modal.info({
                        title: '提示',
                        content: `确定删除${scope.name} `
                    })"><Icon type="trash-a"></Icon></Button>
                </template>
            </x-table-column>
        </x-table>
        <Modal
            v-model="modal1"
            title="添加节假日"
            @on-ok="ok"
            @on-cancel="cancel">
            <Row>
                <Col span="2" style="line-height:28px;">
                    名称
                </Col>               
                <Col span="10">
                 <Input v-model="value" placeholder="" style="width: 350px;margin-left:20px;"></Input>
                </Col>
            </Row>
        </Modal>
        <Row>
            <Col style="text-align:right; margin-right:16px;">
                <Button type="primary" @click="save">保存</Button>
            </Col>
        </Row>
    </div>
</template>
<script>
import xTable from "@/components/common/xTable";
import xTableColumn from "@/components/common/xTableColumn";
import systemconfig from '../../service/systemconfigApi';
import {Headers} from '../common/Consts.js';
export default {
    name: 'holidays',
    components: {
        xTable,
        xTableColumn
    },
    methods: {
        //查询时间计划
        queryWorkdays(type){
            let config = { 
                data: {
                    planType: type
                },
                headers: Headers.json            
            };
            systemconfig.queryAllTimePlan(config).then(res =>{
                if(res.code == '0'){
                    if(type == 1){
                        this.defaultWeekdays = res.resultData
                    }
                    else{
                        this.selfWeekdays = res.resultData
                    }
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, error =>{
                this.$Message.error(error)
            });            
        },
        handleTimeChange(val){
            this.planTime = val;
        },
        planOk(){
            this.showTimePicker = false;
        },
        save(){

        },
        addSelfholidays(){
            this.modal1=true;
        },
        ok () {
            this.$Message.info('Clicked ok');
        },
        cancel () {
            this.$Message.info('Clicked cancel');
        }        
    },
    data(){
        return {
            showHeader: false,
            showTimePicker: false,
            transfer: true,
            modal1: false,
            value:'',
            timeplan: [new Date()],
            tableData: [
                {
                    name: '国庆节加班',
                    planTime: '9:00:00 - 18:00:00'
                },
                {
                    name: '中秋节加班',
                    planTime: '9:00:00 - 18:00:00'
                }
            ],
        }
    },
    mounted(){
        this.queryWorkdays(3);
    }
}
</script>
<style lang="less">
.help{
    text-align: left;
}
.ivu-table::after{
    width: 0px;
}
.ivu-table:before{
    height: 0px;
}
.ivu-table-wrapper{
    border: none;
}
.ivu-table td{
    border: none;
}
</style>