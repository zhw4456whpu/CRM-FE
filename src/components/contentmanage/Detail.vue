<template>
    <div class="detail">
        <Row class="header">
            <Row class="title">{{chapter.title}}</Row>
            <Row class="msg">
                <span class="time">{{chapter.time}}</span>
                <span class="author">{{chapter.writer}}</span>
                <icon @click="edit" type="edit" style="color: #37CCC5;cursor: pointer;"></icon>
            </Row>
        </Row>
        <Row class="content">
            <pre>
                <Row v-html="chapter.content"></Row>
            </pre>
        </Row>
    </div>
</template>
<script>
import Content from '../../service/contentApi';
import Login from '../../service/loginApi';
export default {
    name: 'Detail',
    computed: {
        chapterId(){
            return  this.$store.state.chapterId;
        },
        chapterStatus: {
            get(){
                return this.$store.state.chapterStatus;
            },
            set() {
                this.$store.dispatch('setChapterStatus', val);
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
    },
    watch:{
        chapterId(newVal, oldVal){
            this.getChapterContent();
        }
    },
    data(){
        return {
            chapter: {
                title: '',
                content: '',
                writer: '',
                time: ''
            }
        }
    },
    methods: {
        /**查询分类和文章 */
        queryCatNChapter(){
            let _this = this;
            _this.getCategoryList().then( res=>{
                _this.getAllChapters().then(res =>{
                    _this.menu = {
                        topNav: _this.topNav,
                        subMenus: _this.subMenus
                    }
                    this.selected();
                    this.getChapterContent();
                })
            },err =>{
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
        /**默认选中第一篇文章 */
        selected(){
            this.curTopNav = this.menu.topNav[0];
            if(this.curTopNav.children && this.curTopNav.children.length > 0){
                this.curSubMenu = this.curTopNav.children[0];
                this.$store.dispatch('setChapterId', this.curSubMenu.chapter_id);
            }
        },
        /**编辑 */
        edit(){
            this.$store.dispatch('setChapterStatus', 'edit');
            this.$router.push({
                path: '/ContentManage',
                params: {
                    chapterId: this.chapterId
                }
            })
        },
        getChapterContent(){
            let config = {
                data:{
                    chapterId: this.chapterId
                }
            }
            Content.queryChapterContent(config).then(res =>{
                if(res.code == '0'){
                    if(res.data[0]){
                        this.chapter.title = res.data[0].chapter_title;
                        this.chapter.content = res.data[0].chapter_content;
                        this.chapter.writer = res.data[0].chapter_writer;
                        this.chapter.time = res.data[0].create_time;
                    }
                    
                    //this.content = res.data[0]?res.data[0].chapter_content:'';
                }
                else{
                    this.$Message.warning(res.message);
                }
            }, err =>{
                this.$Message.error(err);
            })
        }
    },
    mounted(){
        this.queryCatNChapter();
    }
}
</script>
<style lang="less">
.detail{
    .header{
        border-bottom: 1px solid #e0e0e0;
        .title{
            font-size: 20px;
            font-weight: bold;
            height: 50px;
            line-height: 50px;
        }
        .msg{
            height: 30px;
            line-height: 30px;
            margin-bottom: 8px;
            .time{
                color: #858585;
            }
            .author{
                color: #78a5f1;
                margin-right: 14px;
                
            }
        }
    }
    .content{
        padding: 10px;
    }
}
</style>