<template>
    <Row class="content">
        <Row class="category">
            <Select v-model="curCategory" style="width:200px" @on-change="catChanged" :label-in-value="labelValue">
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
        </Row>
    </Row>
</template>
<script>
import Content from '../../service/contentApi';
import {Headers, Warning} from '../common/Consts.js'
export default {
    name: 'Content',
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
            curCategory: '',
            categoryList: []
        }
    },
    methods: {
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
        this.categoryList = this.menu.topNav;
        console.log("this.menu.topNav:%o", this.menu.topNav);
    }
}
</script>
<style lang="less">
.content{

}
</style>