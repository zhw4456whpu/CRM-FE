<template>
    <Row class="role context">
        <Row class="role-header">
            <Col span="24" class="header-title">角色列表</Col>
        </Row>
        <Row 
            <Col span="4" class="role-list">
                <Row class="role-layout">
                    <Row v-for="(item,index) in roleList" :key="index" @click.native="selectRole(index)"
                        :class="{'role-item':true,'selected-role':index == curRoleIndex}">{{item.name}}</Row>
                </Row>
            </Col>
            <Col span="20" class="role-info">
                <Row v-show="curRoleIndex == 0">
                    <Row class="company-list">
                        <x-table :data="curPageData" :show-header="showHeader" ref="default" no-data-text="没有数据">
                            <x-table-column title="角色名" prop="roleName"></x-table-column>
                            <x-table-column title="权限类型" prop="permissionType">
                                <template slot-scope="scope">
                                    {{scope.permissionType=='1'?'平台级':'租户级'}}
                                </template>
                            </x-table-column>
                            <x-table-column title="操作">
                                <template slot-scope="scope">
                                    <Button type="text" size="large" @click="editDefaultRole(scope)" icon="edit" title="修改">修改</Button>
                                </template>
                            </x-table-column>
                        </x-table>
                    </Row>
                    <Row class="page">
                        <Page :total="totalNum" @on-change="changePageNum"></Page>
                    </Row>
                    <Modal
                        v-model="showDefault"
                        title="修改默认角色"
                        @on-ok="modify"
                        @on-cancel="cancel" width="600">
                        <Row class="company">
                            <Col span="10" style="text-align:left;line-height:32px;">
                                <Row>
                                    <Col span="6">权限类型</COl>
                                    <Col span="18">
                                        <Select v-model="dForm.permissionType">
                                            <Option value="1">平台级</Option>
                                            <Option value="2">租户级</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span="14" style="line-height:32px;">
                                <Row>
                                    <Col span="6" style="text-align:right;padding-right:10px;">角色名称</Col>
                                    <Col span="18">
                                        <Input v-model="dForm.roleName" placeholder="请输入角色名称" style="width:200px;"></Input>
                                    </Col>
                                </ROw>
                            </Col>

                        </Row>
                        <Row >
                            <authority-config :props="authorityConfig" @handleCheckAll="handleCheckAll"
                                    @checkAllGroupChange="checkAllGroupChange"></authority-config>
                        </Row>
                    </Modal>
                </Row>
                <Row v-show="curRoleIndex == 1 && !showManageModal">
                    <Row class="company-list">
                        <x-table :data="curCompanyPageData" :show-header="showHeader" ref="selection" no-data-text="没有数据">
                            <x-table-column title="租户名称" prop="tenantName">
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
                            <x-table-column title="联系电话" prop="tenantPhone"></x-table-column>
                            <x-table-column title="坐席上限" prop="maxSeatNum"></x-table-column>
                            <x-table-column title="角色数" prop="roleNum"></x-table-column>
                            <x-table-column title="操作">
                                <template slot-scope="scope">
                                    <Button type="text" size="large" @click="manageRole(scope)" icon="edit" title="角色管理">角色管理</Button>
                                </template>
                            </x-table-column>
                        </x-table>

                    </Row>
                    <Row class="page">
                        <Page :total="totalCompanyNum" @on-change="changeCompanyPageNum"></Page>
                    </Row>
                </Row>
                <Row class="role-manage" v-show="showManageModal">
                    <Row class="nav" >
                        <Col span="4" class="back" @click.native="showManageModal= false;">
                            <Icon type="chevron-left"></Icon>  返回 {{curTenant.tenantName}}
                        </Col>
                        <Col span="20" style="text-align:right;padding-right:10px;">
                            <Button type="primary" icon="plus" @click="addRoleBtn">新增角色</Button>
                            <Modal
                                v-model="addRole"
                                title="新增角色"
                                @on-ok="addRoleOk"
                                @on-cancel="cancel" width="600">
                                <Row class="company">
                                    <Col span="10" style="text-align:left;line-height:32px;">
                                        <Row>
                                            <Col span="6">权限类型</COl>
                                            <Col span="18">
                                                <Select v-model="aForm.authorityType">
                                                    <Option value="1">平台级</Option>
                                                    <Option value="2">租户级</Option>
                                                </Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span="14" style="text-align:right;line-height:32px;">
                                        <Row>
                                            <Col span="6">角色名称</Col>
                                            <Col span="18">
                                                <Input v-model="aForm.roleName" placeholder="请输入角色名称" style="width:200px;"></Input>
                                            </Col>
                                        </ROw>
                                    </Col>

                                </Row>
                                <Row >
                                    <authority-config :props="authorityConfig" @handleCheckAll="handleCheckAll"
                                    @checkAllGroupChange="checkAllGroupChange"></authority-config>
                                </Row>
                            </Modal>
                        </Col>
                    </Row>
                    <Row class="company-list">
                        <x-table :data="rolePageData" :show-header="showHeader" ref="default" no-data-text="没有数据">
                            <x-table-column title="角色名" prop="roleName"></x-table-column>
                            <x-table-column title="角色类型" prop="roleType">
                                <template slot-scope="scope">
                                    {{scope.roleType=='1'?'默认角色':'自定义'}}
                                </template>
                            </x-table-column>
                            <x-table-column title="权限类型" prop="permissionType">
                                <template slot-scope="scope">
                                    {{scope.permissionType=='1'?'平台级':'租户级'}}
                                </template>
                            </x-table-column>
                            <x-table-column title="操作">
                                <template slot-scope="scope">
                                    <Button type="text" size="large" @click="editCompanyRole(scope)" icon="edit" title="修改"></Button>
                                    <Button type="text" size="large" @click="delCompanyRole(scope)" icon="trash-a" title="删除"></Button>
                                </template>
                            </x-table-column>
                        </x-table>
                    </Row>
                    <Row class="page">
                        <Page :total="totalNum" @on-change="changePageNum"></Page>
                    </Row>
                    <Modal
                        v-model="showModal"
                        title="修改租户角色"
                        @on-ok="ok"
                        @on-cancel="cancel" width="600">
                        <Row class="company">
                            
                            <Col span="10" style="text-align:left;line-height:32px;">
                                <Row>
                                    <Col span="6">权限类型</COl>
                                    <Col span="18">
                                        <Select v-model="eForm.permissionType">
                                            <Option value="1">平台级</Option>
                                            <Option value="2">租户级</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span="14" style="text-align:right;line-height:32px;">
                                <Col span="6">角色名称</COl>
                                <Col span="18">
                                    <Input v-model="eForm.roleName" placeholder="请输入角色名称" style="width:200px;"></Input>
                                </Col>
                            </Col>

                        </Row>
                        <Row >
                            <authority-config :props="authorityConfig" @handleCheckAll="handleCheckAll"
                                @checkAllGroupChange="checkAllGroupChange"></authority-config>
                        </Row>
                    </Modal>
                </Row>
            </Col>
        </Row>
    </Row>
