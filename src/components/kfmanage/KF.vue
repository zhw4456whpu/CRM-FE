<template>
    <Row class="kf" style="background:#fff;">
        <personal-manage :props="personalManage" @back="back" @addKF="addKF" @editKF="editKF" 
            @changePMNum="changePMNum" @resetPwd="resetPwd" @search="search"></personal-manage>
        
        <Row class="customer-content" v-show="!personalManage.showkfModal">
            <Row class="common">客服</Row>
            <Row class="customer">
                <x-table :data="customerPageData" ref="selection" no-data-text="没有数据">
                    <x-table-column title="服务租户" prop="tenantName">
                        <template slot-scope="scope">
                            <Row class="company-name">
                                <!--<img :src="scope.companyLogo" class="company-logo"/>-->
                                <span v-model="scope.tenantName">{{scope.tenantName}}</span>
                            </Row>
                        </template>
                    </x-table-column>
                    <x-table-column title="租户属性" prop="tenantType">
                        <template slot-scope="scope">
                            {{scope.tenantType=='1'?'平台':scope.tenantType=='2'?'外部租户':'系统租户'}}
                        </template>
                    </x-table-column>
                    <x-table-column title="客服中心" prop="csCenterName"></x-table-column>
                    <x-table-column title="坐席上限" prop="maxSeatNum"></x-table-column>
                    <x-table-column title="坐席数" prop="csSeatNum"></x-table-column>
                    <x-table-column title="外部人员数" prop="csOutNum"></x-table-column>
                    <x-table-column title="操作">
                        <template slot-scope="scope">
                            <Button type="text" size="large" @click="personnelRole(scope)" icon="edit" title="人员管理">人员管理</Button>
                        </template>
                    </x-table-column>
                </x-table>
                <Row class="page">
                    <Page :total="customerPage.total" @on-change="changePageNum"></Page>
                </Row> 
            </Row>
        </Row>        
        <Modal class="add-kf"
            v-model="showModal"
            title="新增客服"
            width="620"
            @on-cancel="cancel">
            <Form 
            :model="formItem" 
            ref="formItem"
            :rules="ruleValidate"
            :label-width="80">
                <Row class="">
                    <Col span="12">
                        <FormItem label="客服昵称" prop="seatName">
                            <Input v-model="formItem.seatName" placeholder="请输入客服昵称"></Input>
                        </FormItem>
                        <FormItem label="用户账户"  prop="sysUserEntity.userAccount">
                            <Input v-model="formItem.sysUserEntity.userAccount" placeholder="请输入字符、数字组成的字符串，不要包含特殊字符"></Input>
                        </FormItem>
                        <FormItem label="密码" prop="sysUserEntity.userPwd">
                            <Input  type="password" v-model="formItem.sysUserEntity.userPwd" placeholder="请输入6-16位任意数字或字母"></Input>
                        </FormItem>
                        <FormItem label="确认密码" prop="confirmPwd">
                            <Input  type="password" v-model="formItem.confirmPwd" placeholder="请再次输入密码"></Input>
                        </FormItem>
                        <FormItem label="真实姓名" prop="sysUserEntity.realName">
                            <Input v-model="formItem.sysUserEntity.realName" placeholder="请输入真实姓名"></Input>
                        </FormItem>
                        <FormItem label="工号"  :maxlength="10"  prop="sysUserEntity.workNum">
                            <Input v-model="formItem.sysUserEntity.workNum" placeholder="请输入工号"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="接待人数" prop="maxWaitNum">
                            <Select v-model="formItem.maxWaitNum" style="width:200px">
                                <Option value="5" >5</Option>
                                <Option value="8" >8</Option>
                                <Option value="10" >10</Option>
                                <Option value="15" >15</Option>
                                <Option value="20" >20</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="所属租户">
                            <!--<Input v-model="formItem.tenantId" placeholder="请输入所属租户"></Input>-->  
                            <Input disabled v-model="personalManage.curTenantName" placeholder="请输入所属租户" style="width:200px"></Input>                    
                        </FormItem>
                        <FormItem label="角色" prop="roleName">
                            <Select  placeholder="请选择角色" v-model="formItem.sysUserEntity.roleId" style="width:200px">
                                <Option v-for="item in roleList" :value="item.sysId" :key="item.sysId">{{ item.roleName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="启用状态" prop="enableStatus">
                            <Select v-model="formItem.enableStatus" style="width:200px">
                                <Option value="0" >启用</Option>
                                <Option value="1" >停用</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="服务中心">
                            <Input disabled v-model="centerObj.csCenterName" placeholder="请输入服务中心" style="width:200px"></Input>         
                        </FormItem>
                    </Col>
                </Row>
                <Row class="">
                    <Row type="flex" justify="end" class="served-tenant">
                        <Col span="12">其他服务租户</Col>
                        <Col span="12" style="text-align:right;">
                            <Button type="primary" icon="plus" @click="addServeCompany('add')">添加服务租户</Button>
                        </Col>
                        <div class="sub-mask" v-show="addTenantModal">
                            <Modal class-name="sub-modal" v-model="addTenantModal" title="添加服务租户">
                                <Form v-model="aFormItem" :label-width="80">
                                    <FormItem label="服务租户">
                                        <Select v-model="aFormItem.tenantName" style="width:300px" label-in-value @on-change="selecTenant">
                                            <Option v-for="item in companyList" :value="item.sysId" :key="item.sysId">{{ item.tenantName }}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="客服昵称">
                                        <Input v-model="aFormItem.seatName" placeholder="请输入" style="width:300px"/>
                                    </FormItem>
                                    <FormItem label="接待人数">
                                        <Select v-model="aFormItem.maxWaitNum" style="width:300px">
                                            <Option value="5" >5</Option>
                                            <Option value="8" >8</Option>
                                            <Option value="10" >10</Option>
                                            <Option value="15" >15</Option>
                                            <Option value="20" >20</Option>
                                        </Select>
                                    </FormItem>
                                    <!-- <ForItem label="操作">
                                        <Button type="text" size="large" @click="delKF" icon="ios-trash-outline" title="删除"></Button>
                                    </ForItem> -->
                                </Form>
                                <div slot="footer">
                                    <Button type="text" @click="cancelTenantModal">取消</Button>
                                    <Button type="primary" @click="mechanismOk">确定</Button>
                                </div>
                            </Modal>
                        </div>
                    </Row>
                    <Row class="served-list">
                        <x-table :data="formItem.otherBusiSeatInfos" :show-header="personalManage.showHeader" ref="default" no-data-text="没有数据">
                            <x-table-column title="租户名称" prop="csTenantName"></x-table-column>
                            <x-table-column title="坐席名称" prop="seatName"></x-table-column>
                            <x-table-column title="接待人数" prop="maxWaitNum"></x-table-column>
                            <x-table-column title="操作" prop="operation">
                                 <template slot-scope="scope">
                                    <Button type="text" size="large" @click="delKF(scope)" icon="ios-trash-outline" title="删除"></Button>
                                </template>
                            </x-table-column>
                        </x-table>
                    </Row>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="showModal=false">取消</Button>
                <Button type="primary" size="large" @click="seatOk" :disabled="diabledBtn">确定</Button>
            </div>
        </Modal>
        <Modal class="edit-kf"
            v-model="eShowModal"
            title="编辑客服"
            width="620"
            @on-cancel="cancel">
            <Form
            :model="eFormItem" 
            ref="eFormItem"
            :rules="ruleValidate"             
            :label-width="80">
                <Row class="">
                    <Col span="12">
                        <FormItem label="客服昵称" prop="seatName">
                            <Input v-model="eFormItem.seatName" placeholder="请输入客服昵称"></Input>
                        </FormItem>
                        <FormItem label="用户账户" prop="userAccount">
                            <Input disabled v-model="eFormItem.userAccount" placeholder="请输入登陆用户名"></Input>
                        </FormItem>
                        <FormItem label="真实姓名" prop="realName">
                            <Input v-model="eFormItem.realName" placeholder="请输入真实姓名"></Input>
                        </FormItem>
                        <FormItem label="工号"  prop="workNum">
                            <Input type="text" v-model="eFormItem.workNum" placeholder="请输入工号"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="接待人数" prop="maxWaitNum"> 
                            <Select v-model="eFormItem.maxWaitNum" style="width:200px">
                                <Option value="5" >5</Option>
                                <Option value="8" >8</Option>
                                <Option value="10" >10</Option>
                                <Option value="15" >15</Option>
                                <Option value="20" >20</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="所属租户" prop="tenantName">
                            <Input disabled v-model="eFormItem.tenantName" placeholder="请输入所属租户" style="width:200px"></Input>                            
                        </FormItem>
                        <FormItem label="角色" prop="roleId">
                            <Select v-model="eFormItem.roleId" style="width:200px" >
                                <Option placeholder="请选择角色"  v-for="item in roleList" :label="item.roleName" :value="item.sysId+''" :key="item.sysId">{{ item.roleName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="启用状态" prop="enableStatus">
                            <Select v-model="eFormItem.enableStatus" style="width:200px">
                                <Option value="0" >启用</Option>
                                <Option value="1" >停用</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="服务中心">
                            <Input disabled v-model="eFormItem.csCenterName" placeholder="请输入服务中心" style="width:200px"></Input>         
                        </FormItem>
                    </Col>
                </Row>
                <Row class="">
                    <Row type="flex" justify="end" class="served-tenant">
                        <Col span="12">其他服务租户</Col>
                        <Col span="12" style="text-align:right;">
                            <Button type="primary" icon="plus" @click="addServeCompany('edit')">添加服务租户</Button>
                        </Col>
                        <div class="sub-mask" v-show="tenantModal">
                            <Modal class-name="sub-modal" v-model="tenantModal" title="添加服务租户">
                                <Form v-model="aFormItem" :label-width="80">
                                    <FormItem label="服务租户">
                                        <Select v-model="aFormItem.tenantName" style="width:300px" label-in-value @on-change="selecTenant">
                                            <Option v-for="item in companyList" :value="item.sysId" :key="item.sysId">{{ item.tenantName }}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="客服昵称">
                                        <Input v-model="aFormItem.seatName" placeholder="请输入" style="width:300px"/>
                                    </FormItem>
                                    <FormItem label="接待人数">
                                        <Select v-model="aFormItem.maxWaitNum" style="width:300px">
                                            <Option value="5" >5</Option>
                                            <Option value="8" >8</Option>
                                            <Option value="10" >10</Option>
                                            <Option value="15" >15</Option>
                                            <Option value="20" >20</Option>
                                        </Select>
                                    </FormItem>
                                    <!-- <ForItem label="操作">
                                        <Button type="text" size="large" @click="delKF" icon="ios-trash-outline" title="删除"></Button>
                                    </ForItem> -->
                                </Form>
                                <div slot="footer">
                                    <Button type="text" @click="cancelTenantModal">取消</Button>
                                    <Button type="primary" @click="editAddServedTenantOk">确定</Button>
                                </div>
                            </Modal>
                        </div>
                    </Row>
                    <Row class="served-list">
                        <x-table :data="eFormItem.otherBusiSeatInfos" :show-header="personalManage.showHeader" ref="default" no-data-text="没有数据">
                            <x-table-column title="租户名称" prop="tenantName"></x-table-column>
                            <x-table-column title="坐席名称" prop="seatName"></x-table-column>
                            <x-table-column title="接待人数" prop="maxWaitNum"></x-table-column>
                            <x-table-column title="操作" prop="operation">
                                 <template slot-scope="scope">
                                    <Button type="text" size="large" @click="delEditKF(scope)" icon="ios-trash-outline" title="删除"></Button>
                                </template>
                            </x-table-column>
                        </x-table>
                    </Row>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="eShowModal=false">取消</Button>
                <Button type="primary" size="large" @click="editOk">确定</Button>
            </div>            
        </Modal>
    </Row>
</template>
<script>
import xTable from "@/components/common/xTable";
import xTableColumn from "@/components/common/xTableColumn";
import personalManage from './PersonalManage'
import kfApi from '../../service/kfApi';
import companyApi from '../../service/companyApi';
import {Headers} from '../common/Consts.js';
import crypto from 'crypto';
import { isNull } from '../../utils';
export default {
    name: 'KF',
    components: {
        xTable,xTableColumn,personalManage
    },
    computed:{
        userId: {
            get(){
                return this.$store.state.userId;
            },
            set(val){
                this.$store.dispatch('setUserId', val);
            }
        }
    },
    data(){
        // const validateworkNum = (rule, value, callback) => {
        //     if (!Number.isInteger(+value)) {
        //         callback(new Error('工号格式不正确'));
        //     } else if(value <= 0 || value > 10000 ) {
        //         callback('字符长度不能大于10');
        //     }else{
        //         callback()
        //     }
        // };    
        let reg= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;//6-16位数字与字母的组合 
        const validatePwd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            }else if(!reg.test(value)) {
                callback(new Error('请输入6-16位数字与字母的组合字'));
            } else {
                if (this.formItem.confirmPwd !== '') {
                this.$refs.formItem.validateField('confirmPwd')
                }
                callback()
            } 
        }              
        const validatePwdCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('确认密码不能为空'))
            } else if (value !== this.formItem.sysUserEntity.userPwd) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }        
        return {
            diabledBtn: false,
            addTenantModal: false,
            curBusId: '',
            ruleValidate: {
                seatName:[
                    {required: true, message: '客服昵称不能为空', trigger: 'blur' },
                    {type:'string',max:50, message: '字符长度最多不超过50个',}
                    ],
                "sysUserEntity.userAccount":[
                    {required: true, message: '用户账户不能为空', trigger: 'blur' },
                    {type:'string',max:50, message: '字符长度最多不超过50个',}
                    ],
                userAccount:[
                    {required: true, message: '用户账户不能为空', trigger: 'blur' },
                    {type:'string',max:50, message: '字符长度最多不超过50个',}
                    ],                    
                "sysUserEntity.userPwd":[{required: true,validator: validatePwd, trigger: 'blur'},],
                confirmPwd:[{required: true,validator: validatePwdCheck, trigger: 'blur' },],
                "sysUserEntity.realName":[
                    {required: true, message: '请输入真实姓名', trigger: 'blur' },
                    {type:'string',max:50, message: '字符长度最多不超过50个',}
                    ],
                realName:[
                    {required: true, message: '请输入真实姓名', trigger: 'blur' },
                    {type:'string',max:50, message: '字符长度最多不超过50个',}
                    ],
                "sysUserEntity.workNum":[
                    {required: true, message: '工号不能为空', trigger: 'blur' },
                    {type:'string',max:10, message: '字符长度最多不超过10个',trigger: 'blur'}
                ],
                workNum:[
                    {required: true, message: '工号不能为空', trigger: 'blur' },
                    {type:'string',max:10, message: '字符长度最多不超过10个',trigger: 'blur'}
                ],                
                maxWaitNum:[{required: true, message: '请选择接待人数', trigger: 'change' },],
                // roleName:[{  required: true, message: '不能为空',trigger: 'change'}],
                enableStatus:[{required: true, message: '请选择是否启用', trigger: 'change' },],
            },             
            personalManage:{
                showkfModal: false,
                curTenantName: '',
                curPageData: [],
                showHeader: true,
                page:{
                    pageSize: 10,
                    pageNum: 1,
                    total: 0, //总条数
                }
            },
            customerPage:{
                pageSize: 10,
                pageNum: 1,
                total: 0
            },
            centerObj: {
                csCenterId: '',
                csCenterName: ''
            },
            tenantModal: false,
            freeKfSeat:[
                {
                    seatName: '',
                    seatCode: ''
                }
            ],
            showModal: false,
            curCompany: '',
            curTenantId:'',
            maxWaitNum:'',
            seatName:'',
            companyList: [
                {
                    tenantName: '',
                    sysId: ''
                }
            ],
            roleList: [],
            labelInValue: true,
            searchKey: '',
            customerPageData:[],
            formItem:{
                seatName: "",
                sysUserEntity: {
                    userAccount: "",
                    userPwd: "",
                    realName: "",
                    workNum: "",
                    roleId: "",
                    enableStatus: ''
                },
                tenantId: "",
                maxWaitNum: "",
                centerObj: {
                    csCenterId: '',
                    csCenterName: ''
                },
                otherBusiSeatInfos:[]     
            },
            eShowModal: false,
            eFormItem:{
                seatName: "",
                sysUserEntity: {
                    userAccount: "",
                    userPwd: "",
                    realName: "",
                    workNum: "",
                    roleId: "",
                    enableStatus: ''
                },
                tenantId: "",
                maxWaitNum: "",
                centerObj: {
                    csCenterId: '',
                    csCenterName: ''
                },
                otherBusiSeatInfos:[]     
            },
            aFormItem:{}

        }
    },
    methods: {
        /**搜索 */
        search(val){
            this.queryCsSeatByTenantIdForPage(val.searchKey);
        },
        /**重置密码 */
        resetPwd(scope){
            var _this = this;
            let config = {
                title: '请您确认',
                content:'您将重置密码',
                onOk: function(){
                    var md = crypto.createHash('md5');
                    let config = {
                        data: {
                            userAccount: scope.userAccount,
                            userPwd: md.update('123456').digest('hex'),
                        },
                        headers: Headers.json
                    }
                    kfApi.modifyPwd(config).then(res =>{
                        
                        if(res.code == '0'){
                            this.$Message.info("重置密码成功");
                        }
                        else{
                            this.$Message.warning(res.message);
                        }
                    },err=>{
                        this.$Message.error(err);
                    });
                    return true;
                },
                onCancel: function(){
                }
            }
            this.$Modal.confirm(config);
        },
        /**选择服务租户 */
        selecTenant(val){
            this.aFormItem.tenantId = val.value;
            this.aFormItem.csTenantName = val.label;
        },
        /**删除租户列表中的租户 */
        delKF(scope){
            this.formItem.otherBusiSeatInfos.splice(scope._index,1);
        },
        delEditKF(scope){
            this.eFormItem.otherBusiSeatInfos.splice(scope._index,1);
        },
        /**编辑客服信息保存 */
        editOk(){
            this.$refs.eFormItem.validate((valid) =>{
                if (valid) {
                    var md = crypto.createHash('md5');
                    let config = {
                        data: {
                            busId: this.curBusId,
                            seatName: this.eFormItem.seatName,                            
                            sysUserEntity: {
                                sysId: this.eFormItem.userId,
                                userAccount: this.eFormItem.userAccount,
                                // userPwd: md.update(this.eFormItem.userPwd.toLowerCase()).digest('hex'),
                                realName: this.eFormItem.realName,
                                workNum: this.eFormItem.workNum,
                                enableStatus: this.eFormItem.enableStatus,
                                roleId: this.eFormItem.roleId && this.eFormItem.roleId!='undefined'?this.eFormItem.roleId:'',
                            },
                            tenantId: this.eFormItem.tenantId,
                            maxWaitNum: this.eFormItem.maxWaitNum,
                            csCenterId: this.eFormItem.csCenterId,
                            otherBusiSeatInfos:[
                                ...this.eFormItem.otherBusiSeatInfos
                            ]
                        },
                        headers: Headers.json
                    }
                    kfApi.updateCsSeatBySeatId(config).then(res =>{
                        if(res.code == '0'){
                            this.$Message.info("编辑客服成功");
                            this.queryCsSeatByTenantIdForPage()
                            this.eShowModal = false
                        }
                        else{
                            this.$Message.warning(res.message);
                            this.$refs.eFormItem.resetFields();  
                        }
                    },err=>{
                        this.$Message.error(err);
                    });
                }
            })
        },
        /**获取用户服务的租户以及坐席 */
        queryCsMemberForPage(){
             let config = {
                data: {
                    pageNum: this.customerPage.pageNum,
                    pageSize: this.customerPage.pageSize
                },
                headers: Headers.urlencoded
            }; 
            kfApi.queryCsMemberForPage(config).then(res=>{
                if(res.code == '0'){
                    this.customerPageData = res.resultData.list;
                    this.customerPage.total = res.resultData.total;
                }
                else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })                       
        },
        /**获取租户对应坐席以及人员信息 */
        queryCsSeatByTenantIdForPage(val = ''){
            let config = {
                data: {
                    pageNum: this.personalManage.page.current,
                    pageSize: this.personalManage.page.pageSize,
                    tenantId: this.curTenantId?this.curTenantId:'',
                    seatName: val?val:'',
                },
                headers: Headers.urlencoded
            }; 
            kfApi.queryCsSeatByTenantIdForPage(config).then(res=>{
                if(res.code == '0'){
                    this.personalManage.curPageData =res.resultData.list;
                    this.personalManage.page.total = res.resultData.total
                }
                else{
                    this.$Message.info(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })                       
        },        
        //人员管理
        personnelRole(scope) {
            this.personalManage.curTenantName = scope.tenantName;
            this.personalManage.curCenterName = scope.csCenterName;
            this.formItem.tenantId = scope.sysId;
            this.centerObj.csCenterId = scope.centerId;
            this.centerObj.csCenterName = scope.csCenterName;
            this.curTenantId=scope.sysId
            this.personalManage.showkfModal= true
            this.queryCsSeatByTenantIdForPage('')
        },  
        //点击返回
        back(){
            this.personalManage.showkfModal= false
        },
        /**查询租户对应角色列表 */
        getRoleList(){
            let config = {
                data: {
	                tenantId: this.curTenantId
                },
                headers: Headers.json
            }; 
            kfApi.queryTenantRoleForList(config).then(res=>{
                if(res.code == '0'){
                    this.roleList=res.resultData
                }
                else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                    this.$Message.error(err);
            });  
        },
        /**查询租户所属的客服中心*/
        queryTenantForCenter(){
            kfApi.queryTenantForCenter({
                data: {
	                tenantId: this.curTenantId
                },
                headers: Headers.json
            }).then(res=>{
                if(res.code == '0'){
                    this.formItem.centerObj = res.resultData
                }
                else{
                    this.$Message.info(res.message);
                }
            },err=>{
                    this.$Message.error(err);
            });
        },
        addKF(){
            this.showModal = true;
            this.formItem.enableStatus = '0';
            this.formItem.maxWaitNum = '10';
            //查询租户对应角色列表
            this.getRoleList(); 
            //查询租户所属的客服中心  
            this.queryTenantForCenter();
        },
        editKF(scope){
            var _this = this;
            this.eShowModal = true;
            this.curBusId = scope.busId;
            this.getRoleList();
            /**客服编辑查询接口*/
            let config = {
                data: {
                    busId: scope.busId,
	                userId: scope.userId
                },
                headers: Headers.json
            }; 
            kfApi.querySeatIdByUserId(config).then(res=>{
                if(res.code == '0'){
                    _this.eFormItem = res.resultData;
                    _this.eFormItem.maxWaitNum = _this.eFormItem.maxWaitNum + '';
                    _this.eFormItem.roleId = _this.eFormItem.roleId + '';
                    _this.eFormItem.enableStatus = _this.eFormItem.enableStatus + '';
                }
                else{
                    _this.$Message.warning(res.message);
                }
            },err=>{
                _this.$Message.error(err);
            })
        },
        //翻页
        changePageNum(val){
            this.personalManage.curPageData.splice(0,this.personalManage.curPageData.length);
            this.personalManage.curPageData = this.personalManage.curPageData.slice((val-1)*10,val*10);
            this.customerPage.pageNum = val;
            this.queryCsMemberForPage()
        },
        /** */
        changePMNum(val){
            this.personalManage.page.current = val;
            this.queryCsSeatByTenantIdForPage()
        },
        changeServeCompany(item){
            item.status = !item.status;
        },
        seatOk(){
            /**添加客服 */
            let _this = this;
            console.log("_this.diabledBtn",_this.diabledBtn);
            if(isNull(_this.formItem.sysUserEntity.roleId)){
                _this.$Message.warning("请选择角色");
                return false;
            }
            this.$refs.formItem.validate((valid) =>{
                _this.diabledBtn = true;
                if (valid) {
                    let centerId = _this.formItem.centerObj && _this.formItem.centerObj.csCenterId?_this.formItem.centerObj.csCenterId:'';
                    let config = {
                        data: {
                            seatName: _this.formItem.seatName,
                            sysUserEntity: {..._this.formItem.sysUserEntity},
                            otherBusiSeatInfos: [..._this.formItem.otherBusiSeatInfos],
                            tenantId: _this.formItem.tenantId,
                            maxWaitNum: _this.formItem.maxWaitNum,
                            csCenterId: centerId?centerId:'',
                        },
                        headers: Headers.json
                    }; 
                    var md = crypto.createHash('md5');
                    config.data.sysUserEntity.userPwd =  md.update(_this.formItem.sysUserEntity.userPwd.toLowerCase()).digest('hex'),
                    kfApi.addCsSeatByTenantId(config).then(res=>{
                        if(res.code == '0'){
                            _this.queryCsSeatByTenantIdForPage()
                            _this.showModal = false;
                            _this.diabledBtn = false;
                        }
                        else{
                            _this.$Message.warning(res.message);
                            _this.diabledBtn = false;
                        }
                    },err=>{
                        _this.$Message.error(err);
                        _this.diabledBtn = false;
                    })
                }else {
                    _this.showModal = true;
                    _this.diabledBtn = false;
                    // this.$refs.formItem.resetFields();  
                }
                
            })
        },
        //添加服务租户ok
        mechanismOk(){
            if(isNull(this.aFormItem.seatName)){
                this.$Message.warning("客服昵称不能为空");
                return false;
            }
            if(isNull(this.aFormItem.csTenantName)){
                this.$Message.warning("服务租户不能为空");
                return false;
            }
            if(this.aFormItem.seatName.length > 50){
                this.$Message.warning("客服昵称不能超过50字符");
                return false;
            }
            this.formItem.otherBusiSeatInfos.push({
                tenantId: this.aFormItem.tenantId,
                csTenantName: this.aFormItem.csTenantName,
                seatName: this.aFormItem.seatName,
                maxWaitNum: this.aFormItem.maxWaitNum
            });
            this.addTenantModal = false;
        },
        //添加服务租户ok
        editAddServedTenantOk(){
            if(isNull(this.aFormItem.seatName)){
                this.$Message.warning("客服昵称不能为空");
                return false;
            }
            if(isNull(this.aFormItem.csTenantName)){
                this.$Message.warning("服务租户不能为空");
                return false;
            }
            if(this.aFormItem.seatName.length > 50){
                this.$Message.warning("客服昵称不能超过50字符");
                return false;
            }
            this.eFormItem.otherBusiSeatInfos.push({
                tenantId: this.aFormItem.tenantId,
                tenantName: this.aFormItem.csTenantName,
                seatName: this.aFormItem.seatName,
                maxWaitNum: this.aFormItem.maxWaitNum
            });
            this.tenantModal = false;
        },
        cancel(){
            this.showModal= false;
        },
        cancelTenantModal(){
            this.addTenantModal = false;
            this.tenantModal = false;
        },
        /**查询该客服中心下的租户信息 */
        queryTenantInCenter(){
            companyApi.getCenterAllCompany({
                data: {
                    csCenterId : this.centerObj.csCenterId
                },
                headers: Headers.json
            }).then(res =>{
                if(res.code == '0'){
                    this.companyList = res.resultData.filter(item=>{
                        return (item && item.sysId!= this.curTenantId)?true:false
                    });
                }else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        addServeCompany(type){
            this.aFormItem.maxWaitNum= '10';
            if(type =='add'){
                this.addTenantModal = true;
            }
            else{
                this.tenantModal = true;
            }
            this.queryTenantInCenter();
            //this.addSeatInfo();
        }
    },
    mounted(){
        this.changePageNum(1);
        this.queryCsMemberForPage();
        this.aFormItem.serveCompany='';
        this.aFormItem.positionName='';
   }
}
</script>
<style lang="less">
.served-tenant{
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    font-weight: bold;
}
.served-list{
    margin-top: 10px;
}
.sub-mask{
    z-index: 1001;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(55, 55, 55, 0.2);
    height: 100%;
}
.top-type{
    cursor: pointer;
}

.kf{
    background-color: #fff;
    .common{
        height: 107px;
        line-height: 107px;
        padding-left: 40px;
        font-size:18px;
        font-family: PingFangSC-Medium;
        font-weight: bold;
        color:rgba(20,41,33,1);
        overflow: hidden;
    }
    .top{
        .top-left{
            .top-title{
                font-size: 16px;
                font-weight: bold;
                text-align: left;
                padding-left: 10px;

            }
        }
        .top-right{
            padding-right: 20px;
        }
    }
    .kf-content{
        background-color: white;
        margin: 0px 40px;
        .kf-no{
            .kf-logo{
                width: 32px;
                height: 32px;
            }
        }
        .serve-company{
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            cursor: pointer;
            float: left;
        }
        .page{
            text-align: right;
            margin: 10px auto;
        }
    }
    .customer-content{
        .customer{
            margin: 0px 40px;
            padding: 0px;
            .page{
                float: right;
                margin: 10px 0px;
            }
        }
    }
}
.ivu-modal-wrap.sub-modal{
    z-index: 1004;
}
</style>