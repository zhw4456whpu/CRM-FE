function assign(o) {
    if(o && typeof o == "boolean"){
        return o.toString();
    }
    else if(o && typeof o == "string"){
        return o.toString();
    }
    else if(o && typeof o == "object" && o instanceof Array){
        let a=[];
        for(let i = 0,l= o.length;i<l;i++) {
            a.push(o[i]);
        }
        return a;
    }
    else if(o && typeof o == "object"){
        return Object.assign({},o);
    }
    else if(o && typeof o == "number"){
        return o.valueOf();
    }
    else if(o && typeof o == "function"){
        return o;
    }
    else{
        return 'undefined';
    }
}

(function(){
        var n = 1;
        add = function(){
            n = n +1;
        };
        sub = function(){
            n = n - 1;
        }
    }
 )();
 
 