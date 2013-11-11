/*
 *control lib customer.js
 * */

var db=require("../../db");
var parse=require("./common").parse;
var Type=require("./common").Type;

function _getCustomerInfoIdByBindUserId(jsonReq,callback){
   db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        jsonReq.queryObj={
            bindUser:jsonReq.userId
        }
       db.Customer.getCustomerInfoData(jsonReq,function(err,doc){
           if(doc){
                callback(err,doc["_id"]); 
           }else{
                callback(err,null); 
           }
       });
   });
}

//绑定用户到客户关系；
function _bindUser(jsonReq,callback){
   db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        db.Customer.bindUser(jsonReq,function(err,item){
            database.close();
            callback(err,item);
        }); 
   }); 
};

//检测客户关系是否已经绑定过
function _checkBind(jsonReq,callback){
   db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        db.Customer.checkBind(jsonReq,function(err,item){
            database.close();
            callback(err,item);
        }); 
   }); 
};

//账户增加客户
function _addCustomer(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        //假设customer表中不存在登陆者的客户关系，将创建，如果存在，将插入数据；
        db.Customer.createCustomerListForUser(jsonReq,function(err,data){
           if(data!="err"){
                //创建图片库
                db.Customer.addCustomerInfo(jsonReq,function(err,result){
                   jsonReq.cusInfoId=result.cusInfoId;
                   jsonReq.imageLibId=result.imageLibId;
                    db.ImageLibs.createImageLibs(jsonReq,function(err,result){
                        jsonReq.imagesLibId=result["_id"];
                        db.Customer.addCustomerToList(jsonReq,function(err,result){
                           database.close();
                            callback(err,result);
                        });
                    });
               });
           }
        });
    });
}
//获取账户下所有客户
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
//搜索客户
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
exports.getCustomerInfoIdByBindUserId=_getCustomerInfoIdByBindUserId;
