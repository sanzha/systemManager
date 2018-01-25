let utils = {};

utils.regExp = {
    validatePhone:(rule, value, callback) => {
        let regPhone = new RegExp(/^1\d{10}$/);
        if (value === '' || value == undefined) {
            callback(new Error('请输入手机号'));
        }else{
            if (!regPhone.test(value)) {
                callback(new Error('请输入正确的手机号'));
            }
            callback();
        }
    }
};

utils.propertyExtend = (source,target)=>{
    for(let key in source){
        if(source[key] != target[key] ){
            target[key] = source[key];
        }
    }
};

utils.convertDict = (id,arr) =>{
    for(let i=0;i<arr.length;i++){
        let item = arr[i];
        if(id==item.id){
            return item;
        }
    }
    return {};
};

utils.lsp = {
    add:function(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    },
    get:function(key){
        return JSON.parse(localStorage.getItem(key));
    },
    remove:function(key){
        localStorage.removeItem(key);
    },
    clear:function(){
        localStorage.clear();
    }
};

export default utils;
