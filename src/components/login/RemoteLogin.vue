<template>
    <div class="remote-login">
    </div>
</template>
<script>
import Login from '../../service/loginApi';
import crypto from 'crypto';
import {Headers, Warning} from '../common/Consts.js'
import * as menuConfig from '../../../config/menu.config.js'
export default {
    name:'RemoteLogin',
    data(){
        return {}
    },
    computed:{
        remoteToken(){
            return this.$store.state.remoteToken;
        },
        menu :{
            get(){
                return this.$store.state.menu;
            },
            set(val){
                this.$store.dispatch('setMenu', val);
            }
        }
    },
    mounted(){
        let defaultPage = '';
        this.menu.topNav.map((item,index) =>{
            if(index == 0){
                defaultPage = item.menuAddress
            }
        });
        if(this.$route.query.access_token && this.remoteToken == this.$route.query.access_token){
            this.$router.push({
                path: defaultPage
            })
        }
        else{
            this.$router.push({
                path: '/errorpage',
                query: { redirect: 'login', msg: 'invalid token', type: 'error' }
            })
        }
    }
}
</script>
<style lang="less">
.remote-login{
    width: 0;
    height: 0;
}
</style>