import axios from 'axios';

let domain = '';

let postMethods = {
    vuetable:domain +'/static/vuetable'
};

const outExports = {

};

for(let key in postMethods){
    outExports[key] = function (jsondata,callback) {
        invokeServer('post',postMethods[key],jsondata,callback);
    }
}

function invokeServer(methodType,url,jsondata,callback) {
    axios[[methodType]](url, jsondata).then(function (result) {
        callback(result);
    }).catch(function (error) {
        callback(error);
    });
}


export default outExports;


