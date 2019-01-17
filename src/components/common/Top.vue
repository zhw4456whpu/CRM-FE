<template>
    <div class="top">
        <user-info></user-info>
        <search-bar></search-bar>
    </div>
</template>
<script>
import userInfo from './UserInfo'
import searchBar from '../common/searchBar'
export default{
    name:'Top',
    components:{
        userInfo:userInfo,
        searchBar:searchBar
    },
    mounted(){
    }
}
</script>