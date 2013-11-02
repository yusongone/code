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
           var type=Type.getType(json.cusUsername);
           if(type=="err"){
               //添加用户只能添加已经注册过的用户，在现有数据库中查找验证。
               db.Users.searchUser({"keyword":json.cusUsername},function(result){
                   if(result.length>0){
                       json.type="username";
                       db.Customer.addCustomer(json,function(result){
                             callback(result);
                       }); 
                   }else{
                        callback("只能添加注册用户");
                   }
               });
           }else{
                var hash={"qq":"qq","email":"email","mobile":"mobile"};
                if(!hash[type]){return callback("type error")};
               //在现有用户中查找对应的user，如果存在，则存储username，不存在，储存此属性
               db.Customer.addCustomer(json,function(result){
                     callback(result);
               }); 
           }
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
