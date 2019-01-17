<template>
    <Row class="session-history">
        <Row class="top">
            <Col span="24" style="font-size:16px;padding-left:40px;font-weight:bold;">会话历史</Col>
        </Row>
        <Row>
            <Col span="4" class="tenant-list">
                <Row class="tenant-layout">
                    <Row class="title">分组列表({{tenantList.length || 0}})</Row>
                    <Row v-for="(item,index) in tenantList" :key="index" @click.native="selectTenant(item,index)"
                        :class="{'tenant-item':true,'selected-tenant':index == curTenantIndex}">{{item.tenantName}}</Row>
                </Row>
            </Col>
            <Col span="20" class="history-info">
                <Row class="history-list">
                    <x-table :data="curPageData" :show-header="showHeader" ref="default" no-data-text="没有数据">
                        <x-table-column title="昵称" prop="nickName"></x-table-column>
                        <x-table-column title="发起时间" prop="startTime"></x-table-column>
                        <x-table-column title="渠道" prop="channelType"></x-table-column>
                        <x-table-column title="操作">
                            <template slot-scope="scope">
                                <Button type="text" @click="reCall(scope)" icon="arrow-return-right" title="回呼">回呼</Button>
                            </template>
                        </x-table-column>
                    </x-table>
                </Row>
                <Row class="page" type="flex" justify="end">
                    <Page :total="totalNum" @on-change="changePageNum"></Page>
                </Row>
            </Col>
        </Row>
    </Row>
</template>
<script>
import xTable from "@/components/common/xTable";
import xTableColumn from "@/components/common/xTableColumn";
import kfApi from '../../service/kfApi'
import {Headers} from '../common/Consts.js'
import { formatDate as formatLocalDate, isNull } from '../../utils'
export default {
    name: 'SessionHistory',
    data(){
        return {
            curTenantIndex: -1,
            tenantList: [],
            curTenant: {},
            curPageData: [
                {
                    tenantName: 'aaaaa',
                    csGroupNum: '2',
                    csUserNum: '10',
                    maxSeatNum: '20',
                    managerType: 'bbbb'
                }
            ],
            showHeader: true,
            totalNum: 0,
            pageSize: 10,
            pageNum: 1,
        }
    },
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
        }
    },
    methods:{
        /**回呼 */
        reCall(scope){
            let config = {
                data: {
                    sessionId: scope.sessionId,
                    tenantId: this.curTenant.sysId,
                    customerId: scope.busiId,
                    seatId: scope.seatId,
                    sessionSource: scope.customerChannel,
                },
                headers: Headers.json
            }
            kfApi.reCall(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('回呼成功');
                    this.queryHistory();
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err =>{
                this.$Message.error(err);
            })
        },
        /**查询历史记录 */
        queryHistory(){
            let config = {
                data: {
                    tenantId: this.curTenant.sysId,
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                },
                headers: Headers.json
            }
            kfApi.queryHistory(config).then(res =>{
                if(res.code == '0'){
                    this.totalNum = res.resultData.total;
                    console.log("res.resultData.list %o",res.resultData.list);
                    this.curPageData = res.resultData.list;
                    this.curPageData.map((i,x) =>{
                        i.startTime = i.startTime?formatLocalDate(new Date(i.startTime*1000) , 'yy-MM-dd HH:mm:ss'):'';
                        if(isNull(i.nickName)){
                            i.nickName = '用户' + i.busiId;
                        }
                        if(i.customerChannel == 1){
                            i.channelType ='APP'
                        }else{
                            i.channelType ='微信小程序'
                        }
                    });
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err =>{
                this.$Message.error(err);
            })
        },
        selectTenant(tenant, index){
            this.curTenantIndex = index;
            this.curTenant = tenant;
            this.queryHistory();
        },
        changePageNum(num){
            this.pageNum = num;
            this.queryHistory();
        }
    },
    mounted(){
        this.tenantList = this.servedTenant;
        if(this.tenantList){
            this.tenantList.map((i,x) =>{
                if(x == 0){
                    this.selectTenant(i,x);
                }
            })
        }
    }
}
</script>
<style lang="less">
.session-history{
    background-color: white;
    .top{
        height: 107px;
        line-height: 107px;
    }
    .tenant-list{
        .tenant-layout{
            margin-left: 40px;
            border: 1px solid #EBEDF0;
            min-height: 600px;
            .title{
                height: 60px;
                line-height: 60px;
                padding-left: 30px;
                background-color: #fafafc;
                font-weight: bold;
            }
            .tenant-item{
                height: 60px;
                line-height: 60px;
                padding-left: 30px;
                cursor: pointer;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .selected-tenant{
                background-color: #f0faf6;
                color: #13C27C;
            }
        }
        
    }
    .history-info{
        padding: 0px 10px;
    }
    .page{
        ul{
            margin: 10px 0px;
        }
        
    }
}
</style>