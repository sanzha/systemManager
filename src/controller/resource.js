import axios from 'axios';
import qs from 'qs';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials=true;
axios.interceptors.request.use(
    config => {
        if(config.method=='post'){
            config.data = qs.stringify(config.data),
                config.headers = {
                    'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
                };
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);


// let domain = 'http://gentou.acmefar.com:8088/';
let domain = 'http://49.4.66.170:80/test/';
// let domain = 'http://192.168.1.9:8088/';
let postMethods = {
    customerList:domain +'customer/list',   //客户列表
    customerAdd:domain +'customer/create',  //新增客户
    customerUpdate:domain +'customer/update',   //修改客户
    customerDel:domain +'customer/delete',  //删除客户
    userList:domain +'user/list',  //员工列表
    userAdd:domain +'user/create',  //新增员工
    userUpdate:domain +'user/update',  //新增员工
    login:domain +'login',  //登陆
    loanList:domain +'bill/list',  //借款列表
    loanAdd:domain +'bill/create',  //新增借款
    loanDetail:domain +'bill/detail',  //借款详情
    loanDelete:domain +'bill/delete',  //删除借款
    repaymentList:domain +'returnbill/list',  //还款列表
    repaymentUpdate:domain +'returnbill/update',  //还款信息修改
    repaymentConfirm:domain +'returnbill/return',  //确认还款
    repaymentBatchConfirm:domain +'returnbill/prepayment',  //确认还款
    bailList:domain +'bailbill/list',  //保证金列表
    bailUpdate:domain +'bailbill/update',  //保证金信息修改
    bailHandle:domain +'bailbill/handle',  //确认处理保证金
    commisionbillList:domain +'commisionbill/list',  //佣金列表
    commisionbillUpdate:domain +'commisionbill/update',  //佣金信息修改
    commisionbillHandle:domain +'commisionbill/handle',  //确认处理佣金
};

let getMethods = {
    getBatchRepaymentInfo:domain +'returnbill/prepayment'   //客户列表
};



const outExports = {

};

for(let key in postMethods){
    outExports[key] = function (jsondata,callback) {
        invokeServer('post',postMethods[key],jsondata,callback);
    }
}
for(let key in getMethods){
    outExports[key] = function (jsondata,callback) {
        invokeServer('get',getMethods[key],{params:jsondata},callback);
    }
}

function invokeServer(methodType,url,jsondata,callback) {
    axios[[methodType]](url, jsondata).then(function (response) {
        if(response.data.code==421){
            window.location.href = window.location.origin;
        }else{
            callback(response.data);
        }
    }).catch(function (error) {
        callback(error);
    });
}


export default outExports;


