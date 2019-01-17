<template>
    <Row class="sensitive" style="background:#fff;padding:20px;">
        <h3>敏感词过滤</h3>
        <h5>影响范围：“微信小程序”、“移动APP客服”、“网站”；在接收会话窗口出现敏感词将做  “  * ”  号处理。</h5>
        <Row style="margin:20px; 0">
            <Col span="5">
                <Input icon="search" v-model="searchKey" placeholder="搜索查询敏感词" style="width:300px;" @on-click="search"></Input>
            </Col>  
            <Col span="2"> 
                <Button type="primary"  @click="search()">查询</Button> 
            </Col>    
            <Col span="16" style="text-align:right;"> 
                <Button type="primary" @click="addWord()">添加敏感词</Button> 
                <Button :class="{ active: isActive }" :disabled="isActive" type="primary" @click="sunc()" >{{synctext}}</Button> 
            </Col> 
        </Row>
        <Table :columns="words" :data="wordForm"></Table>
        <Page :total="total"  @on-change="changeBlackPageNum" :page-size="pageSize" style="text-align:right;margin: 10px 0px;"></Page>
        <!-- 编辑敏感词 -->
        <Modal
            v-model="editWords"
            title="编辑敏感词"
            @on-cancel="cancel">
            <Form 
            ref="editItem"
            :model="editItem" 
            :rules="ruleValidate"             
            :label-width="80">
                <FormItem label="敏感词" prop="editsenWord">
                    <Input v-model="editItem.editsenWord" placeholder="输入敏感词" style="width:300px"/>
                </FormItem>                
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="editWords=false">取消</Button>
                <Button type="primary" size="large" @click="ok">确定</Button>
            </div>             
        </Modal> 
        <!-- 添加敏感词 --> 
         <Modal
            v-model="addWords"
            title="添加敏感词"
            @on-cancel="cancel">
            <Form 
            ref="addItem"
            :model="addItem" 
            :rules="ruleValidate"            
            :label-width="80">
                <FormItem label="敏感词" prop="addsenWord">
                    <Input v-model="addItem.addsenWord" placeholder="输入敏感词" style="width:300px"/>
                </FormItem>                
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="addWords=false">取消</Button>
                <Button type="primary" size="large" @click="add">确定</Button>
            </div>             
        </Modal>  
         <!-- 删除敏感词 --> 
         <Modal
            v-model="delWords"
            title="删除敏感词"
            @on-ok="delok"
            @on-cancel="cancel">
            <Row>
                <Col span="5">确定删除敏感词</Col>
                <Col span="10" style="color:red">"{{senword}}"</Col>
            </Row>
        </Modal>                      
    </Row>
