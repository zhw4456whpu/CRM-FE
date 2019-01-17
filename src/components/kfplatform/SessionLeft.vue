<template>
    <Row class="session-left">
        <Col :xs="1" :sm="4" :md="8" :lg="12" style="min-height:675px;border-right: 1px solid #e6eaf2;">
            <Row class="depts-list">分组列表({{props.depts.length}})</Row>
            <Row v-for="(item,index) in props.depts" :key="index" 
                class="dept" @click.native="selectDept({item,index})"
                :class="{'selected':isCurDept == index}">
                <Col span="22">
                    <div class="text" >{{item.tenantName}}</div>
                </Col>
                <Col span="2" v-show="false">
                    <div class="circle"></div>
                </Col>
            </Row>
        </Col>
        <Col :xs="1" :sm="4" :md="8" :lg="12">
            <Tabs value="dealing" class="tabs" @on-click="changeTab">
                <TabPane label="进行中" name="dealing">
                    <Row style="margin:0px 0px 0px 20px;">
                        <AutoComplete v-model="props.searchKey" icon="ios-search" style="padding-right:20px;"
                            placeholder="搜索名字、昵称"
                            @on-change="search(props.searchKey, 'dealing')">
                        </AutoComplete>
                        <Row :style="{maxHeight:'545px','overflow-y':props.dealist.length > 11?'scroll':'hidden',marginTop:'20px'}">
                            <Row v-for="(di,dx) in props.dealist" :key="dx" class="person"
                                @click.native="selectDealing({di,dx})" 
                                :class="{'selected':curDealing.index == dx && curCusHxAccount == di.hxAccount}">
                                <Col span="6" style="text-align:center;height:48px;line-height:48px;">
                                    <img v-if="di.chatUserLogo" :src="di.chatUserLogo" style="width32px;height:32px;border-radius:50%;margin-top:8px;" />
                                    <Avatar v-else icon="person" />
                                </Col>
                                <Col span="18">
                                    <Row>
                                        <Col span="14" class="nickname" :title="di.chatUserNickName || '用户' + di.chatUserId">{{di.chatUserNickName || '用户' + di.chatUserId}}</Col>
                                        <Col span="10" class="lasttime">{{di.startTime}}</Col>
                                    </Row>
                                    <Row class="msg">{{di.sessionRemark}}</Row>
                                </Col>
                            </Row>
                        </Row>
                    </Row>
                </TabPane>
                <!-- <TabPane label="客服同事" name="workmate">
                    <Row style="margin:0px 20px;">
                        <AutoComplete v-model="props.searchKey" icon="ios-search" 
                            placeholder="搜索名字、昵称"
                            @on-change="search(props.searchKey, 'workmate')">
                        </AutoComplete>
                        <Row style="height:10px"></Row>
                        <Row v-for="(di,dx) in props.workmateList" :key="dx" class="person"
                            @click.native="selectKF({di,dx})" :class="{'selected':curKF.index == dx && curCusHxAccount == di.hxAccount}">
                            <Col span="6" style="text-align:center;center;height:48px;line-height:48px;">
                                <Avatar icon="ios-person" />
                            </Col>
                            <Col span="18">
                                <Row>
                                    <Col span="14" class="nickname" :title="di.nickName || '同事' + di.chatUserId">{{di.nickName || '同事' + di.chatUserId}}</Col>
                                    <Col span="10" class="lasttime">{{di.startTime}}</Col>
                                </Row>
                                <Row class="msg">{{di.sessionRemark}}</Row>
                            </Col>
                        </Row>
                    </Row>
                </TabPane> -->
            </Tabs>
        </Col>
    </Row>
</template>
<script>
export default {
    name: 'SessionLeft',
    props: ['props'],
    computed: {
        curCustomerId: {
            get() {
                return this.$store.state.curCustomerId;
            },
            set(val) {
                this.$store.dispatch('setCurCustomerId', val);
            }
        },
        /**当前会话的客户的环信账户 */
        curCusHxAccount: {
            get() {
                return this.$store.state.curCusHxAccount;
            },
            set(val) {
                this.$store.dispatch('setCurCusHxAccount', val);
            }
        },
    },
    data(){
        return {
            isCurDept: -1,
            curKF:{
                index: 5
            },
            curDealing:{
                index: 5
            }
        }
    },
    methods: {
        selectDept(value){
            this.isCurDept = value.index;
            this.$emit('deptClick',value);
        },
        selectDealing(value){
            this.curDealing.index = value.dx;
            this.$emit('kfClick', {...value,type:'dealing'});
        },
        selectKF(value){
            this.curKF.index = value.dx;
            this.$emit('kfClick', {...value,type:'workmate'});
        },
        search(searchText, type){
            this.$emit('search', {searchText: searchText, type: type});
        },
        changeTab(value){
            this.$emit('changeTab',value);
        }
    }
}
</script>
<style lang="less" scoped>
.session-left{
    margin-left: 40px;
    border: 1px solid #EBEDF0;
    .depts-list{
        height: 60px;
        line-height: 60px;
        font-size:14px;
        font-family:PingFangSC-Medium;
        font-weight: bold;
        color:rgba(20,41,33,1);
        padding-left: 30px;
        background:rgba(250,250,252,1);
    }
    .dept{
        height: 60px;
        line-height: 60px;
        text-align: left;
        

        .text{
            padding: 0px 10px 0px 30px;
            cursor: pointer;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .circle{
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: red;
            margin: 18px 18px 0px 0px;
        }
    }
    .selected{
        background-color: #f0faf6;
        color: #13C27C;
    }
    .tabs{
        .person{
            cursor: pointer;
            .nickname{
                text-align: left;
                padding-left:5px;
                height: 24px;
                line-height: 24px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow:ellipsis;
            }

            .lasttime{
                text-align: right;
                padding-right:5px;
                height: 24px;
                line-height: 24px;
            }

            .msg{
                height: 24px;
                line-height: 24px;
                text-align: left;
                padding-left:5px;
                font-size: 12px;
            }
        }
        .ivu-tabs-bar{
            background-color: #FAFAFC;
        }
    }
}
</style>