<template>
    <Row class="common-phrase">
        <Row class="top" v-show="!ifEmbed">
            <Col span="12" class="title">常用语</Col>
        </Row>
        <Row>
            <Col span="4" v-show="!ifEmbed" class="phrase-left" :style="{minHeight: ifEmbed?'489px':'600px'}">
                <div class="dept-list" :style="{minHeight: ifEmbed?'489px':'600px'}">
                    <Row class="dept-title">分组列表({{deptList.length || 0}})</Row>
                    <Row class="dept" v-for="(item,index) in deptList" :key="index" @click.native="selectDept(item,index)" :class="{'selected': curDept.index == index}">
                        {{item.tenantName}}
                    </Row>
                </div>
            </Col>
            <Col :span="ifEmbed?24:20" class="phrase-right" :style="{minHeight: ifEmbed?'489px':'600px'}">
                <Collapse accordion value="1">
                    <Panel name="1">
                        <div class="category" style="float: right;text-align: left;">
                            <Col span="10">个人常用语</Col>
                            <Col span="14">
                                <Col style="width:40px;float: right;" v-show="!ifEmbed">
                                    <Icon type="chevron-down"></Icon>
                                </Col>
                                <Col @click.native.stop="addPhrase('','person')" style="width:40px;float: right;">
                                    <Icon type="plus"></Icon>
                                </Col>
                            </Col>
                        </div>
                        <div slot="content">
                            <Row class="phrase-item" v-for="(item,index) in phraseList.person" :key="index">
                                <Col span="12" class="phrase-text" :title="item.msgContent" @click.native="sendMsg(item.msgContent)">{{item.msgContent}}</Col>
                                <Col span="12">
                                    <Col @click.native="delPhrase(item,'person')" style="text-align: center;width:40px;float: right;">
                                        <Icon type="trash-a"></Icon>
                                    </Col>
                                    <Col @click.native="editPhrase(item,'person')" style="text-align: center;width:40px;float: right;">
                                        <Icon type="edit"></Icon>
                                    </Col>
                                </Col>
                            </Row>
                            <Collapse value="1-1" class="sub-category">
                                <Panel :name="ci.msgContent" v-for="(ci,cx) in phraseList.subCategory" :key="cx">
                                    <div class="category" style="float: right;text-align: left;">
                                        <Col span="10" class="phrase-text" :title="ci.msgContent">{{ci.msgContent}}</Col>
                                        <Col span="14" style="text-align: center;">
                                            <Col style="width:40px;float: right;">
                                                <Icon type="chevron-down" v-show="!ifEmbed"></Icon>
                                            </Col>
                                            <Col @click.native="delPhrase(ci,'profession')" style="width:40px;float: right;">
                                                <Icon type="trash-a"></Icon>
                                            </Col>
                                            <Col @click.native.stop="editPhrase(ci,'profession')" style="width:40px;float: right;">
                                                <Icon type="edit"></Icon>
                                            </Col>
                                            <Col @click.native.stop="addPhrase(ci,'profession')" style="width:40px;float: right;">
                                                <Icon type="plus"></Icon>
                                            </Col>
                                        </Col>
                                    </div>
                                    <p slot="content">
                                        <Row class="phrase-item" v-for="(item,index) in ci.children" :key="index">
                                            <Col span="12" class="phrase-text" :title="item.msgContent" @click.native="sendMsg(item.msgContent)">{{item.msgContent}}</Col>
                                            <Col span="12" style="text-align: center;">
                                                <Col @click.native="delPhrase(item,'profession')" style="width:40px;float: right;">
                                                    <Icon type="trash-a"></Icon>
                                                </Col>
                                                <Col @click.native.stop="editPhrase(item,'profession2')" style="width:40px;float: right;">
                                                    <Icon type="edit"></Icon>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </p>
                                </Panel>
                            </Collapse>
                            <Row class="add-category">
                                <Button type="text" icon="plus" @click="addCategory">添加子分类</Button>
                                <Modal v-model="showModal" @on-ok="ok(action)" @on-cancel="cancel" :title="modalTitle" width="560">
                                    <Input type="textarea" v-model="phraseEdit" v-show="action=='edit' "></Input>
                                    <Row title="确定删除该常用语吗？" v-show="action=='del'">确定删除该常用语吗？</Row>
                                    <Row v-show="action=='addCategory' || action == 'add'">
                                        <Col span="4">{{action=='addCategory'?'分类名称':'常用语'}}</Col>
                                        <Col span="20">
                                            <Input v-model="categoryName" placeholder="输入分类名称"></Input>
                                        </Col>
                                    </Row>
                                </Modal>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </Col>
        </Row>
    </Row>
