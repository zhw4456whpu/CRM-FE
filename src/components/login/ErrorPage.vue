<<template>
    <div class="error-page">
        {{message}}
    </div>
</template>
<script>
export default {
    name: 'ErrorPage',
    data(){
        return {
            message: ''
        }
    },
    mounted(){
        let type = this.$route.query.type;
        this.message = type=='warning'?'warning message:':'error message:';
        this.message += this.$route.query.msg;
    }
}
</script>
<style lang="less">
.error-page{
    position: absolute;
    width: 100%;
    height: 100%;
    font-size: 20px;
    text-align: center;
    padding-top: 100px;
    color: red;
}
    
</style>