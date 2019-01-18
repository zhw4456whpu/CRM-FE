<template>
    <Row class="content">
        <Row class="category">
            <Select v-model="curCategory" style="width:200px" @on-change="catChanged" :label-in-value="labelValue">
                <Option v-for="item in categoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
        /**获取分类 */
        getCategoryList(){
            let config = {
                data: {},
                headers: Headers.urlencoded
            }
            Content.queryAll(config).then(res =>{
                debugger
                if(res.code == '0'){
                    
                    this.categoryList = res;
                }
                else{
                    this.$Message.warning(res.message || '获取分类警告');
                }
            }, err=>{
                this.$Message.error(err);
            })
        }
    },
    mounted(){
        this.getCategoryList();
    }
}
</script>
<style lang="less">
.content{

}
</style>