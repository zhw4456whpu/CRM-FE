<template>
    <div class="system-switch">
        <!-- 自动消息设置 -->
        <Form 
        :model="formItem" 
        ref="formItem"
        :rules="ruleValidate"         
        :label-width="90" 
        class="system-info">
            <Row class="form-title">自动消息设置</Row>
            <FormItem label="调度员呢称" prop="configBody.dispatcherName">
                <Input v-model="formItem.configBody.dispatcherName" placeholder="请输入调度员呢称!"></Input>
            </FormItem>
            <Row class="form-title">
                <Row class="title">
                    <Col span="12">企业问候语</Col>
                    <Col span="12" style="text-align:right;">
                        <i-switch v-model="formItem.configBody.greetingSwitch" :true-value="trueVal" :false-value="falseVal" @on-change="switchChange">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </Col>
                </Row>
                <Row class="tips">访客发起新的会话时，将在发送首条消息之后收到系统自动发送的企业问候语</Row>
                <FormItem prop="configBody.greetings">
                    <Input v-model="formItem.configBody.greetings" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入企业问候语"></Input>
                </FormItem>
                <Row class="tips">在问候语中填入##亲##，可以实现访客昵称的显示，如果访客的昵称是无效的会显示##里面的内容，当然##里面的内容您可以自己定制。</Row>
            </Row>
            <Row class="form-title">
                <Row class="title">
                    <Col span="12">会话结束语</Col>
                    <Col span="12" style="text-align:right;">
                        <i-switch v-model="formItem.configBody.endMsgSwitch" :true-value="trueVal" :false-value="falseVal" @on-change="switchChange">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </Col>
                </Row>
                <Row class="tips">会话结束后，系统自动发出结束语</Row>
                <FormItem prop="configBody.endMsg">
                    <Input v-model="formItem.configBody.endMsg" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入会话结束语"></Input>
                </FormItem>
                <Row class="tips"></Row>
            </Row>
            <FormItem>
                <Col style="text-align:right;">
                    <Button type="primary" @click="submit">保存</Button>
                </Col>
            </FormItem>
        </Form>
       <!-- 客服超时未回复设置 -->
        <Form 
        :model="customerForm" 
        ref="customerForm"
        :rules="ruleValidate"
        :label-width="90"
        class="customer-info">
            <Row class="form-title">
                <Row class="title">
                    <Col span="12">客服超时未回复设置</Col>
                </Row>
                <FormItem label="超时时间">
                    <Col span="2">
                        <InputNumber
                            v-model="customerForm.hours"
                            :min="min"
                            :formatter="value => `${value> 9?value:'0'+value}`"
                            :parser="value => parseInt(value)">
                        </InputNumber>
                        时
                    </Col>
                    <Col span="2">
                        <InputNumber
                            :max=59
                            :min="min"
                            v-model="customerForm.minitues"
                            :formatter="value => `${value> 9?value:'0'+value}`"
                            :parser="value => parseInt(value)">                            
                        </InputNumber>
                        分
                    </Col>
                    <Col span="2">
                        <InputNumber
                            :max=59
                            :min="min"
                            v-model="customerForm.seconds"
                            :formatter="value => `${value> 9?value:'0'+value}`"
                            :parser="value => parseInt(value)">                            
                        </InputNumber>
                        秒
                    </Col>
                </FormItem>
                <!--<Row class="title">
                    <Col span="12">提醒客服</Col>
                    <Col span="12" style="text-align:right;">
                        <i-switch v-model="customerForm.configBody.seatRemindSwitch" :true-value="trueVal" :false-value="falseVal" @on-change="switchChange">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </Col>
                </Row>
                <Row class="tips">开关打开时，客服超时未回复会话会主动排在坐席会话列表的顶部并标注颜色</Row>-->
                <Row class="title">
                    <Col span="12">提醒访客</Col>
                    <Col span="12" style="text-align:right;">
                        <i-switch v-model="customerForm.configBody.seatRemindCustomerSwitch" :true-value="trueVal" :false-value="falseVal"  @on-change="switchChange">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </Col>
                </Row>
                <Row class="tips">访客发送消息后，若客服超过设定时间未回复，系统将自动发送以下提示语给访客</Row>
                <FormItem prop="configBody.seatRemindCustomerMsg">
                    <Input v-model="customerForm.configBody.seatRemindCustomerMsg" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注信息"></Input>
                </FormItem>
            </Row>
            <!--<Row class="form-title">
                <Row class="title">
                    <Col span="12">告警记录</Col>
                    <Col span="12" style="text-align:right;">
                        <i-switch v-model="customerForm.configBody.seatAlarmRecordSwitch" :true-value="trueVal" :false-value="falseVal"  @on-change="switchChange">
                            <span slot="open">开</span>
                            <span slot="close">关</span> 
                        </i-switch>
                    </Col>
                </Row>
                <Row class="tips">开关打开时，管理员可以在告警记录页面看到客服超时未回复的统计和记录</Row>
            </Row>  -->
            <FormItem>
                <Col style="text-align:right;">
                    <Button type="primary" @click="submitCustomer">保存</Button>
                </Col>
            </FormItem>                      
        </Form>
        <!-- 访客超时未回复设置 -->
        <Form 
        :model="visitorForm"
        ref="visitorForm"
        :rules="ruleValidate"        
        :label-width="80"
        class="visitor-info">
            <Row class="form-title">
                <Row class="title">
                    <Col span="12">访客超时未回复自动结束会话</Col>
                    <Col span="12" style="text-align:right;">
                        <i-switch v-model="visitorForm.configBody.customerTimeoutSwitch" :true-value="trueVal" :false-value="falseVal" @on-change="switchChange">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch> 
                    </Col>
                </Row>
            </Row>
            <Row class="tips">
                开关打开时，如果访客在设定时间内没有回复消息，系统将自动发送提示语给访客，发送最后一次提示语后访客在设定时间内如果仍未回复，会话将自动结束。
                开关关闭时，不会发送提示语，会话也不会自动结束。如果会话提示语设置为空，表示不发送提示语。
            </Row>
            <FormItem  label="访客未回复超时时间" :label-width="140">
                <Col span="2">
                    <InputNumber
                        :max="10000"
                        v-model="visitorForm.hours"
                        :min="min"
                        :formatter="value => `${value> 9?value:'0'+value}`"
                        :parser="value => parseInt(value)">                        
                    </InputNumber>
                    时
                </Col>
                <Col span="2">
                    <InputNumber
                        v-model="visitorForm.minitues"
                        :max=59
                        :min="min"
                        :formatter="value => `${value> 9?value:'0'+value}`"
                        :parser="value => parseInt(value)">                        
                    </InputNumber>
                    分
                </Col>
            </FormItem>
            <!--<FormItem label="提醒次数">
                <Col span="4">
                    <InputNumber
                        :max=59
                        :min=0
                        v-model="visitorForm.configBody.customerRemindNum"
                        :formatter="value => `${value> 9?value:'0'+value}`"
                        :parser="value => parseInt(value)">                       
                    </InputNumber>
                </Col>
            </FormItem>-->
            <Row class="form-title">超时提示语</Row>
            <FormItem prop="configBody.customerTimeoutMsg">
                <Input v-model="visitorForm.configBody.customerTimeoutMsg" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入超时提示语"></Input> 
            </FormItem>
            <Row style="margin-top:10px;">
                <span>最后一次提示语发出</span>
                <span>
                    <InputNumber
                        :max="10000"
                        v-model="visitorForm.lasthours"
                        :min="min"
                        :formatter="value => `${value> 9?value:'0'+value}`"
                        :parser="value => parseInt(value)">                        
                    </InputNumber>
                    时
                </span>
                <span>
                    <InputNumber
                        :max=59
                        :min="min"
                        v-model="visitorForm.lastminitues"
                        :formatter="value => `${value> 9?value:'0'+value}`"
                        :parser="value => parseInt(value)">                        
                    </InputNumber>
                    分钟
                </span>
                <span>
                后访客仍未回复将自动结束会话，自动会话结束时，将同时为该会话添加以下标签和备注：
                </span>
            </Row>
             <Row>
                <Col style="text-align:left;">
                    <Row class="select-tag" v-show="visitorForm.configBody.endParentSessionTagName && visitorForm.configBody.endSessionTagName">
                        <Tag closable color="green" @on-close="closeTag">
                            {{visitorForm.configBody.endParentSessionTagName + '>' + visitorForm.configBody.endSessionTagName}}
                        </Tag>
                    </Row>
                    <Button type="primary" style="margin:10px 0px;" @click="addTag('popup')">+会话标签和备注</Button>
                    <Modal v-model="addTagModal" title="会话标签和备注" @on-ok="addTag('save')" >
                        <Row>
                            <Row >添加会话标签和备注</Row>
                            <Row>
                                <Input v-model="searchKey" placeholder="标签和备注" class="search">
                                    <Button slot="append" icon="ios-search" @click="search(searchKey)"></Button>
                                </Input>
                            </Row>
                            <Row class="tag-list">
                                <Col span="12">
                                    <Row v-for="(item,index) in tagList" :key="index" class="tag" @click.native="selectTag(item)">
                                        <Col span="20">{{item.tagName}}</Col>
                                        <Col span="4">
                                            <div class="tag-color"></div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span="12" style="padding:0px 5px;" v-show="showSubTag">
                                    <Row class="tag" v-for="(ci,cx) in curSubTagList" :key="cx" @click.native="selectTag(ci)">{{ci.tagName}}</Row>
                                </Col>
                            </Row>
                            <Row class="selected-tag">
                                <template v-for="(item,index) in selectedTag">
                                    <template v-if="item.children && item.children.length > 0">
                                        <Tag closable color="blue" v-for="(sitem,sindex) in item.children" :key="sindex">{{item.tagName + '>' + sitem.tagName}}</Tag>
                                    </template>
                                    <template v-else>
                                        <Tag closable color="blue">{{item.tagName}}</Tag>
                                    </template>
                                </template>
                            </Row>
                            <Row class="remark">
                                <Input type="textarea" v-model="remarkText" row="3" placeholder="备注"></Input>
                            </Row>
                        </Row>
                    </Modal>
                </Col>
            </Row> 
            <FormItem>
                <Col style="text-align:right;">
                    <Button type="primary" @click="submitVisitor">保存</Button>
                </Col>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import systemconfigApi from '../../service/systemconfigApi';
