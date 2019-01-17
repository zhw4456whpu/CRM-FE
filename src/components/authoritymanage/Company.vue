<template>
    <div class="company">
        <Row class="company-header">
            <Col span="12" class="header-title">租户列表</Col>
            <Col span="12" style="text-align:right;padding-right: 40px;">
                <Button type="primary" icon="plus-round" @click="addCompany">新增租户</Button>
            </COl>
        </Row>
        <Row class="company-list">
            <x-table :data="curPageData" :show-header="showHeader" no-data-text="没有数据">
                <x-table-column title="租户名称">
                    <template slot-scope="scope">
                        <Row class="company-name">
                            <span v-model="scope.tenantName"><img :src="scope.tenantLogo" style="width:32px;height:32px;vertical-align:middle;margin-right:5px;border:0px;border-radius:4px;"/>{{scope.tenantName}}</span>
                        </Row>
                    </template>
                </x-table-column>
                <x-table-column align="center" title="启用状态" prop="enableStatus">
                    <template slot-scope="scope">
                        <Checkbox v-model="scope.enableStatus==0"></Checkbox>
                    </template>
                </x-table-column>
                <x-table-column title="租户属性">
                    <template slot-scope="scope">
                        {{scope.tenantType==1?'平台':scope.tenantType==2?'外部租户':'系统租户'}}
                    </template>
                </x-table-column>
                <x-table-column title="联系电话" prop="tenantPhone"></x-table-column>
                <x-table-column title="在线客服坐席上限"  prop="maxSeatNum"></x-table-column>
                <x-table-column title="地址" prop="tenantAddress"></x-table-column>
                <x-table-column title="操作">
                    <template slot-scope="scope">
                        <Button type="text" size="large" @click="editCompany(scope)" icon="edit" title="修改"></Button>
                        <Button type="text" size="large" @click="delCompany(scope)" icon="trash-a" title="删除"></Button>
                    </template>
                </x-table-column>
            </x-table>
        </Row>
        <Row class="page">
            <Page :total="totalNum" :current="pageNum" @on-change="changePageNum"></Page>
        </Row>
        <Modal
            v-model="showModal"
            :title="operation=='add'?'新增租户':operation=='edit'?'编辑租户':'删除租户'"
            @on-cancel="cancel">
            <Form 
            ref="formItem"
            :model="formItem"
            :rules="ruleValidate">
                <Row v-show="operation=='add' || operation=='edit'">
                    <Row class="add-company">
                        <Col span="4">租户名称</Col>
                        <Col span="18">
                            <FormItem prop="tenantName">
                                    <Input v-model="formItem.tenantName"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row class="add-company">
                        <Col span="4">启用状态</Col>
                        <Col span="18">
                            <RadioGroup v-model="formItem.enableStatus">
                                <Radio label=0>启用</Radio>
                                <Radio label=1>不启用</Radio>
                            </RadioGroup>    
                        </Col>
                    </Row>
                    <Row class="add-company">
                        <Col span="4">租户属性</Col>
                        <Col span="18">
                        <FormItem prop="tenantType">
                            <Select v-model="formItem.tenantType">
                                <!-- <Option value='1'>平台</Option> -->
                                <Option value='2'>外部租户</Option>
                                <Option value='3'>系统租户</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="add-company">
                        <Col span="4">联系电话</Col>
                        <Col span="18">
                            <FormItem prop="tenantPhone">
                                <Input v-model="formItem.tenantPhone"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row class="add-company">
                        <Col span="4">坐席上限</Col>
                        <Col span="18">
                            <FormItem prop="maxSeatNum">
                                <Input type="text" v-model="formItem.maxSeatNum"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row class="add-company">
                        <Col span="4">地址</Col>
                        <Col span="18">
                            <FormItem prop="tenantAddress">
                                <Input v-model="formItem.tenantAddress"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Row>
            </Form>
            <Row v-show="operation=='del'">
                确定删除租户信息吗？
            </Row>
            <div slot="footer">
                <Button type="text" size="large" @click="cancel">取消</Button>
                <Button type="primary" size="large" @click="ok(operation)" :disabled="disabledBtn">确定</Button>
            </div>            
        </Modal>
    </div>
