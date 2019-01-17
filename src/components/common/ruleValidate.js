/*
**异步校验表单重复的方法
**传入json的格式
    json={
url:'ssss',           //验证需要的url
method:'get',         //默认get方法
tip:'存储名称重复'    //不写默认提示
response:exist        //后端get方法返回重复提示的字段，默认为exist，exist为true代表重复
    }
*/
Vue.prototype.checkBackNameRepeat = (json) => {
let url = json.url;
let editName = ""
//利用闭包返回一个函数，因为在vue文件中自定义的验证必须是个函数，闭包帮我们保存一些需要的东西
return function(rule, value, callback){//这三个参数是验证函数必须传入的，可以参考以上的validatePasscheck函数
    let _url = url;
    _url = _url.replace("{value}", value);
    /*保存后端第一次返回数据，本次数据在编辑状态下不能算重复*/
    if(json.edit && !editName){
    editName = value;
    }
    if(editName == value){
    callback();
    return;
    }
　　//head方法，返回404则代表不重复，否则就是重复
    if( json.method && json.method.toUpperCase() === 'HEAD' ){
    axios.head( _url ).then( (e) => {
        callback( new Error( json.tip?json.tip:'名称重复' ) );//callback运行带有参数代表验证不通过
    },( err)=>{
        callback();//callback运行无参数代表验证通过
    })
　　//剩下就是get方法，返回指定的条件才是重复和不重复的区别
    }else{
    axios.get( _url ).then( (e) => {
        if( e.data.response[json.response] || e.data.response.exist ){
        callback( new Error( json.tip?json.tip:'名称重复' ) );
        }else{
        callback();
        } 
    },( err ) => {
        callback();
    })
    }
}
}