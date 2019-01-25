<template>
    <Row class="content">
        <Form :model="formItem" :label-width="120">
            <FormItem label="文章标题">
                <Input v-model="formItem.chapTitle" placeholder="请输入文章标题"></Input>
            </FormItem>
            <FormItem label="文章分类" >
                <Select v-model="formItem.curCategory" style="width:200px" @on-change="catChanged" :label-in-value="labelValue" :transfer="labelValue">
                    <Option v-for="item in categoryList" :value="item.cat_code" :key="item.cat_id">{{ item.cat_name }}</Option>
                </Select>
                <Button type="success" @click="addCategory">新增分类</Button>
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
        menu :{
            get(){
                return this.$store.state.menu;
            },
            set(val){
                this.$store.dispatch('setMenu', val);
            }
        },
    },
    data(){
        return {
            topNav: [],
            subMenus: [],
            config: {
                initialFrameWidth: null,
                initialFrameHeight: 350
            },
            formItem: {
                chapTitle: '',
                curCategory: '',
                chapContent: ''
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