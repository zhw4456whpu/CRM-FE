<template>
    <div class="ueditor">
        <script id="editor" type="text/plain"></script>
    </div>
</template>
<script>
export default {
    name:'Ueditor',
    data:function () {
        return{
            editor:''
        }
    },
    props: {
        config: {
            type: Object,
            default:function () {
                return  {
                    initialFrameWidth: null,
                    initialFrameHeight: 350,
                }
            }
        },
        value:String
    },
    mounted:function () {
        this.editor=UE.getEditor("editor",this.config)
        this.editor.addListener("ready", ()=>{
            this.editor.setContent(this.value); // 确保UE加载完成后，放入内容。
 
            this.editor.addListener("contentChange",()=>{
                this.$emit('input',this.editor.getContent())   //内容发生变化，触发input事件，此处是为了实现v-mode功能
            })
        });
    },
    methods: {
        getUEContent:function() {
            return this.editor.getContent()
        }
    },
    destroyed: function() {
        this.editor.destroy();
    }
}
</script>
<style lang="less">
</style>