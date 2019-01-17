
/**格式化日期时间
 * date：new Date()的对象
 * fmt：format时间格式
 */
const formatDate = function(date,fmt){
    var o={
        "M+":date.getMonth()+1,//月份
        "d+":date.getDate(),//日
        "H+":date.getHours(),//小时
        "m+":date.getMinutes(),//分
        "s+":date.getSeconds(),//秒
        "q+":Math.floor((date.getMonth()+3)/3),//季度
        "S+":date.getMilliseconds()//毫毛
    };
    if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1,(date.getFullYear()+"").substr(4-RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/**对象深拷贝 */
const deepClone = function(obj){
    let objClone = Array.isArray(obj)?[]:{};
    if(obj && typeof obj==="object"){
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                //判断ojb子元素是否为对象，如果是，递归复制
                if(obj[key]&& (typeof obj[key] ==="object" || typeof obj[key] ==="function")){
                    objClone[key] = deepClone(obj[key]);
                }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}  
/**判断对象是否为空 */
const isNull = function(arg){
    return typeof arg == 'undefined' || arg == null || arg == 'null' || arg == '';
}
/**去除字符串前后空格 */
const trim = function(str){
    let ret = str.replace(/(^\s*)|(\s*$)/g, "")
    console.log("str.replace(/^\s([\w\s])*[\r\n\s]$/mg,'')", ret);
    return ret; 
}

/**获取IE版本 */
const getIEVersion = function(){
    var ua = navigator.userAgent, matches, tridentMap = {'4': 8, '5': 9, '6': 10, '7': 11};

    matches = ua.match(/MSIE (\d+)/i);

    if (matches && matches[1]) {
        return +matches[1];
    }
    matches = ua.match(/Trident\/(\d+)/i);
    if (matches && matches[1]) {
        return tridentMap[matches[1]] || null;
    }
    return null;
}
/**创建标准XMLHttpRequest */
const createStandardXHR = function () {
    try {
        return new window.XMLHttpRequest();
    } catch (e) {
        return false;
    }
};

/**创建Microsoft.XMLHTTP
 * 兼容IE
 */
const createActiveXHR = function () {
    try {
        return new window.ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {
        return false;
    }
};

/**创建XDomainRequest
 * 仅兼容	ie 8.0-9.x
 */
const createXDomainRequest = function() {
    var xhr = new XDomainRequest();
    xhr.readyState = 0;
    xhr.status = 100;
    xhr.onreadystatechange = EMPTYFN;
    xhr.onload = function () {
        xhr.readyState = 4;
        xhr.status = 200;

        var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = 'false';
        xmlDoc.loadXML(xhr.responseText);
        xhr.responseXML = xmlDoc;
        xhr.response = xhr.responseText;
        xhr.onreadystatechange();
    };
    xhr.ontimeout = xhr.onerror = function () {
        xhr.readyState = 4;
        xhr.status = 500;
        xhr.onreadystatechange();
    };
}
/**创建xmlrequest */
const xmlrequest = function (crossDomain) {
    crossDomain = crossDomain || true;
    var temp = createStandardXHR() || createActiveXHR();

    if ('withCredentials' in temp) {
        return temp;
    }
    if (!crossDomain) {
        return temp;
    }
    if (typeof window.XDomainRequest === 'undefined') {
        return temp;
    }
    var xhr = createXDomainRequest();//仅兼容	ie 8.0-9.x
    return xhr;
};

/**判断浏览器是否安装了Flash */
const hasFlash = (function () {
    if ('ActiveXObject' in window) {
        try {
            return new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        } catch (ex) {
            return 0;
        }
    } else {
        if (navigator.plugins && navigator.plugins.length > 0) {
            return navigator.plugins['Shockwave Flash'];
        }
    }
    return 0;
}());

/**
 * FormData对象用以将数据编译成键值对，以便用XMLHttpRequest来发送数据。
 * 其主要用于发送表单数据，但亦可用于发送带键数据(keyed data)，而独立于表单使用。
 * 如果表单enctype属性设为multipart/form-data ，则表单的submit()方法发送的数据具有同样形式。
 */
const hasFormData = typeof FormData !== 'undefined';

/**
 * Blob 对象表示一个不可变、原始数据的类文件对象。
 * Blob 表示的不一定是JavaScript原生格式的数据。
 * File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
 */
const hasBlob = typeof Blob !== 'undefined';

const tmpUtilXHR = xmlrequest(),
    isCanSetRequestHeader = tmpUtilXHR.setRequestHeader || false,
    hasOverrideMimeType = tmpUtilXHR.overrideMimeType || false,
    isCanUploadFileAsync = isCanSetRequestHeader && hasFormData,
    isCanUploadFile = isCanUploadFileAsync || _hasFlash,
    isCanDownLoadFile = isCanSetRequestHeader && (hasBlob || hasOverrideMimeType);

/**判断是否支持Wss协议 */
const isSupportWss = function() {
    var notSupportList = [/MQQBrowser[\/]5([.]\d+)?\sTBS/]
    if (!window.WebSocket) {
        return false;
    }
    var ua = window.navigator.userAgent;
    for (var i = 0, l = notSupportList.length; i < l; i++) {
        if (notSupportList[i].test(ua)) {
            return false;
        }
    }
    return true;
}

const Base64 = {

    // private property
    keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64.utf8Encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) + this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this.keyStr.indexOf(input.charAt(i++));
            enc2 = this.keyStr.indexOf(input.charAt(i++));
            enc3 = this.keyStr.indexOf(input.charAt(i++));
            enc4 = this.keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64.utf8Decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    utf8Encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    utf8Decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
/**生成n位随机数 */
const generateId = function(n) {
    var res = "";
    for(var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id];
    }
    return res;
}
export {formatDate, deepClone, isNull, trim, Base64, generateId}