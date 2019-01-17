<template>
    <div class="upload" >
        <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <!-- <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon> -->
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
            ref="upload"
            :class="{disabled:uploadDisabled}"
            :show-upload-list="showUploadList"
            :on-success="handleSuccess" 
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :on-progress="onProgress"
            :multiple="multiple"
            type="select"
            action="/sys/tenant/uploadTenantImg"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;" class="upload--picture-card">
                <Icon type="ios-camera" size="20"></Icon> 
                
            </div>
        </Upload>
        <!-- <Modal title="View Image" v-model="visible">
            <img :src="'/' + imgName + '/large'" v-if="visible" style="width: 100%">
        </Modal>  -->
    </div>
</template>
<script>
import systemconfigApi from '../../service/systemconfigApi';
export default {
    name: 'Upload2',
    props: ['props'],
    data () {
        return {
            // defaultList: [],
            multiple: false,
            showUploadList: false,
            imgName: '头像',
            visible: false,
            uploadList: []
        }
    },
    methods: {
        onProgress(e,f,fl){
            this.$emit('uploadSuc');
        },
        handleView (name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess (res, file) {
            file.url = res.resultData;
            this.props.tenantLogo = res.resultData;
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '图片类型有误',
                desc: '图片类型 ' + file.name + ' 必须为jpg,jpeg,png'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '图片大小超出',
                desc: 'File  ' + file.name + ' 图片大小不能超过2MB'
            });
        },
        handleBeforeUpload () {
            const check = this.uploadList.length < 1;
            if (!check) {
                this.$Notice.warning({
                    title: 'Up to five pictures can be uploaded.'
                });
            }
            return check;
        },
    },
    computed:{
        uploadDisabled:function() {
            return this.uploadList.length > 0
        }
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
    }
}
</script>
<style lang="less">
.disabled .upload--picture-card {
    display: none;
}
.upload{
    float: left;
    .upload--picture-card{
        border: 1px dashed #EBEDF0;
        text-align: center;
        border-radius: 4px;
    }
}
    .demo-upload-list{
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
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
