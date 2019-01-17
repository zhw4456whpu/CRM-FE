<template>
    <div class="customer">
        <Tabs value="customer" @on-click="changeTab">
            <TabPane label="客户列表" name="customer">
                <Row style="margin-bottom:20px;">
                    <Col span='5' >
                        <Input v-model="searchKey" icon="ios-search-strong" placeholder="请输入用户昵称" style="width: 300px"></Input>
                    </Col>
                    <!-- <Col span="4">
                        <Select v-model="model1" style="width:200px">
                            <Option v-for="(item,index) in ckList" :value="item.dictValCode" :key="index">{{ item.dictVal }}</Option>
                        </Select>                
                    </Col> -->
                    <Col span="3" class="button">
                        <Button type="primary" @click="search">查询</Button>
                        <Button @click="reset">重置</Button>
                    </Col>
                </Row>
                <x-table :data="customerData" :show-header="showHeader" ref="default" no-data-text="没有数据">
                    <x-table-column title="客户昵称" prop="nickName"></x-table-column>
                    <x-table-column title="客户ID" prop="busiId"></x-table-column>
                    <!-- <x-table-column title="客户标签" prop="customerTag"></x-table-column> -->
                    <x-table-column title="手机号" prop="customerPhone">
                        <template slot-scope="scope">
                            {{scope.customerPhone?scope.customerPhone.replace(/(\d{3})(\d{4})(\d{4})/,'$1****$3'):''}}
                        </template>
                    </x-table-column>
                    <x-table-column title="QQ号" prop="customerQq"></x-table-column>
                    <x-table-column title="邮箱" prop="customerEmail"></x-table-column>
                    <x-table-column title="微信" prop="customerWechat"></x-table-column>
                    <x-table-column title="描述" prop="remark"></x-table-column>
                    <x-table-column title="操作">
                        <template slot-scope="scope">
                            <Button type="text" size="large" @click="edit(scope)" icon="edit" title="编辑">编辑</Button>
                            <Button type="text" size="large" @click="addBlack(scope)" icon="edit" title="加入黑名单">加入黑名单</Button>
                        </template>
                    </x-table-column>
                </x-table>
                <Page :total="total" @on-change="changePageNum" :page-size="pageSize" style="text-align:right;margin: 10px 0px;"></Page> 
                <Modal
                    v-model="modalShow"
                    :title="modalTitle"
                    @on-ok="ok"
                    @on-cancel="cancel"
                    :okText="okText"
                    cancelText="取消">                
                    <Form
                    :model="formRight" 
                    ref="formRight"
                    :rules="ruleValidate"                      
                     label-position="right" :label-width="100" style="margin-right:40px;">
                        <FormItem label="客户昵称" prop="nickName">
                            <Input v-model="formRight.nickName" v-show="operation=='edit'"></Input>
                            <Row v-show="operation=='addBlack'">{{formRight.nickName}}</Row>
                        </FormItem>
                        <FormItem label="客户ID" prop="busiId">
                            <Input v-model="formRight.busiId"  disabled v-show="operation=='edit'"></Input>
                            <Row v-show="operation=='addBlack'">{{formRight.busiId}}</Row>
                            <!-- <Row>{{formRight.busiId}}</Row> -->
                        </FormItem>
                        <FormItem label="手机号" prop="customerPhone">
                            <Input v-model="formRight.customerPhone" disabled  v-show="operation=='edit'"></Input>
                            <Row v-show="operation=='addBlack'">{{formRight.customerPhone}}</Row>
                            <!-- <Row>{{formRight.customerPhone}}</Row> -->
                        </FormItem>
                        <FormItem label="邮箱" prop="customerEmail">
                            <Input v-model="formRight.customerEmail" v-show="operation=='edit'"></Input>
                            <Row v-show="operation=='addBlack'">{{formRight.customerEmail}}</Row>
                        </FormItem>
                        <FormItem label="微信" prop="customerWechat">
                            <Input v-model="formRight.customerWechat" v-show="operation=='edit'"></Input>
                            <Row v-show="operation=='addBlack'">{{formRight.customerWechat}}</Row>
                        </FormItem> 
                        <FormItem label="描述" prop="remark">
                            <Input v-model="formRight.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" 
                                :placeholder="operation=='edit'?'暂无':'请在此处输入加入黑名单的描述'"></Input>
                        </FormItem>                                                           
                    </Form> 
                    <div slot="footer">
                        <Button type="text" size="large" @click="modalShow=false">取消</Button>
                        <Button type="primary" size="large" @click="ok()">确定</Button>
                    </div>                                   
                </Modal>                       
            </TabPane>
            <TabPane label="黑名单客户" name="blackList">
                <x-table :data="blackList" :show-header="showHeader" ref="default" no-data-text="没有数据">
                    <x-table-column title="客户昵称" prop="nickName"></x-table-column>
                    <x-table-column title="客户ID" prop="busiId"></x-table-column>
                    <x-table-column title="描述" prop="blackReason"></x-table-column>
                    <x-table-column title="操作">
                        <template slot-scope="scope">
                            <Button type="text" size="large" @click="delBlack(scope)" icon="edit" title="移除黑名单">移除黑名单</Button>
                        </template>
                    </x-table-column>
                </x-table>
                <Page :total="bTotal" @on-change="changeBlackPageNum" :page-size="pageSize" style="text-align:right;margin: 10px 0px;"></Page>
            </TabPane>
     </Tabs>          
    </div>
