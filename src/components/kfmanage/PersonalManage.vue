<template>
    <div class="personal-manage">
        <Row v-show="props.showkfModal">
            <Row class="top common">
                <Col span="10" class="top-left">
                    <Col span="24" class="top-type" @click.native="back">
                        <Icon type="ios-arrow-left"></Icon> 返回 {{props.curTenantName + (props.curCenterName?'-'+props.curCenterName:'')}}
                    </Col>
                </Col>
                <Col span="14" class="top-right">
                    <Row type="flex" justify="end">
                        <Col style="width:200px;margin-right:10px;">
                            <Input icon="search" v-model="searchKey" placeholder="请输入客服昵称" @on-click="search"></Input>
                        </Col>
                        <Col style="width:110px;">
                            <Button type="primary" @click="addKF" icon="ios-plus-empty">添加客服</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row class="kf-content">
                <x-table :data="props.curPageData" :show-header="props.showHeader" ref="default" no-data-text="没有数据">
                    <x-table-column title="编号" prop="seatCode">
                    </x-table-column>
                    <x-table-column title="用户名" prop="userAccount"></x-table-column>                
                    <x-table-column title="客服昵称" prop="seatName"></x-table-column>
                    <x-table-column title="在线状态" prop="loginStatus">
                        <template slot-scope="scope">
                            {{scope.loginStatus=='1'?'在线':scope.loginStatus=='2'?'离线':'忙碌'}}
                        </template>                    
                    </x-table-column>
                    <x-table-column title="接待数" prop="maxWaitNum"></x-table-column>
                    <x-table-column title="角色" prop="roleName"></x-table-column>
                    <x-table-column title="账户启用" prop="enableStatus">
                        <template slot-scope="scope">
                            <Checkbox disabled v-model="scope.enableStatus=='0'?true:false"></Checkbox>
                        </template>
                    </x-table-column>
                    <x-table-column title="人员类型" prop="isPrivate">
                        <template slot-scope="scope">
                            {{scope.isPrivate=='0'?'自有':'外部'}}
                        </template>
                    </x-table-column>
                    <x-table-column title="所属租户" prop="tenantName"></x-table-column>
                    <x-table-column title="操作">
                        <template slot-scope="scope">
                            <Button type="text" size="large" @click="editKF(scope)" icon="edit" title="编辑"></Button>
                            <Button type="text" size="large" @click="resetPwd(scope)" icon="refresh" title="重置密码"></Button>
                            <!-- <Button type="text" size="large" @click="delKF" icon="ios-trash-outline" title="删除"></Button> -->
                        </template>
                    </x-table-column>
                </x-table>
                <Row class="page">
                    <Page :total="props.page.total" @on-change="changePageNum"></Page> 
                </Row>
            </Row> 
        </Row>
    </div>
</template>
<script>
import xTable from "@/components/common/xTable";
import xTableColumn from "@/components/common/xTableColumn";
export default {
    name:'PersonalManage',
    components:{
        xTable,xTableColumn
    },
    props: ['props'],
    data(){
        return {
            searchKey: ''
        }
    },
    methods:{
        search(){
            this.$emit('search',{'searchKey': this.searchKey});
        },
        /**重置密码 */
        resetPwd(scope){
            this.$emit('resetPwd',scope);
        },
        back(){
            this.$emit('back');
        },
        addKF(){
            this.$emit('addKF');
        },
        editKF(scope){
            this.$emit('editKF',scope);
        },
        changePageNum(val){
            this.$emit('changePMNum', val)
        }
    }
}
</script>
<style lang="less" scoped>
.personal-manage{
    .common{
        height: 107px;
        line-height: 107px;
        padding-left: 40px;
        font-size:18px;
        font-family: PingFangSC-Medium;
        font-weight: bold;
        color:rgba(20,41,33,1);
    }
}
</style>