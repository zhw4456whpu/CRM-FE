import {http} from './http';
//接口地址
var loginInterface = {url:'/api/login',type:'post'}
var queryAll = {url:'/api/queryAll',type:'get'}

export default {
    /**查询所有分类 */
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
    /**登录 */
    login(config = {}) {
        config.urlObj = loginInterface;
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