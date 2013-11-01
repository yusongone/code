var db=require("../../db");
var parse=require("./common").parse;
var Type=require("./common").Type;

function _addCustomer(json,callback){
    var json={
        "username":json.username,
        "cusUsername":json.cusUsername,
        "type":Type.getType(json.cusUsername)
    };


    //假设customeer表中不存在登陆者的客户关系，将创建，如果存在，将插入数据；
   db.Customer.createCustomerRow(json,function(data){
       if(data!="err"){
           db.Customer.addCustomer(json,function(result){
                 callback(result);
           }); 
       }
   });
}

function _getCustomer(json,callback){
    db.Customer.getCustomerList(json,function(json){
        callback(json);
   }); 

}

function _searchCustomer(json,callback){
    db.Customer.searchCustomer({
        "keyword":json.keyword
    },function(json){
        callback(json);
    });
}

exports.addCustomer=_addCustomer;
exports.getCustomerList=_getCustomer;
exports.searchCustomer=_searchCustomer;
