<template>
    <Row class="kf-group">
        <Row class="top">
            <span class="top-title">客服分组</span>
        </Row>
        <Row class="content">
            <Col span="4" class="content-left">
                <Row class="dept-list">
                    <Row class="dept-title">分组列表({{companyList.length || 0}})</Row>
                    <Row :style="{height:'540px','overflow-y':companyList.length > 11?'scroll':'hidden'}">
                        <Row class="nav" :class="{'selected':curCompany == index}" v-for="(item,index) in companyList" 
                            :key="index" @click.native="selectCompany(item,index)">{{item.tenantName}}</Row>
                    </Row>
                </Row>
            </Col>
            <Col span="20" class="content-right">
                <Row class="inline-right">
                    <Row v-show="groupList.length > 0"> 
                        <Col span="8" v-for="(item,index) in groupList" :key="index" class="group">
                            <Row class="group-inline">
                                <Row class="group-header">
                                   <Col span="18"> {{item.groupName + '(' + item.groupPersonCount + '人)'}}</Col>
                                   <Col span="6" align="right">
                                        <Button type="text" style="background:none;" @click.native="memberManagement(item.busId)" icon="ios-people">成员管理</Button>
                                    </Col>
                                </Row>
                                <Row class="add-kf">
                                    <!-- <Button v-show="custoumer" type="text" @click="addKF" icon="plus">添加客服</Button> -->
                                    <Row>
                                        <Col span="5" v-for="(i,x) in item.seatInfoList" :key="x">
                                            <Row type="flex" justify="center" align="middle" style="flex-direction:column;line-height:30px;margin-top:10px;">
                                                <Col span="5"><Icon type="android-person" style="font-size:22px;height:20px;"></Icon></Col>
                                                <Col span="14" style="text-overflow:ellipsis;" class="person-name" :title="i.seatName">{{i.seatName}}</Col>  
                                            </Row>  
                                        </Col>
                                    </Row>
                                </Row>
                                <Modal
                                    v-model="management"
                                    title="添加客服"
                                    @on-ok="addKF"
                                    @on-cancel="cancel">
                                    <Row style="border-bottom:1px solid #eee">全部坐席({{seatInfoList.length || 0}})</Row>
                                    <Row style="height:200px; overflow-y:scroll;">
                                        <Row style="font-size:14px; margin-top:10px;">
                                            
                                            <CheckboxGroup v-model="curSeatList" @on-change="changeSeat(item)">
                                                <Row v-for="(item,index) in seatInfoList" :key="index">
                                                    <Checkbox :label="item.seatName"></Checkbox>
                                                </Row>
                                            </CheckboxGroup>
                                        </Row>
                                    </Row>
                                </Modal>                                
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <Row class="group-inline">
                                <Row class="add-group">
                                    <Button type="text" @click="addGroup" icon="plus">添加客服组</Button>
                                    <Modal
                                        v-model="showModal"
                                        title="添加客服组"
                                        @on-ok="ok"
                                        @on-cancel="cancel">
                                        <Row class="group-name">
                                            <Col span="4">组名</Col>
                                            <Col span="20"><Input v-model="customerGroupName" placeholder="请输入客服分组名称" /></Col>
                                        </Row>
                                        <Row class="blessing">
                                            <Col span="4">客服组问候语</Col>
                                            <Col span="20">
                                                <Row class="blessing-switch"><i-switch v-model="blessingSwitch" @on-change="change"></i-switch></Row>
                                                <Row class="blessing-text"><Input type="textarea" v-model="blessing" row="4"></Input></Row>
                                            </Col>
                                        </Row>
                                    </Modal>
                                </Row>
                            </Row>
                        </Col>
                    </Row>
                </Row>
            </Col>
        </Row>
    </Row>