</template>
<script>
import kf from '../../service/kfApi';
import {Headers} from '../common/Consts.js';
export default {
    data(){
        return{
            busiType: 0,//常用语类型，默认值为0，代表添加常用语，1为常用语类型名称
            currentTenantId: '',
            commonMsgId: '',
            categoryName: '',//子分类名称
            action: '',//操作类型 add,edit,del
            phraseEdit: '',//被编辑的常用语
            showModal: false,
            modalTitle: '',
            value1: '',
            curDept: {
                index: 5,
                name: ''
            },
            phraseList: {
                person: [],
                subCategory:[
                    {
                        msgContent: '',
                        commonMsgId: '',
                        children: []
                    }
                ],
                
            },
            deptList: [],
            modal8: false,
            searchKey: '',
        }
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
        curTenantId: {
            get(){
                
                return this.$store.state.curTenantId;
            },
            set(val){
                this.$store.dispatch('setCurTenantId', val);
            }
        },
    },
    watch:{
        curTenantId(curVal, oldVal){
            this.currentTenantId = curVal;
            this.queryPhrase();
        }
    },
    props: ['ifEmbed'],
    methods:{
        /**选择常用语，发送此消息 */
        sendMsg(msg){
            this.$emit('sendCommPhrase', {msg: msg});
        },
        /**选择租户 */
        selectDept(item, index){
            if(item == null || item == '' || item == undefined){
                return false;
            }
            this.curDept.index = index;
            this.currentTenantId = item.sysId;
            this.queryPhrase();
        },
        /**切换折叠面板 */
        changePanel(val,event){
            if(val && (val == '1' || val == '1-1')){
                return false;
            }
        },
        /**添加子分类 */
        addCategory(){
            this.showModal = true;
            this.action = 'addCategory';
            this.modalTitle = '添加子分类';
        },
        /**新增常用语 */
        addPhrase(item, type){
            this.showModal = true;
            this.action = 'add';
            this.modalTitle = '添加常用语';
            this.categoryName='';  
            if(item!= '' && item.parentId == null && item.busiType == '0'){
                this.commonMsgId = '';
            }
            else if(item!= '' && item.parentId == null && item.busiType == '1'){
                this.commonMsgId = item.busId;
            }
            else if(item == ''){
                this.commonMsgId = '';
            }
            this.busiType = (type == 'person' || type == 'profession')?0:1;
        },
        /**编辑常用语 */
        editPhrase(item, type){
            this.showModal = true;
            this.action = 'edit';

            this.modalTitle = type=='profession'?'编辑分类':'编辑常用语';
            this.commonMsgId = item.busId;
            this.phraseEdit = item.msgContent;
        },
        /**删除常用语 */
        delPhrase(item, type){
            this.showModal = true;
            this.action = 'del';
            this.modalTitle = '删除常用语';
            this.commonMsgId = item.busId;
        },
        
        //查询常用语
        queryPhrase(busiType){
            let config = { 
                data:{
                    currentTenantId : this.currentTenantId,
                },
                headers: Headers.json                 
            };
            kf.queryPhrase(config).then(res =>{
                if(res.code == '0'){
                    this.phraseList.person= res.resultData.filter(i=>{
                        return i.busiType=='0'&& i.parentId == null ?true:false;
                    });
                    this.phraseList.subCategory= res.resultData.filter(i=>{
                        return i.busiType=='1'?true:false;
                    });
                    this.phraseList.subCategory.map(i =>{
                        i.children = [];
                    })
                    var tmp = [];
                    res.resultData.map((i,x) =>{
                        this.phraseList.subCategory.map((si,sx) =>{
                            if(si.busId == i.parentId){
                                tmp.push(i);
                            }
                        })
                    });
                    this.phraseList.subCategory.map((si,sx) =>{
                        tmp.map((m,n) =>{
                            if(m.parentId== si.busId){
                                si.children.push(m);
                            }
                        })
                    })
                }
            }, error =>{
                this.$Message.error(error)
            });               
        },             
        ok(action){
            if(action == 'edit'){
                if(this.phraseEdit == ''){
                    this.$Message.warning("常用语或常用于类型不能为空");
                    return false;
                }
                if(this.phraseEdit.length > 50){
                    this.$Message.warning("最大长度不能超过50字符");
                    return false;
                }
                let config = { 
                    data:{
                        msgContent : this.phraseEdit,
                        commonMsgId : this.commonMsgId
                    },
                    headers: Headers.json
                };
                kf.editPhrase(config).then(res =>{
                    if(res.code == '0'){
                        this.queryPhrase()
                        this.phraseEdit=''
                        this.$Message.info('编辑常用语成功');
                    }
                    else{
                        this.$Message.warning(res.message);
                    }
                }, error =>{
                    this.$Message.error(error)
                });
            }
            else if(action == 'add'){
                if(this.categoryNam == ''){
                    this.$Message.warning("常用语或常用于类型不能为空");
                    return false;
                }
                if(this.categoryName.length > 50){
                    this.$Message.warning("最大长度不能超过50字符");
                    return false;
                }
                let config = { 
                    data:{
                        currentTenantId: this.currentTenantId,
                        msgContent: this.categoryName,
                        busiType: this.busiType,
                        parentId: this.commonMsgId
                    },
                    headers: Headers.json
                };
                kf.addPhrase(config).then(res =>{
                    if(res.code == '0'){
                        this.queryPhrase()
                        this.categoryName=''
                        this.$Message.info('新增常用语成功');
                    }
                    else{
                        this.$Message.warning(res.message);
                    }
                }, error =>{
                    this.$Message.error(error)
                });
            }
            else if(action == 'del'){
                let config = { 
                    data:{
                        commonMsgId: this.commonMsgId
                    },
                    headers: Headers.json
                };
                kf.delPhrase(config).then(res =>{
                    if(res.code == '0'){
                        this.queryPhrase()
                        this.phraseEdit=''
                        this.$Message.info('删除常用语成功');
                    }
                    else{
                        this.$Message.warning(res.message);
                    }
                }, error =>{
                    this.$Message.error(error)
                });
            }else if(action == 'addCategory'){
                let config = { 
                    data:{
                        currentTenantId: this.currentTenantId,
                        msgContent: this.categoryName,
                        busiType: 1
                    },
                    headers: Headers.json
                };
                kf.addPhrase(config).then(res =>{
                    if(res.code == '0'){
                        this.queryPhrase()
                        this.categoryName=''
                        this.$Message.info('新增子分类成功');
                    }
                    else{
                        this.$Message.warning(res.message);
                    }
                }, error =>{
                    this.$Message.error(error)
                });
            }       
        },            
        cancel() {
            this.phraseEdit=''
            this.categoryName=''
        }                     
    },
    mounted() {
        this.deptList = this.servedTenant;
        this.servedTenant.map((item,index)=>{
            if(index == 0 && item!=null){
                this.selectDept(item,index);
            }
        })
    },        
}
</script>
<style lang="less">
.common-phrase{
    .top{
        height: 107px;
        line-height: 107px;
        .title{
            font-size: 16px;
            font-weight: bold;
            padding:0px 10px 0px 40px;
        }
    }
    .phrase-left{
        .dept-list{
            border: 1px solid #eee;
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
        }
        .dept{
            height: 48px;
            line-height: 48px;
            text-align: left;
            padding-left: 40px;
            cursor: pointer;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .selected{
            background-color: #f0faf6;
            color: #13C27C;
        }
    }
    .phrase-right{
        .ivu-icon-arrow-right-b:before{
            content: "\F20E";
        };
        .category{
            width:calc(~"100% - 14px");
        }
        .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header>i{
            transition: none;
        }
        .ivu-collapse>.ivu-collapse-item.ivu-collapse-item-active>.ivu-collapse-header>i{
            transform: none;
        }
        .ivu-collapse>.ivu-collapse-item .ivu-icon.ivu-icon-chevron-down{
            transition: transform .2s ease-in-out;
        }
        .ivu-collapse>.ivu-collapse-item.ivu-collapse-item-active .ivu-icon.ivu-icon-chevron-down{
            transform: rotate(180deg);
        }

        .ivu-collapse-content,.ivu-collapse-content-box{
            background-color: #f4f8fb;
            padding-top: 0px;
        }
        .ivu-collapse-header{
            background-color: white;
        }
    }
    
}
</style>
<style lang="less" scoped>

.common-phrase{
    background:#fff;
    overflow: hidden;
    .phrase-left{
        background-color: white;
        padding-left: 40px;
    }
    .phrase-text{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
    }
    .phrase-right{
        .ivu-collapse{
            background-color: #f4f8fb;
        }
        //min-height: 600px;
        .ivu-collapse-content{
            background-color: #f6f7fb;
            .phrase-item{
                margin: 10px;
                height: 32px;
                line-height: 32px;
                background-color: white;
                padding-left: 10px;
                border-radius: 5px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .sub-category{
            margin-bottom: 10px;
        }
        
    }
    .ivu-input-group-append>.ivu-btn>.ivu-icon{
        color:#fff;
    }
    .language-nav{
        border-bottom:1px solid #eee;
        line-height: 40px;
    }
    .language-title{
        background:#fff;
        margin-top:20px;
    }
    .ivu-icon-plus-round{
        cursor: pointer;
    }
    .language-list{
        margin-top:32px;
        li{
            list-style: none;
            font-size: 14px;
            color:#333;
            line-height: 25px;
            margin-bottom: 10px;
            border-bottom:1px dotted #b1b1b1;
        }
    }
    .ivu-input-group-append .ivu-btn,{
        background: #13C27C;
        border-color:#13C27C;
    }
 }
</style>