</template>
<script>
import xTable from "@/components/common/xTable";
import xTableColumn from "@/components/common/xTableColumn";
import customerApi from '../../service/customerApi'
import {Headers} from '../common/Consts.js';
import { isNull } from '../../utils'
export default {
    data () {
        return {
            bTotal: 0,
            total: 0,
            operation: '',
            okText: '',
            modalTitle: '',
            showHeader: true,
            pageSize: 10,
            pageNum: 1,
            searchKey: '',
            modalShow: false,
            dataCount:0,          
                //加入黑名单
            formRight: {},
            customerData: [],                
            blackList: [],
            ckList: [   ],
            // model1: '',
            ruleValidate: {
                nickName:[
                    {required: true, message: '客户昵称不能为空', trigger: 'blur'},
                     {type:'string',max:50, message: '字符长度最多不超过50个',}
                    ],
                customerEmail:[
                    {type:'email', message: '邮箱格式不正确', trigger: 'blur'},
                    ],   
                customerWechat:[{type:'string',max: 20, message: '字符长度最多不超过20个',trigger: 'blur'}],                      
                remark:[
                    {required: true, message: '请输入描述', trigger: 'blur' },
                    {type:'string',max: 200, message: '字符长度最多不超过250个',trigger: 'blur'}
                    ],                    
            },                            
        }
    },
    components:{
        xTable,xTableColumn
    },
    methods: {
        changeBlackPageNum(val){
            this.blackList.splice(0,this.blackList.length);
            this.pageNum = val;
            this.queryBlackUserForPage();
        },
        //翻页
        changePageNum(val){
            this.customerData.splice(0,this.customerData.length);
            this.pageNum = val;
            this.queryUserInfo();
        },
        /**黑名单客户信息分页查询 */
        queryBlackUserForPage(){
            let config = {
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                },
                headers: Headers.urlencoded
            }
            customerApi.queryBlackUserForPage(config).then(res =>{
                if(res.code == '0'){
                    this.blackList = res.resultData.list;
                    this.blackList.map((i,x) =>{
                        if(isNull(i.nickName)){
                            i.nickName = '用户' + i.busiId;
                        }
                    });
                    this.bTotal = res.resultData.total;
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**切换客户列表和黑名单客户列表 */
        changeTab(value){
            this.pageNum = 1;
            if(value == 'customer'){
                this.queryUserInfo();
            }else{
                this.queryBlackUserForPage();
            }
        },
        /**搜索 */
        search(){
            this.queryUserInfo({customerName:this.searchKey});
        },
        /**重置 */
        reset(){
            this.searchKey = '';
            //this.model1 = '';
        },
        /**移除黑名单 */
        delBlack(scope){
            let config = {
                data: {
                    customerId: scope.busiId
                },
                headers: Headers.json
            }
            customerApi.delBlack(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('移除黑名单');
                    this.queryBlackUserForPage();
                    this.modalShow = false;
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**添加黑名单 */
        addBlack(scope){
            this.modalShow = true;
            this.modalTitle = '添加黑名单';
            this.okText = '添加黑名单';
            this.operation = 'addBlack';
            this.formRight = scope;
        },
        /**客户信息查询 */
        queryUserInfo(data = {}){
            let tmp = Object.assign({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                },data);
            let config = {
                data: tmp,
                headers: Headers.urlencoded
            }
            customerApi.queryUserInfo(config).then(res =>{
                if(res.code == "0"){
                    this.customerData = res.resultData.list || [];
                    this.customerData.map((i,x) =>{
                        if(isNull(i.nickName)){
                            i.nickName = '用户' + i.busiId;
                        }
                    });
                    this.total = res.resultData.total;
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })
        },
        show (index) {
            this.$Modal.info({
                title: '加入黑名单',
                content: `客户昵称：${this.data1[index].name}<br>用户ID：${this.data1[index].id}<br>手机号：${this.data1[index].phone}<br>email：${this.data1[index].email}<br>微信：${this.data1[index].WeChat}`
            })
        }, 
        edit (scope) {
            this.modalShow = true;
            this.modalTitle = '编辑';
            this.okText = '保存';
            this.operation = 'edit';
            this.formRight = scope;
        },                        
        ok() {
            this.$refs.formRight.validate((valid) =>{
                if (valid) { 
                    if(this.operation == 'edit'){
                        let config = {
                            data: {...this.formRight},
                            headers: Headers.json
                        }
                        customerApi.modifyCustomer(config).then(res =>{
                            if(res.code == '0'){
                                this.$Message.info('修改成功');
                                this.queryUserInfo();
                                this.modalShow = false;
                            }
                            else{
                                this.$Message.warning(res.message);
                            }
                        }, err=>{
                            this.$Message.error(err);
                        })
                    }else if(this.operation == 'addBlack'){
                        let config = {
                            data: {
                                customerId: this.formRight.busiId,
                                reason: this.formRight.remark
                            },
                            headers: Headers.json
                        }
                        customerApi.addBlack(config).then(res =>{
                            if(res.code == '0'){
                                this.$Message.info('加入黑名单成功');
                                this.queryUserInfo();
                                this.modalShow = false;
                            }
                            else{
                                this.$Message.warning(res.message);
                            }
                        }, err=>{
                            this.$Message.error(err);
                        })
                    }
                }
            })              
        },
        cancel () {
            this.modalShow = false;
        },
        /**查询客户标签 */
        queryTag(){
            let config = {
                data: {
                    dictTypeCode: 'CUSTOMER_TAG'
                },
                headers: Headers.json
            }
            customerApi.queryPrivateTagByTenant(config).then(res =>{
                if(res.code == '0'){
                    this.ckList = res.resultData;
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
    },
    mounted(){
        this.queryUserInfo({});
        this.queryTag();
    }    
}
</script>
<style lang="less">
.customer{
    background-color: white;
    padding: 0px 40px;
    h3{
        margin-bottom:25px;
    }
    .ivu-tabs-nav-container{
        height: 60px;
        line-height: 60px;
    }
}
</style>


