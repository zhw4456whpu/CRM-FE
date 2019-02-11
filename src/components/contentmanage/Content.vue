<template>
    <Row class="content">
        <Form :model="formItem" :label-width="120" :rules="formRules">
            <FormItem label="文章标题" prop="chapTitle">
                <Input v-model="formItem.chapTitle" placeholder="请输入文章标题"></Input>
            </FormItem>
            <FormItem label="文章分类" prop="curCategory">
                <Select v-model="formItem.curCategory" style="width:200px" @on-change="catChanged" :label-in-value="labelValue" :transfer="labelValue">
                    <Option v-for="item in categoryList" :value="item.cat_code" :key="item.cat_id">{{ item.cat_name }}</Option>
                </Select>
                <Button type="primary" @click="addCategory">新增分类</Button>
                <Modal v-model="showAddCategory" @on-ok="saveCategory" title="新增分类">
                    <Form ref="formInline" :model="formInline" :rules="ruleInline" inline :label-width="120">
                        <FormItem prop="categoryName" label="分类名称">
                            <Input type="text" v-model="formInline.categoryName" placeholder="分类名称"></Input>
                        </FormItem>
                        <FormItem prop="categoryCode" label="分类编码">
                            <Input type="text" v-model="formInline.categoryCode" placeholder="分类编码"></Input>
                        </FormItem>
                    </Form>
                </Modal>
            </FormItem>
            <FormItem label="文章内容">
                <ueditor v-model="formItem.chapContent" :config="config" ref="ue"></ueditor>
            </FormItem>
            <FormItem label="">
                <Button type="primary" @click="saveChapter">确定</Button>
            </FormItem>
        </Form>
    </Row>
</template>
<script>
import Content from '../../service/contentApi';
import Login from '../../service/loginApi'
import {Headers, Warning} from '../common/Consts.js';
import Ueditor from '../common/UEditor'
export default {
    name: 'Content',
    components: {
        Ueditor
    },
    computed: {
        
        userName: {
            get(){
                return this.$store.state.userName;
            },
            set(val){
                this.$store.dispatch('setUserName', val);
            }
        },
        menu :{
            get(){
                return this.$store.state.menu;
            },
            set(val){
                this.$store.dispatch('setMenu', val);
            }
        },
        chapterId: {
            get(){
                console.log("this.$store.state.chapterId:%s", this.$store.state.chapterId);
                return this.$store.state.chapterId;
            },
            set() {
                this.$store.dispatch('setChapterId', val);
            }
        },
        chapterStatus: {
            get(){
                return this.$store.state.chapterStatus;
            },
            set() {
                this.$store.dispatch('setChapterStatus', val);
            }
        }
    },
    data(){
        return {
            formRules: {
                chapTitle: { required: true, trigger: 'blur',message: '文章标题不能为空'},
                curCategory: { required: true, trigger: 'change',message: '文章分类不能为空'},
            },
            topNav: [],
            subMenus: [],
            config: {
                initialFrameWidth: null,
                initialFrameHeight: 350
            },
            formItem: {
                chapTitle: '',
                curCategory: '',
                chapContent: '',
                time: '',
                writer: ''
            },
            ruleInline: {
                categoryName: [{ required: true, message: '请输入分类账号', trigger: 'blur' }],
                categoryCode: [{ required: true, message: '请输入分类编码', trigger: 'blur' }],
            },      
            formInline: {
                categoryName: '',
                categoryCode: ''
            },
            showAddCategory: false,
            labelValue: true,
            categoryList: []
        }
    },
    methods: {
        /**获取文章内容 */
        getChapterContent(){
            let config = {
                data:{
                    chapterId: this.chapterId
                }
            }, _this = this;
            Content.queryChapterContent(config).then(res =>{
                if(res.code == '0'){
                    if(res.data[0]){
                        setTimeout(function(){
                            _this.formItem.chapTitle = res.data[0].chapter_title;
                            _this.formItem.curCategory = res.data[0].cat_code;
                            _this.formItem.chapContent = res.data[0].chapter_content;
                        }, 20)
                    }
                }
                else{
                    _this.$Message.warning(res.message);
                }
            }, err =>{
                _this.$Message.error(err);
            })
        },
        /**获取分类 */
        async getCategoryList(){
            let config = {
                data: {},
                headers: Headers.urlencoded
            },_this = this;
            return await Login.queryAllCategory(config).then(res =>{
                if(res.code == '0'){
                    _this.topNav= res.data
                }
                return res;
            }, err=>{
                return err;
            })
        },
        async getAllChapters(){
            let config = {
                data: {},
                headers: Headers.urlencoded
            },_this = this;
            return await Login.queryAllChapters(config).then(res =>{
                if(res.code == '0'){
                    _this.subMenus= res.data
                }
                return res;
            }, err=>{
                return err;
            })
        },
        /**查询分类和文章 */
        queryCatNChapter(){
            let _this = this;
            _this.getCategoryList().then( res=>{
                _this.getAllChapters().then(res =>{
                    _this.menu = {
                        topNav: _this.topNav,
                        subMenus: _this.subMenus
                    }
                    _this.$router.push({
                        path: '/contentmanage'
                    })
                })
            },err =>{
                _this.$Message.error(err);
            })
        },
        /**保存文章 */
        saveChapter(){
            if(this.chapterStatus == 'add'){
                this.formItem.writer = this.userName;
                let config = {
                    data: {...this.formItem},
                    headers: Headers.json
                }
                Content.addChapter(config).then(res =>{
                    if(res.code == '0'){
                        this.$Message.info('新增成功!');
                        this.queryCatNChapter();
                    }
                    else{
                        this.$Message.warning(res.message);
                    }
                }, err=>{
                    this.$Message.error(err);
                })
            }else{
                this.formItem.writer = this.userName;
                let config = {
                    data: {...this.formItem},
                    headers: Headers.json
                }
                Object.assign(config.data, {chapterId: this.chapterId});
                console.log("config.data:%o", config.data);
                Content.editChapter(config).then(res =>{
                    if(res.code == '0'){
                        this.$Message.info('编辑成功!');
                        this.queryCatNChapter();
                    }
                    else{
                        this.$Message.warning(res.message);
                    }
                }, err=>{
                    this.$Message.error(err);
                })
            }
            
        },
        /**打开新增窗口 */
        addCategory(){
            this.showAddCategory = true;
        },
        /**保存分类 */
        saveCategory(){
            let config = {
                data: {...this.formInline},
                headers: Headers.json
            }
            Content.add(config).then(res =>{
                if(res.code == '0'){
                    this.$Message.info('新增成功!');
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err=>{
                this.$Message.error(err);
            })
        },
        /**分类改变 */
        catChanged(val){},
        
    },
    mounted(){
        this.queryCatNChapter();
        this.getChapterContent();
        this.categoryList = this.menu.topNav;
    }
}
</script>
<style lang="less">
.content{
    background-color: white;
    padding: 20px;
    text-align: left;
}
</style>