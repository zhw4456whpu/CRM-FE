<template>
    <div class="session-tag">
        <Row class="top">
            <Col span="3" style="text-align:left;"><h3>会话标签</h3></Col>
            <Col span="21" style="text-align:right;padding-right: 40px;">
                会话结束时强制添加会话标签
                <i-switch v-model="tagSwitch" @on-change="change" size="large">
                </i-switch>            
            </Col>
        </Row>
        <Row class="tag-layout">
            <Col span="7" class="tag-list">
                <Row :class="{'active' : activeClass == index}" 
                    v-for="(item,index) in tagList" :key="index" class="tag-item label">
                    <Col span="18" @click.native="showList(item, index)" class="tag-text" :title="item.tagName">{{item.tagName}}</Col>
                    <Col span="5" style="text-align:right;" >
                        <div class="icon"  >
                            <Icon type="edit" @click.native="edit(item,index)"></Icon>
                            <Icon type="trash-a" @click.native="removerow(item,index)"></Icon>
                        </div>                 
                    </Col>
                </Row> 
                <Row @click.native="addTag('root')" class="tag-item add-btn">
                    <Icon type="android-add"></Icon>
                    添加标签
                </Row>           
            </Col> 
            <Col span="7" v-show="showChild" class="tag-list child">
                <Row v-for="(ci,cx) in subTagList" :key="cx" class="tag-item label">
                    <Col span="18" class="tag-text" :title="ci.tagName">{{ci.tagName}}</Col>
                    <Col span="5" style="text-align:right;">
                        <div class="icon">
                            <Icon type="edit" @click.native="edit(ci, cx)"></Icon>
                            <Icon type="trash-a" @click.native="removerow(ci, cx)"></Icon>
                        </div>                 
                    </Col>                
                </Row>
                <Row @click.native="addTag('child')" class="tag-item add-btn">
                    <Icon type="android-add"></Icon>
                    添加子标签
                </Row>  
            </Col>
        </Row>
        <Modal
            v-model="editModal"
            title="编辑"
            @on-ok="editOk()"
            @on-cancel="cancel">
            <Form 
            :model="curTag"
            ref="curTag"
            :rules="ruleValidate">
                <FormItem :labelWidth="100" label="标签编码" prop="tagCode"> 
                    <Input v-model="curTag.tagCode" style="width: 300px;"></Input>
                </FormItem>
                <FormItem :labelWidth="100" label="标签名称" prop="tagName"> 
                    <Input v-model="curTag.tagName" style="width: 300px;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="editModal=false">取消</Button>
                <Button type="primary" size="large" @click="editOk()">确定</Button>
            </div>             
        </Modal> 
        <Modal
            v-model="addModal"
            title="添加"
            @on-ok="add()"
            @on-cancel="cancel">
            <Form 
            :model="tag"
            ref="tag"
            :rules="ruleValidate">
                <FormItem :labelWidth="100" label="标签编码" prop="tagCode"> 
                    <Input v-model="tag.tagCode" style="width: 300px;"></Input>
                </FormItem>
                <FormItem :labelWidth="100" label="标签名称" prop="tagName"> 
                    <Input v-model="tag.tagName" style="width: 300px;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="addModal=false">取消</Button>
                <Button type="primary" size="large" @click="add()">确定</Button>
            </div>            
        </Modal>         
    </div>
