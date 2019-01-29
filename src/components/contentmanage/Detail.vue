<template>
    <div class="detail">
        <Row class="header">
            <Row class="title">{{chapter.title}}</Row>
            <Row class="msg">
                <span class="time">{{chapter.time}}</span>
                <span class="author">{{chapter.writer}}</span>
            </Row>
        </Row>
        <pre>
            <Row v-html="chapter.content"></Row>
        </pre>
    </div>
</template>
<script>
import Content from '../../service/contentApi';
export default {
    name: 'Detail',
    computed: {
        chapterId(){
            return  this.$route.query.chapterId;
        }
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
        this.getChapterContent();
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
            margin-bottom: 8px;
        }
        .msg{
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
    
}
</style>