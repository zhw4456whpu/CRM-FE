<template>
    <div class="global"></div>
</template>
<script>
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource) 
Vue.http.interceptors.push((request,next) => {
    let timeout;
    // 如果某个请求设置了_timeout,那么超过该时间，该终端会（abort）请求,并执行请求设置的钩子函数onTimeout方法，不会执行then方法。
    if (request._timeout) {
        timeout = setTimeout(() =>{
            if (request.onTimeout) {
                request.onTimeout(request)
                request.abort()
            }
        }, request._timeout)
    }
    next((response) => {
        clearTimeout(timeout)
        return response
    })
})
export default {
    name: 'Global'
}
</script>