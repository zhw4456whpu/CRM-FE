<template>
<div class="customer-tags">
    <Row class="top">
        <Col span="12"><h3>客户标签</h3></Col>
        <Col span="12" class="button">
            <Button type="primary" @click="addTag('popup')" icon="plus">添加标签</Button>
        </Col>
    </Row> 
    <Modal
        v-model="addModal"
        title="添加标签"
        @on-cancel="cancel">
        <Form
        ref="formItem"
        :rules="ruleValidate" 
        :model="formItem">        
            <FormItem label="添加标签" prop="tagName"> 
                <Input v-model="formItem.tagName" placeholder="请输入标签名称" style="width: 300px"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" size="large" @click="addModal=false">取消</Button>
            <Button type="primary" size="large" @click="addTag('save')">确定</Button>
        </div>         
    </Modal>
    <Modal
        v-model="editModal"
        title="编辑标签"
        @on-cancel="cancel">
        <Form
        ref="editFormItem"
        :rules="ruleValidate" 
        :model="editFormItem">        
            <FormItem label="添加标签" prop="tagName"> 
                <Input v-model="editFormItem.tagName" placeholder="请输入标签名称" style="width: 400px"></Input>
            </FormItem>
        </Form> 
        <div slot="footer">
            <Button type="text" size="large" @click="editModal=false">取消</Button>
            <Button type="primary" size="large" @click="editTag('save')">确定</Button>
        </div>               
    </Modal>           
    <Row class="tag-list">
        <Col span="3" 
            class="customer-label" 
            v-for="(label,index) in labels"
            @mouseenter.native="onMouseOver(index)"
            @mouseleave.native='onMouseout(index)'
            :key="index">
            {{label.dictVal}}
            <div style="display:inline;" v-show='index == i'>
                <Icon type="edit" @click="editTag('popup', label)"></Icon>
                <Icon type="trash-a" @click.native="delTag(label)"></Icon>
            </div>
        </Col>
    </Row>
</div>
</template>
<script>
import customerApi from '../../service/customerApi'
import {Headers} from '../common/Consts.js'
export default {
    data(){
        return{
            curTag: {},
            formItem:{
                tagName: '',
            },
            editFormItem:{
                tagName: '',
            },            
            ruleValidate: {
                tagName:[
                    {required: true, message: '请输入标签名称', trigger: 'blur'},
                     {type:'string',max:50, message: '字符长度最多不超过50个',}
                    ],
            },            
            i:-1,
            addModal: false,
            editModal: false,
            labels:[
                {text:'#意向客户'},
                {text:'#普通用户'},
                {text:'#VIP客户'}
            ]
        }
    },
    methods: {
        /**添加客户标签 */
        addTag(type){
            if(type == 'popup'){
                this.addModal = true;
            }
            else{
                this.$refs.formItem.validate((valid) =>{
                    if (valid) {
                            let config = {
                                data: {
                                    dictVal: this.formItem.tagName,
                                    dictTypeCode: 'CUSTOMER_TAG'
                                },
                                headers: Headers.json
                            }
                            customerApi.insertCustomerTagByTenant(config).then(res =>{
                                if(res.code == '0'){
                                    this.$Message.info('新增成功');
                                    this.addModal = false;
                                    this.queryTag();
                                }
                                else{
                                    this.addModal = true;
                                    this.$Message.warning(res.message);
                                }
                            }, err=>{
                                this.$Message.error(err);
                            })
                        }
                })                     
            }
        },
        /**删除客户标签 */
        delTag(tag){
            let config = {
                data: {
                    sysId: tag.sysId
                },
                headers: Headers.json
            }
            customerApi.deleteDictValById(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('删除成功');
                    this.queryTag();
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**修改客户标签 */
        editTag(type, tag){
                    if(type == 'popup'){
                        this.editModal = true;
                        this.editFormItem.tagName = tag.dictVal;
                        this.curTag = tag;
                    }
                    else{
                    this.$refs.editFormItem.validate((valid) =>{
                        if (valid) { 
                                let config = {
                                    data: {
                                        sysId: this.curTag.sysId,
                                        dictVal: this.editFormItem.tagName
                                    },
                                    headers: Headers.json
                                }
                                customerApi.updateDictValById(config).then(res =>{
                                    if(res.code == '0'){
                                        this.$Message.info('修改成功');
                                        this.editModal = false;
                                        this.queryTag();
                                    }
                                    else{
                                        this.editModal = true;
                                        this.$Message.warning(res.message);
                                    }
                                }, err=>{
                                    this.$Message.error(err);
                                })
                            }           
                    }) 
            }
 
        },
        /**查询客户标签 */
        queryTag(){
            let config = {
                data: {
                    dictTypeCode: 'CUSTOMER_TAG'
                },
                headers: Headers.json
            }
            customerApi.queryPrivateTagByTenant(config).then(res =>{
                if(res.code == '0'){
                    this.labels = res.resultData;
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        onMouseOver(index){
            this.i = index;//鼠标经过显示
        },
        onMouseout(index){
            this.i = -1;//鼠标移走隐藏
        },
        ok () {
            this.$Message.info('Clicked ok');
        },
        cancel () {
            this.addModal = this.editModal = false;
        }
    },
    mounted(){
        this.queryTag();
    }
}
</script>
<style lang="less" scoped>
.tag-title{
    text-align: right;
    margin-right: 10px;
    line-height: 31px;
}
.customer-tags{
    background:#fff;
    min-height: 300px;
    padding:0px 40px;
    .top{
        height: 107px;
        line-height: 107px;
    }
    .tag-list{
        border-top : 1px solid #e6eaf2;
    }
    .customer-label{
        background:#F7F9FC;
        padding:8px 10px;
        margin-right: 10px;
        text-align: left;
        text-indent:12px;
        font-size: 14px;
        border-radius: 10px;
        cursor: pointer;
    }
    .button{
        text-align: right;
        margin-bottom:10px;
    }
}
</style>