</template>
<script>
import xTable from "@/components/common/xTable";
import xTableColumn from "@/components/common/xTableColumn";
import AuthorityConfig from "@/components/authoritymanage/AuthorityConfig"
import company from '../../service/companyApi';
import {Headers} from '../common/Consts.js';
export default {
    name: 'Role',
    components: {
        xTable,
        xTableColumn,
        AuthorityConfig
    },
    data(){
        return {
            operation: 'editDefault',
            curRoleCode: '',
            curRoleName: '',
            curRoleType: 0,
            curTenant: {},
            dForm:{
                authorityType: '',
                roleName: ''
            },
            aForm:{
                authorityType: '',
                roleName: ''
            },
            eForm:{
                authorityType: '',
                roleName: ''
            },
            rolePageData: [],
            curRoleId: '',
            totalCompanyNum: 0,
            pageCompanyNum: 1,
            showDefault: false,
            totalNum: 0,
            pageNum: 1,
            pageSize: 10,
            addRole: false,
            showManageModal: false,
            curRoleIndex: 0,
            authorityType: '',
            searchKey:'',
            authorityConfig : {
                indeterminate: [],
                checkAll: [],
                adminConfig :[],
                checkAllGroup:[]
            },
            roleList:[
                {
                    name: '默认角色',
                    id: '1'
                },
                {
                    name: '租户角色',
                    id: '2'
                }
            ],
            showModal: false,
            tableData:[],
            curPageData: [],
            curCompanyPageData: [],
            showHeader: true,
            
        }
    },
    methods: {
        /**单击每一项 复选框 */
        checkAllGroupChange(val){
            this.authorityConfig = val;
        },
        /**操作全选/全不选 */
        handleCheckAll(val){
            this.authorityConfig = val;
        },
        /**组合复选框 赋初值*/
        initCbGroup(){
            this.authorityConfig.adminConfig.map((item,index) =>{
                let checkedArr = [];
                item.children.map(citem =>{
                    if(citem.isChecked){
                        checkedArr.push(citem.menuName);
                    }
                })
                this.authorityConfig.checkAllGroup[index] = checkedArr;

                if(checkedArr.length == item.children.length){
                    this.authorityConfig.indeterminate[index] = false;
                    this.authorityConfig.checkAll[index] = true;
                }
                else if(checkedArr.length > 0){
                    this.authorityConfig.indeterminate[index] = true;
                    this.authorityConfig.checkAll[index] = false;
                }
                else{
                    this.authorityConfig.indeterminate[index] = false;
                    this.authorityConfig.checkAll[index] = false;
                }
            });
        },
        /**删除租户角色 */
        delCompanyRole(role){
            let _this = this;
            let config = {
                data: {
                    sysId: role.sysId
                },
                headers: Headers.json
            };
            company.delRole(config).then(res =>{
                if(res.code == '0'){
                    _this.$Message.info('删除租户角色成功');
                    _this.$nextTick(function () {
                        // DOM 更新了
                        _this.queryTenantRoleForPage();
                    });
                }
                else{
                    _this.$Message.warning(res.message);
                }
            }, err=>{
                _this.$Message.error(err)
            })
        },
        /**新增角色对话框 保存 */
        addRoleOk(){
            let config = {
                data: {
                    roleName: this.aForm.roleName,
                    permissionType: this.aForm.authorityType,
                    roleType: 2,//1：默认，2：自定义
                    tenantId: this.curTenant.sysId,
                    menuList: this.getMenuList()
                },
                headers: Headers.json

            };
            company.addRole(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('新增角色成功');
                    this.queryTenantRoleForPage();
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err)
            })
        },
        /**将返回的菜单数据分类：根菜单、子菜单 
         * @param resultData 接口返回的菜单数据
        */
        sortMenu(resultData){
            let children = [];
            resultData.map( (item,index) =>{
                if(item.parentCode == '0'){//0:根菜单
                    this.authorityConfig.adminConfig.push(item);
                }else{
                    children.push(item);
                }
            });
            this.mapChildren(children);
            this.initCbGroup();
        },
        /**新增角色按钮点击回调 */
        addRoleBtn(){
            this.addRole = true;
            let config = {}
            this.spliceArr();
            company.queryAllForList(config).then(res =>{
                if(res.code == '0'){
                    this.tableData = res.resultData;
                    this.sortMenu(res.resultData);
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**查询租户的角色 */
        queryTenantRoleForPage(){
            let config = {
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    tenantId: this.curTenant.sysId,
                    tenantType: this.curTenant.tenantType
                },
                headers: Headers.urlencoded
            };
            company.getTenantRole(config).then(res =>{
                if(res.code == '0'){
                    this.rolePageData = res.resultData.list;
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**角色管理 */
        manageRole(scope){
            this.showManageModal = true;
            this.curTenant = scope;
            this.queryTenantRoleForPage();
        },
        /**获取修改的菜单list */
        getMenuList(){
            let menuList= [];
            this.authorityConfig.adminConfig.map((item,index)=>{
                if(item.isChecked){
                    menuList.push(item.sysId);
                };
                item.children.map(tmp =>{
                    if(tmp.isChecked){
                        menuList.push(tmp.sysId);
                    };
                })
            });
            return menuList;
        },
        /**编辑角色ok按钮回调 */
        modify(){
            let _this = this;
            let config = {
                data:{
                    sysId: _this.curRoleId,
                    roleCode: _this.curRoleCode,
                    roleName: _this.operation=='editDefault'?_this.dForm.roleName:_this.eForm.roleName,
                    roleType: _this.curRoleType,
                    permissionType: _this.operation=='editDefault'?_this.dForm.permissionType:_this.eForm.permissionType,
                    menuList: _this.getMenuList()
                },
                headers: Headers.json
            };
            company.editRole(config).then(res=>{
                if(res.code == '0'){
                    this.$Message.info('修改角色菜单成功');
                    this.showDefault = false;
                    this.showModal = false;
                    if(_this.operation=='editDefault'){
                        _this.changePageNum(1);
                    }
                    else{
                        _this.queryTenantRoleForPage();
                    }
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**清空数组 */
        spliceArr(){
            this.authorityConfig.adminConfig.splice(0,this.authorityConfig.adminConfig.length);
            this.authorityConfig.checkAllGroup.splice(0,this.authorityConfig.checkAllGroup.length);
        },
        /**映射父子菜单 
         * @param children 所有的子菜单集合
        */
        mapChildren(children){
            this.authorityConfig.adminConfig.map((item,index) =>{
                let tmp = [];
                children.map(citem =>{
                    if(citem.parentCode == item.menuCode){
                        tmp.push(citem);
                    }
                })
                item.children = tmp;
                
            });
        },
        /**组合复选框 赋初值*/
        initCbGroup(){
            this.authorityConfig.adminConfig.map((item,index) =>{
                let checkedArr = [];
                item.children.map(citem =>{
                    if(citem.isChecked){
                        checkedArr.push(citem.menuName);
                    }
                })
                this.authorityConfig.checkAllGroup[index] = checkedArr;

                if(checkedArr.length == item.children.length){
                    this.authorityConfig.indeterminate[index] = false;
                    this.authorityConfig.checkAll[index] = true;
                }
                else if(checkedArr.length > 0){
                    this.authorityConfig.indeterminate[index] = true;
                    this.authorityConfig.checkAll[index] = false;
                }
                else{
                    this.authorityConfig.indeterminate[index] = false;
                    this.authorityConfig.checkAll[index] = false;
                }
            });
        },
        /**查询当前角色的权限 */
        getAuthority(){
            let config = {
                data:{
                    roleId: this.curRoleId 
                },
                headers: Headers.json
            };
            this.spliceArr();
            company.getAuthority(config).then(res =>{
                if(res.code == '0'){
                    this.tableData = res.resultData;
                    this.sortMenu(res.resultData);
                }
            }, err =>{
                this.$Message.error(err);
            })
        },
        /**编辑默认角色 */
        editDefaultRole(role){
            this.showDefault = true;
            this.operation = 'editDefault';
            this.curRoleId = role.sysId;
            this.curRoleCode = role.roleCode;
            this.curRoleType = role.roleType;
            this.dForm.permissionType = role.permissionType + '';
            this.dForm.roleName = role.roleName;
            this.getAuthority();
        },
        /**编辑租户角色 */
        editCompanyRole(role){
            this.showModal = true;
            this.operation = 'editSelf';
            this.curRoleId = role.sysId;
            this.curRoleCode = role.roleCode;
            this.curRoleType = role.roleType;
            this.eForm.permissionType = role.permissionType + '';
            this.eForm.roleName = role.roleName;
            this.getAuthority();
        },
        /**选择角色项 */
        selectRole(index){
            this.curRoleIndex = index;
            this.showManageModal = false;
            if(index == 0){
                this.changePageNum(this.pageNum);
            }
            else{
                this.changeCompanyPageNum(this.pageCompanyNum);
            }
        },
        ok(){
            this.showModal = false;
            this.modify();
        },
        cancel(){
            this.showModal = false;
        },
        /**默认角色 切换表格页码 */
        changePageNum(val){
            try{
                let config = {
                    data:{
                        pageNum: val,
                        pageSize: this.pageSize
                    },
                    headers: Headers.urlencoded
                }
                company.getDefaultRole(config).then(res =>{
                    if(res.code == '0'){
                        this.totalNum = res.resultData.total;
                        this.curPageData.splice(0,this.curPageData.length);
                        this.curPageData = res.resultData.list;
                    }
                    else{
                        this.$Message.warning(res.message);
                    }
                }, error =>{
                    this.$Message.error(err);
                });
            }
            catch(e){
                this.$Message.info('查询默认角色列表出错');
            }
        },
        /**租户角色 切换表格页码 */
        changeCompanyPageNum(val){
            try{
                let config = {
                    data:{
                        pageNum: val,
                        pageSize: this.pageSize
                    },
                    headers: Headers.urlencoded
                }
                company.getCompanyRole(config).then(res =>{
                    if(res.code == '0'){
                        this.totalCompanyNum = res.resultData.total;
                        this.curCompanyPageData.splice(0,this.curCompanyPageData.length);
                        this.curCompanyPageData = res.resultData.list;
                    }
                }, error =>{
                    
                });
            }
            catch(e){
                this.$Message.info('查询默认角色列表出错');
            }
        }
    },
    mounted() {
        this.changePageNum(1);
    },
}
</script>
<style lang="less">
.context{
    background-color: white;
    min-height: 600px;
}
.role{
    .role-header{
        height: 107px;
        line-height: 107px;
        font-size: 16px;
        font-weight: bold;
        padding-left: 40px;
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
    .role-list{
        .role-layout{
            margin-left: 40px;
            min-height: 600px;
            border: 1px solid #EBEDF0;
        }
        .role-item{
            height: 48px;
            line-height: 48px;
            cursor: pointer;
            padding-left: 40px;
        }
        .selected-role{
            background-color: #f0faf6;
            color: #13C27C;
        }
    }
    .role-info{
        .role-manage{
            .nav{
                .back{
                    text-align:left;
                    padding-left:10px;
                    cursor:pointer;
                    font-size:18px;
                    font-weight: bold;
                    padding:5px;
                }
            }
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