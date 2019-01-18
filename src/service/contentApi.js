import {http} from './http';
//接口地址
var addCategory = {url:'/api/addCategory',type:'post'}
var queryAll = {url:'/api/queryAll',type:'get'}
export default {
    queryAll(config = {}) {
        config.urlObj = queryAll;
        return new Promise((resolve,reject) =>{
            http(config).then(res =>{
                if(res.status =='200' || res.status == '304'){
                    resolve(res.data);
                }
            }, err =>{
                reject(err);
            })
        })
    },
    add(config = {}) {
        config.urlObj = addCategory;
        return new Promise((resolve,reject) =>{
            http(config).then(res =>{
                if(res.status =='200' || res.status == '304'){
                    resolve(res.data);
                }
            }, err =>{
                reject(err);
            })
        })
    }    
}