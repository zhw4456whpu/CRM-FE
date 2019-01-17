let utils ={};
utils.isObject = function(arg){
    return typeof arg === 'object' && !(arg instanceof Array);
}

utils.isNullObject = function(arg){
    return typeof arg == 'undefined' || arg == null || arg == 'null' || arg == '';
}

export default utils;