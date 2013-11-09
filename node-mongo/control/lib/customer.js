/*
 *control lib customer.js
 * */

var db=require("../../db");
var parse=require("./common").parse;
var Type=require("./common").Type;

function _bindUser(jsonReq,callback){
   db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        db.Customer.bindUser(jsonReq,function(err,item){
            database.close();
            callback(err,item);
        }); 
   }); 
};
function _checkBind(jsonReq,callback){
   db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        db.Customer.checkBind(jsonReq,function(err,item){
            database.close();
            callback(err,item);
        }); 
   }); 
};

function _addCustomer(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        //假设customer表中不存在登陆者的客户关系，将创建，如果存在，将插入数据；
        db.Customer.createCustomerListForUser(jsonReq,function(err,data){
           if(data!="err"){
               db.Customer.addCustomerInfo(jsonReq,function(err,cusInfoId){
                   jsonReq.cusInfoId=cusInfoId;
                db.Customer.addCustomerToList(jsonReq,function(err,result){
                   database.close();
                    callback(err,result);
                });
               });
           }
        });
    });
}
//
function _getCustomerList(jsonReq,callback){
    var userId=jsonReq.userId;
    db.Common.getAuthenticationDatabase(function(err,database){
        db.Customer.getCustomerList({
            database:database,
            userId:userId
        },function(err,json){
            database.close();
            callback(err,json);
       }); 
    });
}

function _searchCustomer(json,callback){
    db.Customer.searchCustomer({
        "keyword":json.keyword
    },function(json){
        database.close();
        callback(json);
    });
}


exports.addCustomer=_addCustomer;
exports.getCustomerList=_getCustomerList;
exports.searchCustomer=_searchCustomer;
exports.bindUser=_bindUser;
exports.checkBind=_checkBind;
