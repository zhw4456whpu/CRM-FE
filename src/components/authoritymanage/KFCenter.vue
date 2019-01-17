<template>
    <Row class="kfcenter context">
        <Row class="top">
            <Col span="12" style="font-size:16px;padding-left:40px;font-weight:bold;">客服中心列表</Col>
            <Col span="12" style="text-align: right;padding-right: 10px;">
                <Button type="primary" @click="addCenterBtn" icon="plus">新增客服中心</Button>
                <Modal v-model="showAddCenter" title="新增客服中心">
                    <Form 
                    ref="formItem"
                    :model="formItem" 
                    :rules="ruleValidate" 
                    :label-width="120">
                        <FormItem label="客服中心名称" prop="addCerterName">
                            <Input v-model="formItem.addCerterName" placeholder="请输入客服中心名称" style="width:200px;"></Input>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="text" size="large" @click="showAddCenter=false">取消</Button>
                        <Button type="primary" size="large" @click="addCsCenter" :disabled="disabledBtn">确定</Button>
                    </div>                    
                </Modal>
            </Col>
        </Row>
        <Row>
            <Col span="4" class="center-list">
                <Row class="center-layout">
                    <Row v-for="(item,index) in centerList" :key="index" @click.native="selectCenter(item,index)"
                        :class="{'center-item':true,'selected-center':index == curCenterIndex}">{{item.csCenterName + ' (  ' + centerTenantNum[index] +' 家 )'}}</Row>
                </Row>
            </Col>
            <Col span="20" class="center-info">
                <Tabs value="name1">
                    <TabPane label="客服中心成员" name="name1">
                        <Row class="operation">
                            <Col span="10">
                                <Input icon="search" v-model="searchKey" placeholder="搜索客服中心成员" style="width:200px;" @on-click="search"></Input>
                            </Col>
                            <Col span="14" style="text-align:right;padding-right:10px;">
                                <Button type="primary" @click="manageMember">成员管理</Button>
                                <Modal
                                    v-model="showModal"
                                    title="成员管理"
                                     width="600">
                                    <Row type="flex" justify="center">
                                        <Transfer
                                            :data="srcData"
                                            :target-keys="targetKeys"
                                            :render-format="formatLabel"
                                            :titles="['未加入的租户','已加入的租户']"
                                            @on-change="handleChange">
                                        </Transfer>
                                    </Row>
                                    <div slot="footer">
                                        <!-- <Button type="text" size="large" @click="showModal=false">取消</Button> -->
                                        <!-- <Button type="primary" size="large" @click="addCenterCompany">确定</Button> -->
                                    </div>                                     
                                </Modal>
                            </Col>
                        </Row>
                        <Row class="tenant-list">
                            <x-table :data="curPageData" :show-header="showHeader" ref="default" no-data-text="没有数据">
                                <x-table-column title="租户名称" prop="tenantName"></x-table-column>
                                <x-table-column title="客服组数" prop="csGroupNum"></x-table-column>
                                <x-table-column title="客服人员数" prop="csUserNum"></x-table-column>
                                <x-table-column title="在线客服坐席上限" prop="maxSeatNum"></x-table-column>
                                <x-table-column title="管理员权限范围" prop="managerType">
                                    <template slot-scope="scope">
                                        {{scope.managerType=='1'?'全部':'自有'}}
                                    </template>
                                </x-table-column>
                                <x-table-column title="操作">
                                    <template slot-scope="scope">
                                        <Button type="text" size="large" @click="setOwner(scope)" icon="edit" title="设置为负责租户">设置为负责租户</Button>
                                    </template>
                                </x-table-column>
                            </x-table>
                        </Row>
                        <Row class="page">
                            <Page :total="totalNum" :current="pageNum" @on-change="changePageNum"></Page>
                        </Row>
                    </TabPane>
                    <TabPane label="基础设置" name="name2">
                        <Form 
                        ref="formItemCenter"
                        :label-width="120"
                        :model="formItemCenter" 
                        :rules="ruleValidate">                       
                            <FormItem label="客服中心名称" prop="curCerterName">
                                <Input v-model="formItemCenter.curCerterName" placeholder="请输入客服中心名称" style="width:200px;"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="save" :disabled="disabledBtn">保存</Button>
                                <Button type="ghost" @click="deleteCenter">删除</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
    </Row>
