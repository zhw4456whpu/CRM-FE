<!--
 *
 * 确认对话框
 * 
 * 使用方法：
 * <dialogConfirm :show-dialog="showDialog" :ok-text="'删除'" :cancel-text="'取消'" :content="'content'" v-on:confirm="confirmFn" v-on:cancel="cancelFn" :hide-confirm="false"></dialogConfirm>
 *
 * show-dialog: 是否显示对话框，布尔值  
 * ok-text: 确认按钮文字，默认为‘好’      
 * cancel-text: 取消按钮文字，默认为‘取消’
 * hideConfirm: 是否隐藏删除按钮
 * hideCancle 是否隐藏取消按钮
 * content: 对话框文字 
 * confirmFn: 确定按钮回调
 * cancelFn: 取消按钮回调
 -->
 
<template>
    <div class="dialog" v-if="showDialog">
        <transition name="dialog-fade">
            <div class="dialog-bg" v-if="showDialog" @click="confirmHide"></div>
        </transition>
 
        <transition name="dialog-show">
            <div class="dialog-box" v-if="showDialog">
                <div class="dialog-main" v-html="content"></div>
                <div class="dialog-button">
                    <div class="dialog-confirm-cancel" @click="clickCancel" v-if="!hideCancle">{{cancelText || '取消'}}</div>
                    <div class="dialog-confirm-button" @click="clickConfirm" v-if="!hideConfirm">{{okText || '好'}}</div>
                </div>
            </div>
        </transition>
    </div>
</template>
 
<script>
    export default{
        data(){
            return{}
        },
        props: ['showDialog','content','okText','cancelText','hideConfirm','hideCancle'],
        methods: {
            clickCancel() {
                this.$emit('cancel');
            },
            clickConfirm() {
                this.$emit('confirm');
            },
            confirmHide(){
                this.$emit('confirmhide')
            }
        }
    }
</script>
 
<style lang="less">
 
.dialog {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    
    &-bg {
        position: absolute;
        top: 0; left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.4);
    }
 
	&-box {
        width: 5.6rem;
        position: absolute;
        top: 40%;
        left: 50%;
        -webkit-transform: translate3d(-50%,-50%,0);
        transform: translate3d(-50%,-50%,0);
        background-color: #fff;
        border-radius: .1rem;
        line-height: 1.5;
        text-align: center;
	}
	&-main {
	    padding: .42rem .38rem .4rem;
        text-align: left;
        font-size: .28rem;
        color:#333;
	}
	&-button { 
		overflow: hidden;
		border-top: 1px solid #EEE;
        font-size: .32rem;
        line-height: .88rem;
        display: flex;
	}
 
    &-confirm {
        &-cancel {
            color: #3ba3f2;
            flex:1;
            border-right: 1px solid #EEE;
            margin-right: -1px;
        }
        &-button {
            flex:1;
            color: #3ba3f2;
        }
    }
 
    .dialog-show-enter-active, .dialog-fade-enter-active {
        transition: all .3s ease;
    }
    .dialog-show-leave-active, .dialog-fade-leave-active {
        transition: all .3s ease;
    }
    .dialog-show-enter, .dialog-show-leave-active {
        top: -35%;
    }
    .dialog-fade-enter, .dialog-fade-leave-active {
        opacity: 0;
    }
}
</style>