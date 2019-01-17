import {http} from './http'
//接口地址
var suggestInterface = {url:'/api/suggest',type:'get'}
var searchInterface = {url :'/api/search' ,type:'get'}
var getProviceInterface = {url :'/api/province' ,type:'get'}
var getMayLikes = {url :'/api/getMayLikes?userName=:userName&pageNo=:pageNo&pageSize=:pageSize' ,type:'get'}
export default {
    suggest(config = {}) {
        config.urlObj = suggestInterface;
        return new Promise((resolve,reject) =>{
            http(config).then(res =>{
                if(res.status =='200' || res.status == '304'){
                    resolve(res.data);
                }
            }, err =>{
            })
        })
    },
    search(config = {}) {
        config.urlObj = searchInterface;
        return new Promise((resolve,reject) =>{
            http(config).then(res =>{
                if(res.status =='200' || res.status == '304'){
                    resolve(res.data);
                }
            }, err =>{
            })
        })
    }, 
    getProvice(config = {}) {
        config.urlObj = getProviceInterface;
        return new Promise((resolve,reject) =>{
            http(config).then(res =>{
                if(res.status =='200' || res.status == '304'){
                    resolve(res.data);
                }
            }, err =>{
            })
        })
    },
    getMayLikes(config){
        config.urlObj = getMayLikes;
        return new Promise((resolve,reject) =>{
            http(config).then(res =>{
                if(res.status =='200' || res.status == '304'){
                    resolve(res.data);
                }
            }, err =>{
            })
        })
    } 
}