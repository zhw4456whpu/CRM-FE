import {http} from './http';
//接口地址
var addCategory = {url:'/api/addCategory',type:'post'}
var addChapter = {url:'/api/addChapter',type:'post'}
var queryChapterContent = {url:'/api/queryChapterContent',type:'get'}

export default {
    /**查询文章内容 */
    queryChapterContent(config={}){
        config.urlObj = queryChapterContent;
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
    /**新增文章 */
    addChapter(config = {}){
        config.urlObj = addChapter;
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
    /**新增分类 */
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