</template>
<script>
import company from '../../service/companyApi'
import {Headers} from '../common/Consts.js'
import { formatDate as formatLocalDate } from '../../utils'
import { isNull } from '../../utils'
export default {
    name: 'sensitive',
    data(){
        return{
            words: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },                
                {
                    title: '敏感词',
                    key: 'sensitiveWord'
                },
                {
                    title: '添加时间',
                    key: 'createTime'
                },
                {
                    title: '操作',
                    key: 'operation',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.show(params)
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }                
            ],
            synctext:'同步',
            isActive: false,
            wordForm:[],
            editItem:{
                editsenWord:''
            },
            editWords:false,
            editsenWord:'',
            delWords:false,
            addWords:false,
            searchKey:'',
            senword:'',
            addItem:{
                addsenWord:''
            },
            addsenWord:'',
            total:0,
            pageSize:10,
            pageNum:1,
            curIndex:{},
            ruleValidate: {
                editsenWord:[
                    {required: true, message: '敏感词不能为空', trigger: 'blur'},
                    {type:'string',max:12, message: '字符长度最多不超过12个',}
                ],
                addsenWord:[
                    {required: true, message: '敏感词不能为空', trigger: 'blur'},
                    {type:'string',max:12, message: '字符长度最多不超过12个',}
                ],
            },            
        }
    },
    methods:{
        //分页
        changeBlackPageNum(val){
            this.wordForm.splice(0,this.wordForm.length);
            this.pageNum = val;
            this.querySensitiveWordListForPage();
        },        
        /**获取敏感词列表 */
        querySensitiveWordListForPage(data = {}){
            let tmp = Object.assign({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                },data);
            let config = {
                data: tmp,
                headers: Headers.urlencoded
            }            
            company.querySensitiveWordListForPage(config).then(res =>{
                if(res.code == '0'){
                    this.wordForm = res.resultData.list;
                    this.wordForm.map((item,index) =>{
                        item.createTime = formatLocalDate(new Date(item.createTime*1000) , 'yyyy-MM-dd HH:mm:ss');
                        if(isNull(item.sensitiveWord)){
                            item.sensitiveWord = '敏感词' + item.sysId;
                        }                        
                    });
                    this.total =res.resultData.total;     
                } else{
                    this.$Message.warning(res.message);
                }
            })
        },
        // 查询按钮
        search(){
            this.querySensitiveWordListForPage({sensitiveWord:this.searchKey})
        },
        //添加
        addWord(){
            this.addWords = true;
        },
        // 同步敏感词
        sunc(){
            let config = {
                headers: Headers.json
            };
            company.synchronizeVersionNo(config).then(res =>{
                if(res.code == '0'){
                    this.synctext ='已同步'
                    this.isActive = true
                    this.$Message.info('敏感词同步成功');
                } else{
                    this.$Message.warning(res.message);
                }
            }) 
        },
        //添加弹窗里面确定按钮
        add(){
            this.$refs.addItem.validate((valid) =>{ 
                if (valid) {
                    let config = {
                        data:{
                            sensitiveWord:this.addItem.addsenWord,
                        },
                        headers: Headers.json
                    };
                    company.saveSensitiveWord(config).then(res =>{
                        if(res.code == '0'){
                            this.addWords = false;
                            this.synctext ='同步';
                            this.isActive = false;                           
                            this.querySensitiveWordListForPage();
                            this.$Message.info('添加敏感词成功');
                        } else{
                            this.$Message.warning(res.message);
                        }
                    }) 
                 }
            })       
        },
        // 编辑
        show (params) {
            this.editWords = true;
            this.editItem.editsenWord = this.wordForm[params.index].sensitiveWord;
            this.curIndex = params;
        }, 
        // 删除       
        remove (params) {
            this.delWords = true;
            this.senword =this.wordForm[params.index].sensitiveWord;
            this.curIndex = params;
        },
        //删除弹窗里面的确定按钮
        delok(){
            let config = {
                data:{
                    sysId:this.curIndex.row.sysId,
                    sensitiveWord:this.senword,
                },
                headers: Headers.json
            };
            company.deleteSensitiveWordById(config).then(res =>{
                if(res.code == '0'){
                    this.querySensitiveWordListForPage();
                    this.synctext ='同步'
                    this.isActive = false                    
                    this.$Message.info('删除敏感词成功');
                 } else{
                    this.$Message.warning(res.message);
                }                 
            },err =>{
                this.this.$Message.error(err);
            })             
        },
        // 编辑按钮的确定取消 
        ok(){
            this.$refs.editItem.validate((valid) =>{ 
                if(valid){
                    let config = {
                        data:{
                            sysId:this.curIndex.row.sysId,
                            sensitiveWord:this.editItem.editsenWord,
                        },
                        headers: Headers.json
                    };
                    company.updateSensitiveWordById(config).then(res =>{
                        if(res.code == '0'){
                            this.editWords =false;
                            this.synctext ='同步';                           
                            this.isActive = false;                            
                            this.querySensitiveWordListForPage();
                        } else{
                            this.$Message.warning(res.message);
                        }
                    })                     
                }
            })            
        },
        cancel () {
            this.$Message.info('已取消');
        }               
    },
    mounted(){
        this.querySensitiveWordListForPage();
    }
}
</script>
<style lang="less" scoped>
  .sensitive{
      background:#fff;
      h3{
          line-height: 32px;
      }
      h5{
          color:#999;
          line-height: 30px;
      }
      .active{
          background: #ccc;
          color:#fff;
          border:none;
          box-shadow: none;
      }
  }  
</style>

