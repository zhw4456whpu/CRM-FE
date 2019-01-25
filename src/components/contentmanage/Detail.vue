<template>
    <div class="detail">
        <pre>
            <Row v-html="content"></Row>
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
            content: ''
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
                    this.content = res.data[0]?res.data[0].chapter_content:'';
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