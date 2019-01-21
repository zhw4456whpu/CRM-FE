import {http} from './http';
//接口地址
var addCategory = {url:'/api/addCategory',type:'post'}
export default {
    
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