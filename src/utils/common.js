let utils = {};

utils.regExp = {
    validatePhone:(rule, value, callback) => {
        let regPhone = new RegExp(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/);
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

export default utils;
