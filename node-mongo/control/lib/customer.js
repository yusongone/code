/*
 *control lib customer.js
 * */

var db=require("../../db");
var parse=db.Common.parse;
var Type=db.Common.Type;
var getPool=db.Common.getPool;
var poolMain=getPool("main");

function _getCustomerInfoIdByBindUserId(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        jsonReq.queryObj={
            bindUser:jsonReq.userId
        }
       db.Customer.getCustomerInfoData(jsonReq,function(err,doc){
            poolMain.release(database);
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
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.bindUser(jsonReq,function(err,item){
            poolMain.release(database);
            callback(err,item);
        }); 
   }); 
};

//检测客户关系是否已经绑定过
function _checkBind(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.checkBind(jsonReq,function(err,item){
            poolMain.release(database);
            callback(err,item);
        }); 
   }); 
};

//账户增加客户
function _addCustomer(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        //假设customer表中不存在登陆者的客户关系，将创建，如果存在，将插入数据；
        db.Customer.createCustomerListForUser(jsonReq,function(err,data){
           if(data!="err"){
                //创建图片库
                db.Customer.addCustomerInfo(jsonReq,function(err,result){
                   jsonReq.cusInfoId=result.cusInfoId;
                   jsonReq.imageLibId=result.imageLibId;
                    db.ImageLibs.createImageLibs(jsonReq,function(err,result){
                        if(err){
                            poolMain.release(database);
                            return callback(err);
                        }
                        jsonReq.imagesLibId=result["_id"];
                        db.Customer.addCustomerToList(jsonReq,function(err,result){
                            poolMain.release(database);
                            if(err){
                                return callback(err);
                            }
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
    poolMain.acquire(function(err,database){
        db.Customer.getCustomerList({
            database:database,
            userId:userId
        },function(err,json){
            poolMain.release(database);
            if(err){
                return callback(err);
            }
            callback(err,json);
       }); 
    });
}
//搜索客户
function _searchCustomer(json,callback){
    poolMain.acquire(function(err,database){
        db.Customer.searchCustomer({
            database:database,
            "keyword":json.keyword
        },function(json){
            poolMain.release(database);
            if(err){
                return callback(err);
            }
            callback(json);
        });
    });
}

//给用户绑定模板
function bindProductToCustomer(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            console.log(jsonReq.userId);
            if("creator"==result){
                db.Customer.bindProductToCustomer(jsonReq,function(err,res){
                    poolMain.release(database);
                    callback(err,res);
                });
            }
        });
    });
}

//删除用户绑定的模板
function removeProductFromCustomer(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            if("creator"==result){
                db.Customer.removeProductFromCustomer(jsonReq,function(err,res){
                    callback(err,res);
                });
            }
        });
    });
}

//删除用户绑定的product
function getProductsFromCustomer(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result,resJson){
                        console.log("eeff");
            if(err){ poolMain.release(database); return callback(err) };
            if("creator"==result||"binder"==result){
                jsonReq.userId=resJson.userId;
                db.Customer.getProductsFromCustomer(jsonReq,function(err,res){
                    if(err){ poolMain.release(database);return callback(err);};
                    db.Product.getProductsByUserId(jsonReq,function(err,doc){
                        if(err){ poolMain.release(database);return callback(err);};
                        poolMain.release(database);
                        var tempAry=[];
                        console.log("ff");
                        if(!(res&&doc)){return callback(err,[])}
                        for(var i=0;i<res.length;i++){
                            for(var j=0;j<doc.length;j++){
                                if(doc[j]["_id"].toString()==res[i]["_id"].toString()){
                                    tempAry.push(doc[j]);
                                }
                            }
                        }
                        callback(err,tempAry);
                    });
                });
            }else{
                poolMain.release(database);
                console.log("not found");
                callback("not found")
            }
        });
    });
}


exports.addCustomer=_addCustomer;
exports.getCustomerList=_getCustomerList;
exports.searchCustomer=_searchCustomer;
exports.bindUser=_bindUser;
exports.checkBind=_checkBind;
exports.getCustomerInfoIdByBindUserId=_getCustomerInfoIdByBindUserId;
exports.bindProductToCustomer=bindProductToCustomer;
exports.removeProductFromCustomer=removeProductFromCustomer;
exports.getProductsFromCustomer=getProductsFromCustomer;