</template>
<script>
import xTable from "@/components/common/xTable";
import xTableColumn from "@/components/common/xTableColumn";
import company from '../../service/companyApi';
import {Headers} from '../common/Consts.js';
export default {
    name: 'KFCenter',
    components: {
        xTable,
        xTableColumn,
    },
    data(){
        return {
            disabledBtn: false,
            curCenter:{},
            formItem:{
                addCerterName: ''
            },
            formItemCenter:{
                curCerterName:''
            },
            showAddCenter: false,
            srcData: [],
            targetKeys: [],
            totalNum: 0,
            curCenterId: '',
            // curCerterName: '',
            pageNum: 1,
            pageSize: 10,
            authorityType: '',
            curCenterIndex: 0,
            centerList:[],
            centerTenantNum:[],
            searchKey:'',
            showModal: false,
            tableData: [],
            curPageData: [],
            showHeader: true,
            ruleValidate: {
                addCerterName:[
                    {required: true, message: '请输入客服中心名称', trigger: 'blur'},
                     {type:'string',max:50, message: '字符长度最多不超过50个',}
                ],
                curCerterName:[
                    {required: true, message: '请输入客服中心名称', trigger: 'blur'},
                     {type:'string',max:50, message: '字符长度最多不超过50个',}
                ],
            },             
        }
    },
    methods: {
        /**搜索 */
        search(){
            if(this.searchKey == ''){
                this.$Message.warning('请输入租户名称');
                return false;
            }
            let config= {
                data: {
                    pageNum : 1,
                    pageSize: this.pageSize,
                    tenantName: this.searchKey,
                    centerId: this.curCenterId 
                },
                headers: Headers.urlencoded
            };
            company.getCenterCompany(config).then(res=>{
                if(res.code == '0'){
                    this.curPageData = res.resultData.list;
                    this.totalNum = res.resultData.total;
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**设置租户为负责租户接口 */
        setOwner(scope){
            let config = {
                data: {
                    csCenterId: this.curCenterId,
                    tenantId: scope.sysId
                },
                headers: Headers.json
            };
            company.setDefaultCompany(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('设置租户为负责租户成功');
                    this.getCenterCompany();
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err)
            })
        },
        /**客服中心删除租户信息接口 */
        removeCenterCompany(tenantList){
            let config = {
                data: {
                    csCenterId: this.curCenterId,
                    tenantList: tenantList
                },
                headers: Headers.json
            };
            company.removeCenterCompany(config).then(res=>{
                if(res.code == '0'){
                    this.selectCenter(this.curCenter, this.curCenterIndex);
                    this.centerTenantNum[this.curCenterIndex] = this.centerTenantNum[this.curCenterIndex] - tenantList.length ;
                    this.$Message.info('客服中心移除租户成功');
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })
        },
        /**客服中心新增租户信息接口 */
        addCenterCompany(tenantList){
            let _this = this;
            _this.disabledBtn = true;
            let config = {
                data: {
                    csCenterId: _this.curCenterId,
                    tenantList: tenantList
                },
                headers: Headers.json
            };
            company.addCenterCompany(config).then(res=>{
                if(res.code == '0'){
                    //this.getCenterCompany(val);.
                    _this.disabledBtn = false;
                    _this.selectCenter(_this.curCenter, _this.curCenterIndex);
                    _this.centerTenantNum[_this.curCenterIndex] = _this.centerTenantNum[_this.curCenterIndex] + tenantList.length;
                    _this.$Message.info('客服中心新增租户成功')
                }else{
                    _this.disabledBtn = false;
                    _this.$Message.warning(res.message);
                }
            },err=>{
                //_this.disabledBtn = false;
                _this.$Message.error(err);
            })
        },
        /**查询已加入客服中心的租户 */
        getCenterAllCompany(){
            let config ={
                data:{
                    csCenterId: this.curCenterId
                },
                headers: Headers.json
            },_this = this;
            company.getCenterAllCompany(config).then(res=>{
                if(res.code == '0'){
                    let tmp = [];
                    tmp = res.resultData.filter((i,x)=>{
                        return i!=null && i!= undefined && i!= ''
                    })
                    tmp = tmp.map(i=>{
                        if(i){
                            return {
                                key: i.sysId?i.sysId:'',
                                label: i.tenantName?i.tenantName:'',
                            }
                        }
                    });
                    let srcDataTmp = _this.srcData.map((i)=>{
                        return {
                            key: i.key?i.key:'',
                            label: i.label?i.label:'',
                        }
                    })
                    _this.srcData = srcDataTmp.concat(tmp);
                    _this.targetKeys = tmp.map(item => item.key);
                }else{
                    _this.$Message.warning(res.message);
                }
            },err=>{
                _this.$Message.error(err);
            })
        },
        /**查询未加入客服中心的租户 */
        async queryAllTenantForList(){
            let config ={
                headers: Headers.json
            };
            //company.queryAllTenantForList(config).then(res=>{
            return await company.getNoCenterCompany(config).then(res=>{
                if(res.code == '0'){
                    this.srcData = res.resultData.map(i=>{
                        return {
                            key: i.sysId,
                            label: i.tenantName,
                        }
                    });
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })
        },
        /**成员管理 按钮 */
        manageMember(){
            this.showModal = true;
            this.queryAllTenantForList().then(() =>{
                this.getCenterAllCompany();
            });
        },
        /**成员管理 */
        handleChange(newTargetKeys, direction, moveKeys){
            this.targetKeys = newTargetKeys;
            if(direction == 'right'){
                this.addCenterCompany(moveKeys);
            }
            else{
                this.removeCenterCompany(moveKeys);
            }
            
        },
        /**成员名格式化 */
        formatLabel(item){
            return item.label;
        },
        /**删除客服中心 */
        deleteCenter(){
            let config = {
                data:{
                    csCenterId: this.curCenterId
                },
                headers: Headers.json
            };
            company.delCustomerCenter(config).then(res=>{
                if(res.code == '0'){
                    this.$Message.info('删除客服中心成功');
                    this.$nextTick( function(){
                        this.getCustomerCenter();
                    })
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })
        },
        /**分页 */
        changePageNum(val){
            this.curPageData.splice(0,this.curPageData.length);
            this.pageNum = val;
            this.getCenterCompany();
        },
        /**保存 修改的客服中心名称 */
        save(){
            let _this = this;
            _this.$refs.formItemCenter.validate((valid) =>{
                
                if (valid) { 
                    let config = {
                        data:{
                            csCenterName: _this.formItemCenter.curCerterName,
                            sysId: _this.curCenterId
                        },
                        headers: Headers.json
                    };
                    company.editCustomerCenter(config).then(res=>{
                        if(res.code == '0'){
                            _this.$Message.info('修改客服中心名称成功');
                            _this.$nextTick(function(){
                                _this.getCustomerCenter();
                            })
                        }else{
                            _this.$Message.warning(res.message);
                        }
                    },err=>{
                        _this.$Message.error(err);
                    })
                }
            })            
        },
        /**查询客服中心的成员 */
        getCenterCompany(){
            let config= {
                data: {
                    pageNum : this.pageNum,
                    pageSize: this.pageSize,
                    centerId: this.curCenterId 
                },
                headers: Headers.urlencoded
            };
            company.getCenterCompany(config).then(res=>{
                if(res.code == '0'){
                    this.curPageData = res.resultData.list;
                    this.totalNum = res.resultData.total;
                }else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**查询客服中心 */
        async getCustomerCenter(){
            let config= {};
            return await company.getCustomerCenter(config).then(res=>{
                if(res.code == '0'){
                    this.centerList = res.resultData;
                    this.centerTenantNum = this.centerList.map(i=>{
                        return i.tenantNum
                    })
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        addCenterBtn(){
            this.showAddCenter = true;
        },
        /**新增客服中心 */
        addCsCenter(){
            let _this = this;
            _this.$refs.formItem.validate((valid) =>{
                _this.disabledBtn = true;
                if (valid) {  
                let config= {
                    data: {
                        csCenterName: _this.formItem.addCerterName
                    },
                    headers: Headers.json
                };
                company.addCustomerCenter(config).then(res=>{
                    if(res.code == '0'){
                        _this.disabledBtn = false;
                        _this.$Message.info('新增客服中心成功');
                        _this.$nextTick(function(){
                            _this.getCustomerCenter();
                        })
                        _this.showAddCenter = false
                    }else{
                        _this.$Message.warning(res.message);
                        _this.disabledBtn = false;
                        _this.showAddCenter = true;
                        _this.$refs.formItem.resetFields(); 
                    }
                }, err=>{
                    _this.disabledBtn = false;
                    _this.$Message.error(err);
                })
                }
            })
        },
        selectCenter(item,index){
            this.curCenter = item;
            this.curCenterIndex = index;
            this.curCenterId = item.sysId;
            this.formItemCenter.curCerterName = item.csCenterName;
            this.getCenterCompany();
        },
        ok(){
            this.showModal = false;
        },
        cancel(){
            this.showModal = false;
        },
        handleCheckAll(type){
            if(type == 'admin'){
                this.aCheckAll = !this.aCheckAll;
                if (this.aIndeterminate) {
                    this.aCheckAll = false;
                } else {
                    this.aCheckAll = !this.aCheckAll;
                }
                this.aIndeterminate = false;

                if (this.aCheckAll) {
                    this.adminModal = [ "facebook", "github", "twitter", "snapchat" ];
                } else {
                    this.adminModal = [];
                }
            }else{
                this.rCheckAll = !this.rCheckAll;
                if (this.rIndeterminate) {
                    this.rCheckAll = false;
                } else {
                    this.rCheckAll = !this.rCheckAll;
                }
                this.rIndeterminate = false;

                if (this.rCheckAll) {
                    this.rentModal = [ "facebook", "github", "twitter", "snapchat" ];
                } else {
                    this.rentModal = [];
                }
            }
            
        }
    },
    mounted() {
        this.getCustomerCenter().then(()=>{
            this.centerList.map((i,x) =>{
                if(x == 0){
                    this.selectCenter(i,x);
                }
            })
        });
        this.changePageNum(1);
    },
}
</script>
<style lang="less">
.ivu-transfer .ivu-transfer-list{
    width: 200px;
}
.context{
    background-color: white;
    min-height: 600px;
}
.kfcenter{
    
    .top{
        height: 107px;
        line-height: 107px;
    }
    .company-list{
        text-align: center;
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
        margin: 10px 0px;
    }
    .company{
        width: 600px;
    }
    .center-list{
        .center-layout{
            margin-left: 40px;
            min-height: 625px;
            height: 100%;
            position: relative;
            border: 1px solid #EBEDF0;
        }
        .center-item{
            height: 48px;
            line-height: 48px;
            cursor: pointer;
            padding-left: 40px;
        }
        .selected-center{
            background-color: #f0faf6;
            color: #13C27C;
        }
    }
    .center-info{
        .center-manage{
            .nav{
                .back{
                    text-align:left;
                    padding-left:10px;
                    cursor:pointer;
                    font-size:14px;
                    padding:5px;
                }
            }
        }
        .operation{
            margin: 10px;
        }
    }
}
.company{
    margin-bottom: 10px;
}
.ivu-collapse-content-box{
    >div>.ivu-checkbox-wrapper{
        margin-top: 10px;
    }
    .ivu-checkbox-group{
        text-indent: 10px;
        margin-bottom: 10px;
    }
}

</style>