import {formatDate} from '../../utils'
import {Headers} from '../common/Consts.js';
    export default {
        data () {
            return {
                trueVal: "0",
                falseVal: "1",
                min: 0,
                searchKey: '',
                tagList: [],
                showSubTag: false,
                curSubTagList: [],
                selectedTag: [],
                remarkText: '',
                addTagModal: false,
                busiId: '',
                tenantId: '',
                formItem: {
                    configType:'1',
                    configBody:{
                        dispatcherName: "",  //调度员呢称
                        endMsgSwitch : 1,  //会话结束语开关  0开 1关
                        endMsg : "",  //会话结束语
                        greetingSwitch :1, //企业问候语开关 0开 1关
                        greetings :"" //企业问候语
                    }
                },
                customerForm:{
                    hours: 0,
                    minitues: 0,
                    seconds: 1,
                    configType:'2',
                    configBody:{
                        seatTimeout : "", //客服超时未回复设置 超时时间，换算成秒
                        seatRemindSwitch :1, //提醒客服开关 0开 1关
                        seatRemindCustomerSwitch : "1",//提醒访客开关 0开 1关
                        seatRemindCustomerMsg :"",//提醒访客内容
                        seatAlarmRecordSwitch :1 //告警记录开关 0开 1关
                    }                    
                },
                visitorForm: {
                    hours: 0,
                    minitues: 0,
                    seconds: 0,
                    lasthours: 0,
                    lastmintues: 0,
                    configType:'3',
                    configBody:{
                        customerTimeoutSwitch : "1", //访客超时未回复自动结束会话开发 0开 1关 
                        customerTimeout :'', //访客未回复超时时间,换算成秒
                        customerRemindNum :0, //提醒次数
                        customerTimeoutMsg :"", //超时提示语
                        customerLastTimeout :'', //最后一次提示语发出时间设置，换算成秒
                    }                       
                },
                ruleValidate: {
                    "configBody.dispatcherName":[
                        {type:'string',max:50, message: '客服昵称最多不超过50个',}
                        ],
                   "configBody.endMsg":[
                            {type:'string',max:100, message: '字符长度最多不超过100个',trigger: 'blur'}
                        ],
                    "configBody.greetings":[
                        {type:'string',max:100, message: '字符长度最多不超过100个',trigger: 'blur'}
                        ],
                    "configBody.seatRemindCustomerMsg":[
                            {type:'string',max: 200, message: '字符长度最多不超过200个',trigger: 'blur'}
                        ],
                    "configBody.customerTimeoutMsg":[
                            {type:'string',max:200, message: '字符长度最多不超过200个',trigger: 'blur'}
                        ],
                },                 
            }
        },
        methods:{
            /**关闭tag */
            closeTag(){
                this.selectedTag.splice(0,this.selectedTag.length);
                this.visitorForm.configBody.endSessionTagCode = '';
                this.visitorForm.configBody.endSessionTagName = '';
                this.visitorForm.configBody.endParentSessionTagCode = '';
                this.visitorForm.configBody.endParentSessionTagName = '';
            },
            /** 查询会话标签**/
            querySessionTag(tagType){
                let config = {
                    data: {
                    parentCode: tagType == 'root'?'0':this.parentCode
                    },
                    headers: Headers.json
                }
                systemconfigApi.querySessionTag(config).then(res =>{
                    if(res.code == '0'){
                        if(tagType == 'root'){
                            this.tagList =  res.resultData;
                        }else{
                            this.subTagList = res.resultData;
                        }
                    }else{
                        this.$Message.warning(res.message);
                    }
                },err=>{
                    this.$Message.error(err);
                })
            }, 
            /**添加标签 */
            addTag(type){
                if(type == 'popup'){
                    this.addTagModal = true;
                    this.querySessionTag('root');
                    this.querySessionTag('child');
                }
                else{
                    let secTag = {};
                    this.selectedTag[0].children.map((i,x) =>{
                        secTag.endSessionTagCode = i.tagCode;
                        secTag.endSessionTagName = i.tagName;
                    });
                    secTag.endParentSessionTagCode = this.selectedTag[0].tagCode;
                    secTag.endParentSessionTagName = this.selectedTag[0].tagName;
                    secTag.endSessionRemark = this.remarkText;
                    this.visitorForm.configBody = Object.assign(this.visitorForm.configBody, secTag);
                }
            },
            /**单击标签、子标签 */
            selectTag(tag){
                if(tag.parentCode == '0' ){
                    this.showSubTag = true;
                    this.curSubTagList = this.subTagList.filter((i,x) =>{
                        return i.parentCode == tag.tagCode?true:false;
                    })
                }
                else{
                    this.selectedTag.splice(0,this.selectedTag.length);
                    this.tagList.map((i,x) =>{
                        if(i.tagCode == tag.parentCode){
                            i.children = [];
                            i.children.push(tag);
                            this.selectedTag.push(i);
                        }
                    });
                }
            },
            /** 系统设置-系统开关查询**/
            querySysConfigByTenantId(){
                var _this = this;
                let config = {
                    data: {
                        
                    },
                    headers: Headers.json
                }
                systemconfigApi.querySysConfigByTenantId(config).then(res =>{
                    if(res.code == '0'){
                        res.resultData.map((item,index) =>{
                            if(item.configType == "1"){
                                item.configBody = JSON.parse(item.configBody);
                                let keys = Object.keys(item.configBody);
                                keys.map((i,x) =>{
                                    if(i.indexOf('switch') > -1){
                                        i = i + '';
                                    }
                                })
                                _this.formItem = item;           
                            } 
                            if(item.configType == "2"){
                                item.configBody = JSON.parse(item.configBody);
                                let keys = Object.keys(item.configBody);
                                keys.map((i,x) =>{
                                    if(i.indexOf('switch') > -1){
                                        i = i + '';
                                    }
                                })
                                _this.customerForm = item;
                                if(item.configBody.seatTimeout){
                                    let h = parseInt(item.configBody.seatTimeout/3600);
                                    let m = parseInt((item.configBody.seatTimeout - h * 3600)/60);
                                    let s = item.configBody.seatTimeout % 60
                                    this.customerForm.hours= h ;
                                    this.customerForm.minitues= m ;
                                    this.customerForm.seconds= s ;
                                 }
                            } 
                            if(item.configType == "3"){
                                item.configBody = JSON.parse(item.configBody);
                                let keys = Object.keys(item.configBody);
                                keys.map((i,x) =>{
                                    if(i.indexOf('switch') > -1){
                                        i = i + '';
                                    }
                                })
                                _this.visitorForm =item;
                                if(item.configBody.customerTimeout){
                                    let h = parseInt(item.configBody.customerTimeout/3600);
                                    let m = parseInt((item.configBody.customerTimeout - h * 3600)/60);
                                    this.visitorForm.hours= h ;
                                    this.visitorForm.minitues= m ;

                                    let lasth = parseInt(item.configBody.customerLastTimeout/3600);
                                    let lastm = parseInt((item.configBody.customerLastTimeout - lasth * 3600)/60);
                                    this.visitorForm.lasthours= lasth ;
                                    this.visitorForm.lastminitues= lastm ;
                                }
                            }
                        });                  
                    }
                })
            },
            switchChange(status){},
            submit(){
                //保存1
                this.$refs.formItem.validate((valid) =>{
                    if(valid) {
                        let config = {
                            data:{
                                busiId: this.formItem.busiId,
                                tenantId: this.formItem.tenantId,
                                configBody: JSON.stringify(this.formItem.configBody),
                                configType: this.formItem.configType,
                            },
                            headers: Headers.json
                        }
                        systemconfigApi.saveBusiSysConfig(config).then(res =>{
                            if(res.code == '0'){
                                this.$Message.info('自动消息设置成功')
                                this.querySysConfigByTenantId()
                            }else{
                                this.$Message.warning(res.message);
                            }
                        },err=>{
                            this.$Message.error(err);
                        })
                    }
                })                

            },
            submitCustomer(){
                //保存2
                this.customerForm.configBody.seatTimeout = this.customerForm.hours * 3600 + this.customerForm.minitues * 60 + this.customerForm.seconds;
                this.$refs.customerForm.validate((valid) =>{
                    if(valid) {
                            let config = {
                                data:{
                                    busiId: this.customerForm.busiId,
                                    tenantId: this.customerForm.tenantId,
                                    configBody: JSON.stringify(this.customerForm.configBody),
                                    configType: this.customerForm.configType,
                                },
                                headers: Headers.json
                            }
                            systemconfigApi.saveBusiSysConfig(config).then(res =>{
                                if(res.code == '0'){
                                    this.$Message.info('客服超时未回复设置成功');
                                    this.querySysConfigByTenantId();
                                }else{
                                    this.$Message.warning(res.message);
                                }
                            },err=>{
                                this.$Message.error(err);
                            })
                    }
                    })
                },            
                //保存3
                submitVisitor(){
                    //访客未回复超时间
                    this.visitorForm.configBody.customerTimeout = this.visitorForm.hours*3600 + this.visitorForm.minitues*60;
                    this.visitorForm.configBody.customerLastTimeout = this.visitorForm.lasthours*3600 + this.visitorForm.lastminitues*60;                             
                    this.$refs.visitorForm.validate((valid) =>{
                        if(valid) {
                            let config = {
                                data:{
                                    busiId: this.visitorForm.busiId,
                                    tenantId: this.visitorForm.tenantId,
                                    configBody: JSON.stringify(this.visitorForm.configBody),
                                    configType: '3',
                                },
                                headers: Headers.json
                            }
                            systemconfigApi.saveBusiSysConfig(config).then(res =>{
                                if(res.code == '0'){
                                    this.$Message.info("访客超时未回复自动结束会话设置成功");
                                    this.querySysConfigByTenantId()
                                }else{
                                    this.$Message.warning(res.message);
                                }
                            },err=>{
                                this.$Message.error(err);
                            })
                        }
                })                
            }
        },
        mounted(){
           this.querySysConfigByTenantId()
        }
    }
</script>
<style lang="less" scoped>
.tag-list{
    background-color: #f5f7fa;
    padding: 5px;
    .tag{
        height: 32px;
        line-height: 32px;
        background-color: white;
        border-radius: 5px;
        margin-bottom: 10px;
        text-align: left;
        padding-left: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        >div{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .tag-color{
            border-radius:50%;
            width:18px;
            height:18px;
            background-color: blue;
            margin: 7px;
        }
    }
    
}
.system-switch{
    .tips{
        font-size: 12px;
        color: #909090;
        font-weight: normal;
        text-align: left;
    }
    .form-title{
        font-size: 18px;
        font-weight: bold;
        line-height: 37px;
        text-align: left;
    }
    .ivu-form-item-content{
        float: right;
    }
    .system-info{
        background: #fff;
        border-radius:5px;
        padding:24px;
        
        .ivu-icon.ivu-icon-ios-lock-outline.ivu-input-icon.ivu-input-icon-normal::before{
            content: "\F174";
            font-family: Ionicons;
        }
        
    }

    .visitor-info,.customer-info{
        margin-top: 15px;
        background: #fff;
        border-radius:5px;
        padding:24px;
        .select-tag{
            height: 60px;
            line-height: 60px;
            
        }
    }
}

</style>
