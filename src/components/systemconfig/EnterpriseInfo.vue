<template>
    <Form 
    :model="formItem" 
    :label-width="80"
    ref="formItem"
    :rules="ruleValidate"    
     class="enterprise-info">
        <Row class="form-title">企业基本信息</Row>
        <FormItem label="企业logo">
            <Row @mouseover="showUpload=true;" @mouseleave="showUpload=false;" >
                <img :src="formItem.tenantLogo" v-show="showImg" class="tenant-logo"/>
                <upload :props="formItem" @uploadSuc="uploadSuc"></upload>
            </Row>
        </FormItem>
        <FormItem label="企业名称" prop="tenantName">
            <Input v-model="formItem.tenantName" placeholder="请输入企业名称!"></Input>
        </FormItem>
        <FormItem label="租户ID" prop="sysId">
            <Input v-model="formItem.sysId" placeholder="请输入租户ID!" icon="ios-lock-outline" disabled></Input>
        </FormItem>
        <FormItem label="电话" prop="tenantPhone">
            <Input v-model="formItem.tenantPhone" placeholder="请输入电话号码"></Input>
        </FormItem>
        <FormItem label="地址" prop="tenantAddress">
            <Input v-model="formItem.tenantAddress" placeholder="请输入联系地址"></Input>
        </FormItem>
        <FormItem label="备注" prop="remark">
            <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注信息"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="submit">保存</Button>
        </FormItem>
    </Form>
</template>
<script>
import Upload from '../common/Upload2'
import systemconfigApi from '../../service/systemconfigApi';
import {Headers} from '../common/Consts.js';
export default {
    data () {
        return {
            showUpload: false,
            showImg: false,            
            ruleValidate: {
                tenantName:[
                    {required: true, message: '请输入企业名称', trigger: 'blur'},
                     {type:'string',max:50, message: '字符长度最多不超过50个',}
                    ],
                tenantPhone:[
                        { required: true, message: '联系电话不能为空', trigger: 'blur' },
                        { type: 'string', pattern: /^1[3,4,5,7,8][0-9]{9}$/, pattern: /^$|(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,message: '手机号输入格式不正确', trigger: 'blur' }
                    ],
                tenantAddress:[
                    {required: true, message: '请输入地址', trigger: 'blur' },
                    {type:'string',max:100, message: '字符长度最多不超过100个',trigger: 'blur'}
                    ],
                remark:[
                    {required: true, message: '请输入备注', trigger: 'blur' },
                    {type:'string',max: 250, message: '字符长度最多不超过250个',trigger: 'blur'}
                    ],
            },             
            formItem: {
            },
        }
    },
    components:{
        Upload
    },
    methods:{
        /**上传图片成功回调 */
        uploadSuc(){
            this.showImg = false;
        },
        /** 企业信息查询**/
        queryTenantInfo(){
            let config = {
                headers: Headers.json
            }
            systemconfigApi.queryTenantInfo(config).then(res =>{
                if(res.code == '0'){
                    this.formItem = res.resultData;
                    if(this.formItem.tenantLogo != '' && this.formItem.tenantLogo != undefined && this.formItem.tenantLogo != null){
                        this.showImg = true;
                    }
                }else{
                    this.$Message.info(res.message);
                }
            })
        },        
        submit(){
            //企业信息保存
            this.$refs.formItem.validate((valid) =>{
                if (valid) {            
                        let config = {
                            data: {
                            sysId:this.formItem.sysId,
                            tenantName:this.formItem.tenantName,
                            tenantLogo:this.formItem.tenantLogo,
                            tenantPhone:this.formItem.tenantPhone,
                            tenantAddress:this.formItem.tenantAddress,
                            remark:this.formItem.remark,
                            },
                            headers: Headers.json
                        }
                        systemconfigApi.saveTenant(config).then(res =>{
                            if(res.code == '0'){
                                this.$Message.info("保存成功");
                            }else{
                                this.$Message.info(res.message);
                            }
                        })
                    }
            })
        }
    },
    mounted(){
        this.queryTenantInfo();
    },    
}
</script>
<style lang="less" scoped>
.enterprise-info{
    background:#fff;
    padding:20px;
    .tenant-logo{
        width: 58px;
        height: 58px;
        margin-right: 10px;
        display: block;
        float: left;
        border-radius: 4px;
    }
    .form-title{
        font-size: 18px;
        font-weight: bold;
        height: 50px;
        line-height: 37px;
        text-align: left;
    }
    .ivu-icon{
        font-family: Ionicons;
    }
    .ivu-icon.ivu-icon-ios-lock-outline.ivu-input-icon.ivu-input-icon-normal::before{
        content: "\F174";
    }
}

.demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
}

.demo-upload-list img {
    width: 100%;
    height: 100%;
}

.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}

.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}

.ivu-icon {
    line-height: 58px;
}
</style>