</template>
<script>
import sys from '../../service/kfApi';
import systemconfigApi from '../../service/systemconfigApi';
import {Headers} from '../common/Consts.js';
export default {
    data(){
        return {
            tagType: 'root',
            showChild: false,
            parentCode: '0',
            curTag: {},
            tag: {},
            tagSwitch: false,
            activeClass: -1,
            editModal: false,
            addModal: false,
            value: '',
            tagList: [],
            subTagList: [],
            ruleValidate: {
                tagCode:[{required: true, message: '标签编码不能为空', trigger: 'blur' },],
                tagName:[
                    {required: true, message: '标签名称不能为空', trigger: 'change' },
                    {type:'string',max:20, message: '字符长度最多不超过20个',}
                    ],
            },             
        }  
    },
    methods: {
        /** 查询会话标签**/
        querySessionTag(tagType){
            let config = {
                data: {
                   parentCode: tagType == 'root'?'0':this.parentCode
                },
                headers: Headers.json
            }
            systemconfigApi.querySessionTag(config).then(res =>{
                if(res.code == '0'){
                    if(tagType == 'root'){
                        this.tagList =  res.resultData;
                    }else{
                        this.subTagList = res.resultData;
                    }
                }else{
                    this.$Message.warning(res.message);
                }
            },err=>{
                this.$Message.error(err);
            })
        }, 
        //添加标签ok键 
        add(){
            this.$refs.tag.validate((valid) =>{
                if (valid) {
                    let config = {
                        data: {
                            tagCode: this.tag.tagCode,
                            tagName: this.tag.tagName,
                            parentCode: this.tagType=='root'?'0':this.parentCode
                        },
                        headers: Headers.json
                    }
                    systemconfigApi.addSessionTag(config).then(res =>{
                        if(res.code == '0'){
                            this.$Message.info('新增标签成功');
                            this.querySessionTag(this.tagType);
                            this.addModal=false
                        }else{
                            this.addModal=true
                            this.$Message.warning(res.message);
                        }
                    },err=>{
                        this.$Message.error(err);
                    })
                }
            })            
        },
        //添加标签
        addTag(tagType){
            this.addModal = true;
            this.tagType = tagType;
        },    
        //点击之后显示二级标签
        showList(tag, index) {
            this.showChild = true;
            this.parentCode = tag.tagCode;
            this.querySessionTag('child');
            this.activeClass = index;  // 把当前点击元素的index，赋值给activeClass
        }, 
        removerow(item,index){
            let config = {
                data: {
                    busiId: item.busiId,
                },
                headers: Headers.json
            }
            systemconfigApi.deleteSessionTag(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('删除标签成功');
                    this.querySessionTag(this.tagType);
                }else{
                    this.$Message.info(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })            
        },
        editOk(){
            this.$refs.curTag.validate((valid) =>{
                if (valid) {
                    let config = {
                        data: {
                            busiId: this.curTag.busiId,
                            tagName: this.curTag.tagName,
                        },
                        headers: Headers.json
                    }
                    systemconfigApi.updateSessionTag(config).then(res =>{
                        if(res.code == '0'){
                            this.$Message.info('修改成功');
                            this.querySessionTag();
                            this.editModal=false
                        }else{
                            this.editModal=true
                            this.$Message.info(res.message);
                        }
                    },err=>{
                        this.$Message.error(err);
                    })
                }
            })            
        },
        cancel(){},
        edit(item, index){
            this.editModal = true;    
            this.curTag = item;  
        },
        change (status) {
            this.updateSessionTagSetting();
        },
        /**租户会话标签配置查询 */
        querySessionTagSetting(){
            let _this = this;
            let config = {
                headers: Headers.json
            }
            systemconfigApi.querySessionTagSetting(config).then(res =>{
                if(res.code == '0'){
                    _this.tagSwitch = res.resultData.addSessionTagSwitch==1?false:true ;
                }
                else{
                    _this.$Message.warning(res.message);
                }
            }, err=>{
                _this.$Message.error(err);
            })
        },
        /**租户会话标签配置 */
        updateSessionTagSetting(){
            let config = {
                data: {
                    addSessionTagSwitch : this.tagSwitch==true?0:1
                },
                headers: Headers.json
            }
            systemconfigApi.updateSessionTagSetting(config).then(res=>{
                if(res.code == '0'){
                    this.$Message.info("修改开关成功")
                }else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        }
    },
    mounted(){
        this.querySessionTag('root');
        this.querySessionTagSetting();
    }
}
</script>
<style lang="less" scoped>
.session-tag{
    background-color: white;
    .top{
        height: 107px;
        line-height: 107px;
        padding: 0px 0px 0px 40px;
    }
    .tag-layout {
        margin: 0px 40px;
        .tag-list{
            border:1px solid #EBEDF0;
            min-height: 600px;
            padding-top: 20px;
            .tag-item{
                margin: 10px 30px;
                padding-left: 20px;
                height: 40px;
                line-height: 40px;
                background-color: #F7F9FC;
                border-radius: 4px;

                .tag-text{
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    cursor: pointer;
                }
                &:hover{
                    color: #13C27C;
                }
                cursor: pointer;
                .icon{
                    color:#666;
                    .ivu-icon-edit{
                        margin-left:5px;
                    }
                }
                
            }
            .active {
                background-color: #13c27b;
                color:#fff;
                font-weight: bolder;
                &:hover{
                    color: #142921;
                }
                .icon{
                    color:#fff;
                }
            }   
            
            .add-btn{
                color: #13C27C;
            }
        }
        .child{
            border-left: none;
        }
    }
    .set-title{
        background: #fff;
        padding:8px;
        margin-top:15px;
        border-radius: 3px 3px 0 0;
    }
    .ivu-icon-trash-a{
        margin-left:5px;
    }
  
}   
</style>

