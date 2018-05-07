var Utf8ArrayToStr = function (array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                               ((char2 & 0x3F) << 6) |
                               ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}

/**/
var unGzip = function (data, status, xhr) {
    //解压Gzip
    var acceptEncoding = xhr.getResponseHeader("Accept-Encoding");
    if (acceptEncoding != null && acceptEncoding == "gzip") {
        var strData = atob(data);
        var charData = strData.split('').map(function (x) { return x.charCodeAt(0); });
        var binData = new Uint8Array(charData);
        var uint8array = pako.inflate(binData);
        //data = new TextDecoder("utf-8").decode(uint8array);
        data = Utf8ArrayToStr(uint8array);

    }
    return eval("(" + data + ")");//转换为json对象
}


function GetRequest() { //获取URL中的参数
    var url = window.location.search; //获取URL中“？”之后的参数
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
};

function addCookie(name, value, days, path) {   /**添加设置cookie**/
    var name = escape(name);
    var value = escape(value);
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 3600000 * 24);
    //path=/，表示cookie能在整个网站下使用，path=/temp，表示cookie只能在temp目录下使用  
    path = path == "" ? "" : ";path=" + path;
    //GMT(Greenwich Mean Time)是格林尼治平时，现在的标准时间，协调世界时是UTC  
    //参数days只能是数字型  
    var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();
    document.cookie = name + "=" + value + _expires + path;
}
function getCookieValue(name) {  /**获取cookie的值，根据cookie的键获取值**/
    //用处理字符串的方式查找到key对应value  
    var name = escape(name);
    //读cookie属性，这将返回文档的所有cookie  
    var allcookies = document.cookie;
    //查找名为name的cookie的开始位置  
    name += "=";
    var pos = allcookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值  
    if (pos != -1) {                                             //如果pos值为-1则说明搜索"version="失败  
        var start = pos + name.length;                  //cookie值开始的位置  
        var end = allcookies.indexOf(";", start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie  
        var value = allcookies.substring(start, end); //提取cookie的值  
        return (value);                           //对它解码        
    } else {  //搜索失败，返回空字符串  
        return "";
    }
}
function deleteCookie(name, path) {   /**根据cookie的键，删除cookie，其实就是设置其失效**/
    var name = escape(name);
    var expires = new Date(0);
    path = path == "" ? "" : ";path=" + path;
    document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path;
}

//数据格式为一位小数
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 1) {
        s += '0';
    }
    return s;
}

//数据格式为两位小数
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

//获取验证码120秒倒计时
function invokeSettime(obj) {
    var countdown = 120;
    settime(obj);
    function settime(obj) {
        if (countdown == 0) {
            obj.attr("disabled", false);
            obj.val("获取验证码");
            countdown = 120;
            return;
        } else {
            obj.attr("disabled", true);
            obj.val("重新发送(" + countdown + ")s");
            countdown--;
        }
        setTimeout(function () {
            settime(obj)
        }
                , 1000)
    }
}

//首页设定温度弹框关闭
function box_close() {
    $(".tem_box").fadeOut(200);
    $(".tem_box_bg").fadeOut(200);
}