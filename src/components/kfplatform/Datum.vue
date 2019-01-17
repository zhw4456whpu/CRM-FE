<template>
    <div class="datum">
        <Form class="datum-form" :model="props.Datum">
            <Row class="form-item">
                <Col span="6" class="item-title">昵称</Col>
                <Col span="18" class="item-input">
                    <Input v-model="props.Datum.nickName"></Input>
                </Col>
            </Row>
            <Row class="form-item">
                <Col span="6" class="item-title">名字</Col>
                <Col span="18" class="item-input">
                    <Input v-model="props.Datum.customerAccount"></Input>
                </Col>
            </Row>
            <Row class="form-item">
                <Col span="6" class="item-title">ID</Col>
                <Col span="18" class="item-input">
                    <Input disabled v-model="props.Datum.busiId"></Input>
                </Col>
            </Row>
            <Row class="form-item">
                <Col span="6" class="item-title">手机</Col>
                <Col span="18" class="item-input">
                    <Input v-model="props.Datum.customerPhone"></Input>
                </Col>
            </Row>
            <Row class="form-item">
                <Col span="6" class="item-title">QQ</Col>
                <Col span="18" class="item-input">
                    <Input v-model="props.Datum.customerQq"></Input>
                </Col>
            </Row>
            <Row class="form-item">
                <Col span="6" class="item-title">微信号</Col>
                <Col span="18" class="item-input">
                    <Input v-model="props.Datum.customerWechat"></Input>
                </Col>
            </Row>
            <Row class="form-item">
                <Col span="6" class="item-title">邮箱</Col>
                <Col span="18" class="item-input">
                    <Input v-model="props.Datum.customerEmail"></Input>
                </Col>
            </Row>
            <Row class="form-item">
                <Col span="6" class="item-title">公司</Col>
                <Col span="18" class="item-input">
                    <Input v-model="props.Datum.customerCompany"></Input>
                </Col>
            </Row>
            <Row class="form-item">
                <Col span="6" class="item-title">描述</Col>
                <Col span="18" class="item-input">
                    <Input type="textarea" :row="4" v-model="props.Datum.remark"></Input>
                </Col>
            </Row>
            <Row type="flex" justify="end" style="padding-right:20px;margin:10px 0px;">
                <Button type="primary" @click="save">保存</Button>
            </Row>
            <!-- <Row class="cs-tags">
                <Row class="item-title" style="color: #142921;padding-left:20px;">客户标签</Row>
                <Row style="margin-left:20px;height: 32px;line-height:32px;">
                    <Tag type="border" v-for="(item,index) in props.customerTags" :key="index" 
                    @click.native="markTags(item)" :class="{'checked-tag':item.checked}">{{item.dictVal}}</Tag>
                </Row>
            </Row> -->
            <Row class="add-black">
                <Button type="ghost" @click="addBlack('popup')" style="width:100%;">加入黑名单</Button>
                <Modal v-model="blackModal" title="加入黑名单的原因" @on-ok="addBlack('save')">
                    <Input type="textarea" v-model="reason" :rows="6"></Input>
                </Modal>
            </Row>
        </Form>
    </div>
</template>
<script>
import kfApi from '../../service/kfApi'
import {Headers} from '../common/Consts.js'
export default {
    name: 'Datum',
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
        currentTenantId () {
            return this.$store.state.userName;
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
    methods: {
        /** */
        /**打标签 */
        markTags(tag){
            let _this = this;
            tag.checked = !tag.checked;
            if(tag.checked){
                _this.selectedTagList.push(tag.dictValCode);
            }
            else{
                _this.selectedTagList.map((i,x) =>{
                    if(tag.dictValCode == i){
                        _this.selectedTagList.splice(x,1);
                    }
                });
            }
            let config = {
                data: {
                    busiId: _this.curCustomerId,
                    customerTag : _this.selectedTagList.length>0?_this.selectedTagList.join("|"):''
                },
                headers: Headers.json
            }
            kfApi.modifyTag(config).then(res=>{
                if(res.code == '0'){
                    this.$Message.info('修改客户标签成功');
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**保存客户资料 */
        save(){
            let config = {
                data: {...this.props.Datum,hxAccount: this.curCusHxAccount},
                headers: Headers.json
            }
            kfApi.updateCustomerInfoByAccount(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('保存成功');
                    this.$emit("refreshSessionList");
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })
        },
        /**添加黑名单 */
        addBlack(type){
            if(type =='popup'){
                this.blackModal = true;
            }
            else{
                //保存
                let config = {
                    data: {
                        customerId: this.curCustomerId,
                        reason: this.reason, //列入黑名单原因
                        tenantId : this.curTenantId
                    },
                    headers: Headers.json
                }
                kfApi.addBlack(config).then(res =>{
                    if(res.code == '0'){
                        this.$Message.info('添加黑名单成功');
                        this.$emit("refreshSessionList");
                    }
                    else{
                        this.$Message.info(res.message);
                    }
                    
                }, err=>{
                    this.$Message.error(err);
                })
            }
        },
        /**删除黑名单 */
        delBlack(){
            let config = {
                data: {
                    customerId: this.curCustomerId,
                    currentTenantId: this.curTenantId,//操作员当前服务租户id
                },
                headers: Headers.json
            }
            kfApi.delBlack(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('删除黑名单成功');
                }
                else{
                    this.$Message.info(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        }
    },
    data(){
        return {
            selectedTagList: [],
            checked: false,
            reason: '',
            blackModal: false,
            formItem: []
        }
    }
}
</script>
<style lang="less">
.datum{
    .datum-form{
        .form-item{
            font-size: 14px;
            padding: 0px 20px;
            min-height: 36px;
            line-height: 36px;
            margin: 0px 0px 10px 0px;
        }
        .item-title{
            text-align: left;
            line-height: 36px;
            font-size: 14px;
            color: #758079;
        }
        .cs-tags{
            text-align: left;
            padding-left:4px;
            .checked-tag{
                background-color: #12b876 !important;
                border: 1px solid #12b876 !important;
                .ivu-tag-text{
                    color: white;
                }
            }
        }
        .add-black{
            margin: 10px 20px 19px 20px;
        }
    }
}   
</style>