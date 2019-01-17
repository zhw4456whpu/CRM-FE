<template>
    <div class="workdays-tbl">
        <Row class="help">
            <span>工作日设置 <Icon type="help-circled"></Icon></span>
            <span><Icon type=" ios-help-circle" /></span>
        </Row>
        <x-table :data="defaultWeekdays" :show-header="showHeader" ref="selection" no-data-text="没有数据">
            <x-table-column type="selection" :width="60" align="center"></x-table-column>
            <x-table-column title="名称" prop="planName" :width="310"></x-table-column>
            <x-table-column title="时间" prop="timeFrom">
                <template slot-scope="scope">
                    <TimePicker confirm type="timerange" placement="bottom-start" v-model="timeFrom"
                        placeholder="9:00         -         18:00" style="width: 400px" :transfer="transfer">
                    </TimePicker>
                </template>
            </x-table-column>
        </x-table>
        <Row class="submit-btn">
            <Button type="primary" @click="save">保存</Button>
        </Row>        
        <Row class="help" style="margin-top: 30px;">
            <Col span="4">
                <span>自定义工作日 <Icon type="help-circled"></Icon></span>
            </Col>
            <Col span="20" style="text-align:right;">
                <Button style="margin:0 20px 15px 0;" type="ghost" @click="addSelfWorkdays">+ 添加自定义工作日</Button>
            </Col>
        </Row>
        <x-table :data="selfWeekdays" :show-header="showHeader" ref="selection" no-data-text="没有数据">
            <x-table-column title="名称" prop="dayname"></x-table-column>
            <x-table-column title="日期" prop="datapick"></x-table-column>
            <x-table-column title="时间" prop="timepick"></x-table-column>
            <x-table-column title="操作" prop="timepick">
                <template slot-scope="scope">
                    <Button type="text" icon="trash-a" @click="delSelfWorkdays(scope)"></Button>
                </template>
            </x-table-column>

        </x-table>
        <Row class="submit-btn" style="border:none;">
            <Button type="primary" @click="save">保存</Button>
        </Row>
        <Modal
            v-model="modal1"
            title="添加自定义工作日"
            @on-ok="ok"
            @on-cancel="cancel">
            <Row>
                <Col span="2" style="line-height:28px;">
                    名称
                </Col> 
                <Col span="8">
                 <Input  placeholder="" v-model="daytext" style="width: 380px;margin-left:20px;"></Input>
                </Col>               
            </Row>  
            <Row style="margin-top:10px;">    
                <Col span="2" style="line-height:28px;">
                    时间
                </Col>                         
                <Col span="5" style="width: 180px;margin-left:20px;">
                    <DatePicker :value="value2"  v-model="dataslot"  format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="Select date" ></DatePicker>
                </Col>
                </Col>
                <Col span="5" style="width: 180px;margin-left:20px;">
                    <TimePicker confirm type="timerange" v-model="timeslot" placement="bottom-end" placeholder="9：00-18：00" ></TimePicker>
                </Col>                
            </Row>
        </Modal>
    </div>
</template>
<script>
import xTable from "@/components/common/xTable";
import xTableColumn from "@/components/common/xTableColumn";
import systemconfig from '../../service/systemconfigApi';
import {Headers} from '../common/Consts.js';
export default {
    name: 'Workdays',
    components: {
        xTable,
        xTableColumn
    },
    props: ['props'],
    data(){
        return {
            defaultWeekdays: [],
            selfWeekdays: [],
            showHeader: false,
            showTimePicker: false,
            transfer: true,
            modal1: false,
            daytext:'',
            dataslot:'',
            timeslot:'',
            timeplan: [new Date()],
            value2: ['2016-01-01', '2016-02-15'],
            weekdays:[
                    {
                    dayname:'店庆',
                    datapick:'2017/02/06-2018/03/06',
                    timepick:'9:00-18:00',
                    },
                    {
                    dayname:'双十一',
                    datapick:'2017/02/06-2018/03/06',
                    timepick:'9:00-18:00',
                    },
                    {
                    dayname:'不开心节日',
                    datapick:'2017/02/06-2018/03/06',
                    timepick:'9:00-18:00',
                    },                    
            ],
            tableData: [
                {
                    itemName: '',
                    timeFrom: '',
                    timeTo:''
                },
                {
                    itemName: '',
                    timeFrom: '',
                    timeTo:''
                },
                {
                    itemName: '',
                    timeFrom: '',
                    timeTo:''
                },
                {
                    itemName: '',
                    timeFrom: '',
                    timeTo:''
                },
                {
                    itemName: '',
                    timeFrom: '',
                    timeTo:''
                },
                {
                    itemName: '',
                    timeFrom: '',
                    timeTo:''
                },
                {
                    itemName: '',
                    timeFrom: '',
                    timeTo:''
                },
            ],
        }
    },    
    methods: {
        handleTimeChange(val){
            this.timeFrom = val;
        },
        planOk(){
            this.showTimePicker = false;
        },
        delSelfWorkdays(index){
            let config = {
                data:{
                    busiId:'3',
                },
                headers: Headers.json               
            };
            systemconfig.delSelfWorkdays(config).then(res =>{
                if(res.code == '0'){
                    res.resultData;
                    //如果成功，删除选中行
                    this.weekdays.splice(index,1)
                    this.$Message.info('删除工作日成功');
                }
            }, error =>{
                this.$Message.error(error)
            });            
        },
        save(){

        },
        addSelfWorkdays(){
            this.modal1=true;
        },
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
        ok () {
            let config = {
                data:{
                    "sysUserAccount":this.userName,
                    "planType":"秋溜溜"
                },
                headers: Headers.json      
            };
            systemconfig.addSelfWorkdays(config).then(res =>{
               // var time = formatLocalDate(new Date(),"yyyy-MM-dd");                
                if(res.code == '0'){
                    res.resultData;
                    //点击新增保存列表新增一个自定义工作日
                    this.weekdays.push({
                       dayname:this.daytext,//工作日名称变为输入的名称
                       datapick:this.dataslot,//设置日期选择
                       timepick:this.timeslot,//设置时间选择
                    })
                    this.$Message.info('新增工作日成功');
                }
            }, error =>{
                this.$Message.error(error)
            });            
            //this.$Message.info('Clicked ok');
        },
        cancel () {
            this.$Message.info('Clicked cancel');
        }        
    },
    computed: {
        userName: {
            get(){
                return this.$store.state.userName;
            },
            set(val){
                this.$store.dispatch('setUserName', val);
            }
        },
        curPwd: {
            get(){
                return this.$store.state.password;
            },
            set(val){
                this.$store.dispatch('setPassword', val);
            }
        }
    },
    mounted(){
        this.queryWorkdays(1);
        this.queryWorkdays(2);
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
.workdays-tbl{
    .submit-btn{
        border-bottom: 1px solid #EBEDF0;
        text-align: right;
        margin-right: 20px;
        padding-bottom: 30px;
    }
}
</style>