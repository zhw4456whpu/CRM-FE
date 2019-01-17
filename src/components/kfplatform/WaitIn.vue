<template>
    <div class="wait-in">
        <Row class="top">
            <Col span="12" class="title">待接入</Col>
            <Col span="12" class="btn">
                <!-- <Button type="text" @click="filter('popup')">筛选排序</Button> -->
            </Col>
            <!--<Modal v-model="filterModal" @on-ok="filter('save')" title="筛选排序">
                <Form v-model="formItem">
                    <FormItem label="时间段" :label-width="80">
                        <Row>
                            <Select v-model="formItem.timeSection">
                                <Option v-for="(item,index) in formItem.timeSectionLsit" :key="index" :value="item.name">{{item.name}}</Option>
                            </Select>
                        </Row>
                        <Row>
                            <DatePicker type="datetimerange" v-model="timeSection" style="width: 300px"></DatePicker>
                        </Row>
                    </FormItem>
                </Form>
            </Modal>-->
        </Row>
        <Row class="dept-info">
            <Col span="4" class="dept-list">
                <Row class="dept-layout">
                    <Row class="dept-title">分组列表({{pendingList.length || 0}})</Row>
                    <Row v-for="(item,index) in pendingList" :key="index"  v-bind:class="{active:index==isActive}" @click.native="checkItem(item,index)" class="pending">
                        <Col span="22">
                            <div class="text" >{{item.tenantName}}</div>
                        </Col>
                    </Row>
                </Row>
            </Col>  
            <Col span="20" class="table-layout">
                <x-table :data="waitData" ref="default" no-data-text="没有数据">
                    <x-table-column title="昵称" prop="chatUserNickName"></x-table-column>
                    <x-table-column title="发起时间" prop="startTime"></x-table-column>
                    <!-- <x-table-column title="技能组" prop="groupName"></x-table-column>
                    <x-table-column title="坐席名" prop="seatName"></x-table-column> -->
                    <x-table-column title="渠道" prop="channelType"></x-table-column>
                    <!-- <x-table-column title="关联" prop="nickName"></x-table-column> -->
                    <!-- <x-table-column title="vip客户" prop="isVip"></x-table-column>
                    <x-table-column title="客户标签" prop="customerTag"></x-table-column> -->
                    <x-table-column title="操作">
                        <template slot-scope="scope">
                            <Button type="text" icon="arrow-right-c" title="接入" @click.native="connect(scope)"></Button>
                            <Button type="text" icon="shuffle" title="转接" @click.native="changeConnect('popup', scope)"></Button>
                            <Modal v-model="showModal" title="选择转接对象" @on-ok="changeConnect('save', scope)" >
                                <Tabs value="kf" @on-click="changeTab">
                                    <TabPane label="客服" name="kf">
                                        <Input v-model="searchKey" placeholder="客服" class="search">
                                            <Button slot="append" icon="ios-search" @click="search(searchKey)"></Button>
                                        </Input>
                                        <Row type="flex" justify="space-between" align="middle" class="kf-list"
                                            :style="{'overflow-y':kfSource.length > 6?'scroll':'hidden'}">
                                            <Col span="11" v-for="(item,key) in kfSource" :key="key" class="kf-item" 
                                                :class="{'selected':item.busId== curKF.busId}" 
                                                @click.native="changeTo(item, key, 'KF')">
                                                {{item.seatName}}
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane label="技能组" name="kfGroup">
                                        <Input v-model="searchKey" placeholder="技能组" class="search">
                                            <Button slot="append" icon="ios-search" @click="search(searchKey)"></Button>
                                        </Input>
                                        <Row type="flex" justify="space-between" align="middle" class="kf-list" 
                                            :style="{'overflow-y':kfGroupSource.length > 6?'scroll':'hidden'}">
                                            <Col span="11" v-for="(item,key) in kfGroupSource" :key="key" class="kf-item" 
                                                :class="{'selected':item.busId== curKFGroup.busId}" 
                                                @click.native="changeTo(item, key, 'KFG')">
                                                {{item.groupName}}
                                            </Col>
                                        </Row>
                                    </TabPane>
                                </Tabs>
                            </Modal>
                            <Button type="text" icon="power" title="拒接" @click.native="refuse('popup', scope)"></Button>
                            <Modal v-model="refuseModal" title="拒接" @on-ok="refuse('save',scope)">
                                <Input type="textarea" :rows="3" v-model="refuseReason" />
                            </Modal>
                        </template>
                    </x-table-column>
                </x-table>
                <Row class="page">
                    <Page :pageSize="pageSize" :pageNum="pageNum" :total="total" @on-change="changeNum"></Page>
                </Row>
            </Col>
        </Row>
    </div>