</template>
<script>
import kfApi from '../../service/kfApi';
import {Headers} from '../common/Consts.js';
export default {
    name: 'KFGroup',
    data(){
        return {
            curGroupId: '',
            curTenantId: '',
            showModal: false,
            modal1: false,
            AllNum:"30",
            management: false,
            companyList:[],
            customerGroupName:'',
            seatInfoList:[],
            curSeatList:[],
            groupList: [],
            curCompany: 0,
            blessingSwitch: false,
            blessing: '',
        }
    },
    methods: {
        /**选择坐席 */
        changeSeat(item){
        },
        /** */
        addKF(){
            this.addSeatGroupByTenant();
        },
        /**绑定技能组与坐席关系 */
        addSeatGroupByTenant(){
            let tmp = [];
            this.seatInfoList.map((i,x) =>{
                this.curSeatList.map((si,sx) =>{
                    if(i.seatName == si){
                        tmp.push(
                            {
                                busId: i.busId,
                                seatName: i.seatName
                            }
                        )
                    }
                })
            })
            let config = {
                data: {
                    skillGroupId: this.curGroupId,
                    seatInfoList: tmp
                },
                headers: Headers.json
            }
            kfApi.addSeatGroupByTenant(config).then(res=>{
                if(res.code == '0'){
                    this.$Message.info('添加客服分组成功');
                    this.getKfGroup();
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err); 
            })
        },
        /**租户下添加技能组 */
        addKfgroup(){
            if(this.customerGroupName.length > 50){
                this.$Message.warning("客服组名称不能超过50个字符");
                return false;
            }
            let config = {
                data: {
                    tenantId: this.curTenantId,
                    groupName: this.customerGroupName,
                    greetingsOnOff: this.blessingSwitch== true?'1':'0',
                    greetingsContent: this.blessing
                },
                headers: Headers.json
            }
            kfApi.addKfgroup(config).then(res=>{
                if(res.code == '0'){
                    this.$Message.info('添加客服分组成功');
                    this.getKfGroup();
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err); 
            })
        },
        //点击成员管理
        memberManagement(groupId){
            this.management = true;
            this.curGroupId = groupId;
            this.curSeatList.splice(0,this.curSeatList.length);
            this.querySeatsByTenantId();
        },
        /**根据技能组ID 租户ID 获取租户下坐席以及勾选状态 */
        querySeatsByTenantId(){
            let config = {
                data: {
                    tenantId: this.curTenantId,
                    skillGroupId: this.curGroupId
                },
                headers: Headers.json
            }
            kfApi.querySeatsByTenantId(config).then(res =>{
                if(res.code == '0'){
                    this.seatInfoList = res.resultData;
                    this.curSeatList.splice(0,this.curSeatList.length);
                    res.resultData.map((i,x) =>{
                        if(i.isChecked){
                            this.curSeatList.push(i.seatName);
                        }
                    })
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**查询租户下技能组信息（包含技能组下的人数） */
        getKfGroup(){
            let config = {
                data: {
                    tenantId : this.curTenantId
                },
                headers: Headers.json
            }
            kfApi.querySkillGroup(config).then(res =>{
                if(res.code == '0'){
                    this.groupList = res.resultData;
                }else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        selectCompany(item,index){
            this.curCompany = index;
            this.curTenantId = item.sysId;
            this.getKfGroup();
        },
        addGroup(){
            this.showModal = true;
        },
        ok(){
           this.addKfgroup();
        },
        cancel(){},
        change(){},
        /**根据权限获取对应的租户列表 */
        async queryTenantByPermi(){
            let config = {
                headers: Headers.json
            };
            return await kfApi.queryTenantByPermi(config).then(res =>{
                if(res.code == '0'){
                    this.companyList = res.resultData || [];
                }else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        }
    },
    mounted(){
        this.queryTenantByPermi().then(()=>{
            if(this.companyList.length > 0){
                this.companyList.map((i,x) =>{
                    if(x == 0){
                        this.curTenantId = i.sysId;
                        this.getKfGroup();
                    }
                })
            }
        });
    },
}
</script>
<style lang="less">
.kf-group{
    background-color: white;
    .top{
        height: 107px;
        line-height: 107px;
        .top-title{
            font-size: 16px;
            font-weight: bold;
            text-align: left;
            padding-left: 40px;

        }
        
    }
    .content{
        .content-left{
            background-color: white;
            
            .dept-list{
                margin-left: 40px;
                border: 1px solid #EBEDF0;
                min-height: 600px;
            }
            .dept-title{
                height: 60px;
                line-height: 60px;
                font-size: 14px;
                font-family: PingFangSC-Medium;
                font-weight: bold;
                color: #142921;
                padding-left: 40px;
                background: #fafafc;
            }
            .nav{
                line-height: 48px;
                text-align: left;
                padding-left:40px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;                
            }
            .selected{
                background-color: #f0faf6;
                color: #13C27C;
                cursor: pointer;
            }
        }
        .content-right{
            border: 1px solid #EBEDF0;
            border-left: none;
            min-height: 600px;
            .inline-right{
                background-color: white;
                margin-left: 10px;
                .group{
                }
                .group-inline{
                        margin: 10px;
                        border: 1px solid #e8e6e6;
                        .group-header{
                            background-color: #f7f7fa;
                            height: 32px;
                            line-height: 32px;
                            padding-left: 10px;
                        }
                        .add-kf,.add-group{
                            height: 110px;
                            line-height: 110px;
                            text-align: center;
                            .person-name{
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                        }
                        .add-group{
                            height: 142px;
                            line-height: 142px;
                            
                        }
                    }
            }
        }
    }
}
.group-name,.blessing{
    margin:10px 0px;
    .blessing-switch{
        text-align: right;
        padding-right: 10px;
    }
    .blessing-text{
        margin-top: 10px;
    }
}
</style>