</template>
<script>
import xTable from "@/components/common/xTable";
import xTableColumn from "@/components/common/xTableColumn";
import company from '../../service/companyApi';
import crypto from 'crypto';
import {Headers, ADUQ_Success, ADUQ_Failed} from '../common/Consts.js';
export default {
    name: 'Company',
    components: {
        xTable,
        xTableColumn
    },
    data(){
        const validatemaxSeatNum = (rule, value, callback) => {
            if (!Number.isInteger(+value)) {
                callback(new Error('请输入数字值'));
            }else if(value <= 0 || value > 9999) {
                callback(new Error('请输入0-9999的数字'));
            } else {
                callback();
            }
        };
        return {
            disabledBtn: false,
            totalNum: 0,
            sysId: '',//租户id
            operation: '',
            modalTitle: '',
            ruleValidate: {
                tenantName:[
                    {required: true, message: '租户名称不能为空', trigger: 'blur' },
                    {type:'string',max:20, message: '字符长度最多不超过20个',}
                    ],
                tenantType:[{required: true, message: '请选择租户属性', trigger: 'change' },],
                tenantPhone:[
                        { required: true, message: '联系电话不能为空', trigger: 'blur' },
                        { type: 'string', pattern: /^((0\d{2,3}-\d{7,8}(-\d{3,4})?)|(1[35847]\d{9}))$/, message: '手机号输入格式不正确', trigger: 'blur' }
                    ],
                maxSeatNum:[
                        {required: true, message: '坐席上限不能为空', trigger: 'blur'},
                        {validator: validatemaxSeatNum, trigger: 'blur', trnsform(value){
                            return Number(value);
                        }},
                    ],
                tenantAddress:[
                    {required: true, message: '地址不能为空', trigger: 'blur' },
                    {type:'string',max: 50, message: '字符长度最多不超过50个',}

                    ],                
            }, 
            formItem: {
                tenantName: '',
                enableStatus: '0', //租户启用状态 0：启用 1：未启用
                tenantType: 3,//租户类型 1:平台 2：外部租户 3：系统租户
                tenantPhone: '',
                maxSeatNum: '',
                tenantAddress: '',
            },
            showModal: false,
            showHeader: true,
            curPageData: [],
            pageNum: 1,
            pageSize: 10
        }
    },
    methods: {
        /**新增租户 */
        addCompany(){
            this.showModal = true;
            this.modalTitle = '新增租户';
            this.operation = 'add';
            this.sysId = '';
            this.formItem = {};
            this.formItem.enableStatus = '1';//默认不启用
        },
        /**编辑租户 */
        editCompany(company){
            this.showModal = true;
            this.modalTitle = '编辑租户';
            this.operation = 'edit';
            this.formItem = company;
            this.formItem.tenantType = company.tenantType + '';
            this.formItem.enableStatus = company.enableStatus + '';
            this.formItem.maxSeatNum = company.maxSeatNum + '';
            this.sysId = company.sysId;
        },
        /**删除租户 */
        delCompany(company){
            this.showModal = true;
            this.operation = 'del';
            this.sysId = company.sysId;
        },
        /**弹窗确定按钮回调 */
        ok(operation){
            let _this = this;
            if(operation == 'add'){
                _this.$refs.formItem.validate((valid) =>{
                    _this.disabledBtn = true;
                    if (valid) {
                        let config = {
                            data: _this.formItem,
                            headers: Headers.json
                        };
                        company.addCompany(config).then(res =>{
                            if(res.code == '0'){
                                _this.$Message.info(res.message);
                                _this.showModal = false;
                                _this.disabledBtn = false;
                                _this.pageNum = 1;
                                _this.changePageNum(_this.pageNum);
                            }else{
                                _this.$Message.warning(res.message);
                                _this.showModal = true;
                                _this.disabledBtn = false;
                            }
                        }, error =>{
                            _this.$Message.error(error);
                            _this.disabledBtn = false;
                        });
                    } else {
                        _this.showModal = true;
                        _this.disabledBtn = false;
                        // this.$refs.formItem.resetFields();  
                    }
                })
            }
            else if(operation == 'edit'){
                //编辑
                _this.$refs.formItem.validate((valid) =>{
                    if(valid){
                        let config = {
                            data: _this.formItem,
                            headers: Headers.json
                        };
                        company.editCompany(config).then(res =>{
                            if(res.code == '0'){
                                _this.$Message.info(ADUQ_Success.update);
                                _this.showModal = false;
                                _this.pageNum = 1;
                                _this.changePageNum(_this.pageNum);
                                
                            }else{
                                _this.$Message.warning(res.message);
                            }
                        }, error =>{
                            _this.$Message.error(error)
                        });
                    }
                })
            }
            else{
                //删除
                let config = {
                    data: {
                        sysId: _this.sysId
                    },
                    headers: Headers.json
                };
                company.delCompany(config).then(res =>{
                    if(res.code == '0'){
                        _this.$Message.info(ADUQ_Success.delete);
                        _this.showModal = false;
                        _this.pageNum = 1;
                        _this.changePageNum(_this.pageNum);
                    }else{
                        _this.$Message.warning(res.message);
                    }
                }, error =>{
                    _this.$Message.error(error)
                });
            }
        },
        /**弹窗取消按钮回调 */
        cancel(){
            this.changePageNum(this.pageNum);
            this.showModal = false;
        },
        /**分页按钮回调 */
        changePageNum(val){
            this.pageNum = val;
            try{
                let config = {
                    data:{
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    headers: Headers.urlencoded
                }
                company.getCompany(config).then(res =>{
                    if(res.code == '0'){
                        this.totalNum = res.resultData.total;
                        this.curPageData.splice(0,this.curPageData.length);
                        this.curPageData = res.resultData.list;
                    }else{
                        this.$Message.warning(res.message);
                    }
                }, error =>{
                    this.$Message.error(error);
                });
            }
            catch(e){
                this.$Message.error(ADUQ_Failed.query);
            }
        }
    },
    mounted(){
        this.changePageNum(1);
    }
}
</script>
<style lang="less" scoped>
.company{
    background-color: white;
    min-height: 600px;
    .company-header{
        height: 107px;
        line-height: 107px;
        font-size: 18px;
        font-weight: bold;
        .header-title{
            padding-left:40px;
        }
    }
    .company-list{
        text-align: center;
        margin: 0px 40px;
        .company-name{
            line-height: 25px;
            .company-logo{
                width: 20px;
                height: 20px;
            }
        }
    }
    .page{
        text-align: right;
        margin: 10px 40px;
    }
}
.add-company{
    //height: 32px;
    line-height: 32px;
    // margin-bottom: 10px;
}
</style>