</template>
<script>
import kfApi from '../../service/kfApi'
import {Headers} from '../common/Consts.js'
import { formatDate as formatLocalDate } from '../../utils'
import xTable from "@/components/common/xTable";
import xTableColumn from "@/components/common/xTableColumn";
import { isNull } from '../../utils'
export default {
    name:'waitln',
    components:{
        xTable,xTableColumn
    },
    computed:{
        servedTenant:{
            get(){
                return this.$store.state.servedTenant;
            },
            set(val){
                this.$store.dispatch('setServedTenant', val);
            }
        },
        hxAccount: {
            get(){
                return this.$store.state.curHxAccount;
            },
            set(val){
                this.$store.dispatch('setCurHxAccount', val);
            }
            
        },
    },
    data () {
        return {
            curTenantId: '',
            refuseModal: false,
            refuseReason: '',
            curPageNum: 1,
            curKFGroup:{},
            kfGroupSource:[],
            curKF:{},
            kfSource:[],
            searchKey: '',
            curTransferType: '',
            showModal: false,
            total: 0,
            pageSize: 10,
            pageNum: 1,
            deptNum: 0,
            formItem:{
                timeSection: '',
                timeSectionLsit:[
                    {
                        name: '昨天'
                    },
                    {
                        name: '今天'
                    }
                ],
            },
            filterModal: false,
            isActive:0,
            pendingList :[],
            waitData: [],
        }
    },
    methods:{
        /**客服、客服组单击 */
        changeTo(item, key, type){
            if(type == 'KF'){
                this.curKF = item;
            }
            else{
                this.curKFGroup = item;
            }
        },
        /**搜索 */
        search(s){},
        /**获取客服分组 */
        querySkillGroup(){
            let config = {
                data:{
                    tenantId: this.curTenantId
                },
                headers: Headers.json
            };
            kfApi.querySkillGroup(config).then(res=>{
                if(res.code == '0'){
                    this.kfGroupSource = res.resultData;
                }
                else{
                    this.$Message.info(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**获取客服信息列表 */
        queryCsUser(){
            let config = {
                data:{
                    tenantId: this.curTenantId
                },
                headers: Headers.json
            }
            kfApi.queryCsUser(config).then(res=>{
                if(res.code == '0'){
                    this.kfSource = res.resultData.filter(i=>{
                        return i.seatCode != this.hxAccount && i.enableStatus==0;
                    });
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**转接到客服或者客服分组，切换tab */
        changeTab(val){
            this.curTransferType = val;
            if(val == 'kf'){
                this.queryCsUser();
            }
            else{
                this.querySkillGroup();
            }
        },
        /**发起转接 */
        changeConnect(type, scope){
            var _this = this;
            if(type == 'popup'){
                this.showModal = true;
                this.changeTab('kf');
            }
            else{
                let transferObjId = this.curTransferType == 'kf'?this.curKF.busId:this.curKFGroup.busId;
                if(isNull(transferObjId)){
                    this.$Message.warning("请选择转接的客服");
                    return false;
                }
                let config = {
                    data: {
                        transferObjId: transferObjId,
                        transferObjType: this.curTransferType=='kf'?1:2
                    },
                    headers: Headers.json
                }
                kfApi.cTOIsOnline(config).then(res=>{
                    if(res.code == '0'){
                        this.showModal = false;
                        if(res.resultData){
                            _this.confirmTransfer(scope);
                        }
                        else{
                            _this.$Modal.confirm({
                                title: '请您确认',
                                content: '目前无在线客服,请问您继续转接吗？',
                                onOk: function(){
                                    _this.confirmTransfer(scope);
                                },
                                onCancel(){}
                            })
                        }
                    }
                    else{
                        this.$Message.warning(res.message);
                    }
                },err=>{
                    this.$Message.error(err);
                })
            }
        },
        /**确定转接 */
        confirmTransfer(scope){
            let transferObjId = this.curTransferType == 'kf'?this.curKF.busId:this.curKFGroup.busId;
            if(isNull(transferObjId)){
                this.$Message.warning('请选择转接对象');
                return false;
            }
            kfApi.addTransferSession({
                data: {
                    busiId: scope.busiId,
                    transferObjId: transferObjId,
                    transferObjType: 1
                },
                headers: Headers.json
            }).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('转接成功');
                    this.queryWaitSessionForPage();
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, error=>{
                this.$Message.error(error);
            });
        },
        /**接入 */
        connect(scope){
            kfApi.updateJoinSession({
                data: {
                    sessionStatus: 1,
                    busiId : scope.busiId
                },
                headers: Headers.json
            }).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('接入成功');
                    this.queryWaitSessionForPage();
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err =>{
                this.$Message.error(err);
            })
        },
        /**拒接 */
        refuse(type, scope){
            if(type == 'popup'){
                this.refuseModal = true;
            }
            else{
                kfApi.updateRefuseSession({
                    data: {
                        busiId: scope.busiId,
                        refuseReason: this.refuseReason
                    },
                    headers: Headers.json
                }).then(res =>{
                    if(res.code == '0'){
                        this.$Message.info('拒接成功');
                        this.queryWaitSessionForPage();
                    }
                    else{
                        this.$Message.warning(res.message);
                    }
                },err=>{
                    this.$Message.error(err);
                })
            }
        },
        /**页码改变的回调，返回改变后的页码 */
        changeNum(val){
            this.waitData.splice(0, this.waitData.length);
            this.curPageNum = val;
        },
        /**筛选排序 */
        filter(type){
            if(type == 'popup'){
                this.filterModal = true;
            }
        },
        /**客服工作台 - 根据用户查询待接入会话列表 */
        queryWaitSessionForPage(){
            let config = {
                data: {
                    tenantId: this.curTenantId,
                    pageNum: this.curPageNum,
                    pageSize: this.pageSize
                },
                headers: Headers.urlencoded
            }
            kfApi.queryWaitSessionForPage(config).then(res=>{
                if(res.code == '0'){
                    this.waitData = res.resultData.list;
                    this.total = res.resultData.total;
                    this.waitData.map(i =>{
                        i.startTime = formatLocalDate(new Date(i.startTime*1000) , 'yy-MM-dd HH:mm:ss');
                        if(isNull(i.chatUserNickName)){
                            i.chatUserNickName = '用户' + i.chatUserId;
                        }
                        if(i.channelType == 1){
                            i.channelType ='APP'
                        }else{
                            i.channelType ='微信小程序'
                        }
                    })
                }else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**选择租户 */
        checkItem(item, index){
            this.isActive=index;
            this.curTenantId = item.sysId;
            this.queryWaitSessionForPage();
            
        }
    },
    mounted(){
        this.pendingList = this.servedTenant || [];
        this.pendingList.map((i,x)=>{
            if(x == 0){
                this.checkItem(i,x);
            }
        })
    }    
}
</script>
<style  lang="less" scoped>
.search{
    margin-bottom: 10px;
}
.kf-list{
    min-height: 100px;
    max-height: 200px;
    
    .kf-item{
        height: 48px;
        line-height: 48px;
        margin: 0px 0px 10px 0px;
        border: 1px solid #EBEDF0;
        border-radius: 5px;
        cursor: pointer;
        padding-left: 20px;
    }
    .kf-item.selected{
        background-color: #f0faf6;
        color: #13C27C;
    }
}
.wait-in{
    background:#fff;
    padding:0px 20px 20px 0;
    overflow: hidden;
    .top{
        height: 107px;
        line-height: 107px;
        .title{
            font-size: 16px;
            font-weight: bold;
            padding:0px 10px 0px 40px;
        }
        .btn{
            text-align: right;
            padding-right: 20px;
        }
    }
    .dept-info{
        min-height: 600px;
        
        .dept-list{
            min-height:1px;
            padding-left:40px;
            
            .dept-layout{
                border: 1px solid #EBEDF0;
                min-height: 600px;
            }
            
            
        }
        .dept-title{
            height: 60px;
            line-height: 60px;
            font-size:14px;
            font-family:PingFangSC-Medium;
            font-weight: bold;
            color:rgba(20,41,33,1);
            padding-left: 30px;
            background:rgba(250,250,252,1);
        }
        .pending{
            height: 60px;
            line-height:60px;
            cursor: pointer;
            .text{
                text-align: left;
                padding-left: 40px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .table-layout{
            min-height: 600px;
            .page{
                text-align: right;
            }
        }
    }
    
    .active{
        background-color: #f0faf6;
        color: #13C27C;
    }
}

</style>
