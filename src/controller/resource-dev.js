let domain = '/static/mock/';

let postMethods = {
    customerList:domain +'customer/list',   //客户列表
    customerAdd:domain +'customer/create',  //新增客户
    customerUpdate:domain +'customer/update',   //修改客户
    customerDel:domain +'customer/delete',  //删除客户
};

const outExports = {

};

for(let key in postMethods){
    outExports[key] = function (jsondata,callback) {
        console.log(jsondata);
        invokeMock(postMethods[key],callback);
    }
}

function invokeMock(url,callback) {
    let xhr = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else if(window.ActiveXObject){
        xhr = new window.ActiveXObject();
    }else{
        alert("请升级至最新版本的浏览器");
    }
    if(xhr){
        xhr.open("GET",url+'.json',true);
        xhr.send(null);
        xhr.onreadystatechange = function(){
            if( xhr.readyState == 4 && xhr.status==200 ){
                let result = JSON.parse(xhr.responseText);
                callback(result);
            }
        };

    }
}


export default outExports;


