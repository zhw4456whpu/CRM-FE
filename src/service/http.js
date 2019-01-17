import axios from 'axios'
import utils from '../assets/j/utils'
import {baseConfig} from './config'
import Qs from 'qs'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    //config.data = JSON.stringify(config.data);
    
    /*config.headers = config.headers?config.headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }*/
    // if(token){
    //   config.params = {'token':token}
    // }
    return Promise.resolve(config);
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    if(response.data){
        if(response.data.code == '100008'){
            window.location.href = '/';
        }
    }
    return Promise.resolve(response);
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

//发出请求
/**
 * 封装http，入参args，是一个对象
 * @param {args} args 对象，包含：
 * urlObj：链接对象，此对象又包含url（链接）和type（请求类型）
 * data：请求数据，根据请求类型转化成get请求的params或者post等请求的data;
 * params：get请求下的params
 * path：url路径的动态部分，替换url上的路径占位符
 */
export function http(args){
    let urlObj = args.urlObj || {};
    let url = urlObj.url;
    let type = urlObj.type;
    let data = args.data || {};
    let headers = args.headers;

    //args里的path表示路径
    if(utils.isObject(args.path) && args.path){
        Object.keys(args.path).forEach(key =>{
            url = url.replace(':' + key,args.path[key] ) 
        })
    }
    let config = {};//Object.assign({}, baseConfig);
    config.url = url;
    config.method = type;
    //args里的data
    if(type == 'get'){
        config.params = data;
    }
    else{
        config.data = data;
    }
    
    config.headers = headers?headers:{
        'Content-Type':'application/x-www-form-urlencoded'
    }
    
    
    return new Promise((resolve,reject) => {
        if(!args.hasProxy){
            axios(config).then(res =>{
                if(res.status =='200'){
                    resolve(res);
                }
                else{
                    reject(res);
                }
            },err =>{
                if(err.response && err.response.status){
                    reject(err.response.statusText);
                }
                else{
                    reject('网络错误');
                }
            })
        }
        else{
           
            axios(config).then(res =>{
                if(res.status =='200'){
                    resolve(res);
                }
                else{
                    reject(res);
                }
            },err =>{
                if(err.response && err.response.status){
                    reject(err.response.statusText);
                }
                else{
                    reject('网络错误');
                }
            })
        }
    })
}
