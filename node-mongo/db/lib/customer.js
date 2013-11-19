var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;


function _createObjectId(str){
        try{
            str=str.toString();
            return  new objectId(str);
        }catch(err){
            console.error("createObjectId:",err);
            return false;
        }
};
/*
**返回customerInfo 详细信息；
*根据
*/
function _getCustomerInfoData(jsonReq,callback){
    var database=jsonReq.database;
    var userId=jsonReq.userId;
    var uid= _createObjectId(userId);
    var tempObj={};
    var queryObj=jsonReq.queryObj;
    if(queryObj.userId){
        var userId=_createObjectId(queryObj.userId);
        if(!userId){return callback("err")};
        tempObj["userId"]=userId;
    }
    if(queryObj.bindUser){
        var bindUser=_createObjectId(queryObj.bindUser);
        if(!bindUser){return callback("err")};
        tempObj["bindUser"]=bindUser;
    }
    console.log(tempObj);
    var col=database.collection("customerInfo");
        col.findOne(tempObj,function(err,doc){
            if(err){return callback(err)};
            callback(err,doc);
        });
}

/*
**验证登录者和cusInfoId 的关系
**创建，绑定，none；
*/
function getUserAndCustomerRelation(jsonReq,callback){
    var database=jsonReq.database;
    var cusInfoId=jsonReq.cusInfoId;
    var userId=jsonReq.userId;
    var cid= _createObjectId(cusInfoId);
    var uid= _createObjectId(userId);
    if(!(cid&&uid)){return callback("err")};
    var col=database.collection("customerInfo");
        col.findOne({"_id":cid},function(err,doc){
            var ID;
            if(doc){
              if(doc.bindUser&&(uid.toString())==(doc.bindUser.toString())){
                  ID="binder";
              }else if(doc.userId&&(uid.toString())==(doc.userId.toString())){
                  ID="creator";
              }else{
                  ID="none";
              }
            }else{
                  ID="none";
            }
            callback(err,ID);
        });
}

//在 客户关系表中增加一项 客户具体信息 的索引
function _addCustomerToList(jsonReq,callback){
    var database=jsonReq.database;
    var cusId=jsonReq.cusInfoId;
    var userId=jsonReq.userId;
    var col=database.collection("userCustomer");
        col.update({"userId":userId},{$addToSet:{customerList:{$each:[{"cusId":cusId}]}}},{w:1},function(err,doc){
            callback(err,{"status":"ok"});
        });
};
//检测customerInfo 相信信息是否绑定用户;
function _checkBind(jsonReq,callback){
    var database=jsonReq.database;
    var cusId=jsonReq.cusId;
    var cusId=_createObjectId(cusId);
    if(!(cusId)){return callback("create ObjectId error")}
    var col=database.collection("customerInfo");
        col.find({"_id":cusId}).toArray(function(err,item){
            if(err){return callback(err)}
            if(item.length>0){
                if(null==item[0].bindUser){
                    callback(err,false);
                }else{
                    callback(err,true);
                }
            }else{
                callback(err,false);
            }
        });
};
//绑定用户Id到customerInfo表中；
function _bindUser(jsonReq,callback){
    var database=jsonReq.database;
    var cusId=jsonReq.cusId;
    var userId=jsonReq.userId;
    var reserverMessage=jsonReq.reserverMessage;
    var col=database.collection("customerInfo");
    var cusId=_createObjectId(cusId);
    var userId=_createObjectId(userId);
        if(!(cusId&&userId)){return callback("create ObjectId error")}
        _checkBind(jsonReq,function(err,result){
            if(!result){
                col.update({"_id":cusId,"reserverMessage":reserverMessage},{$set:{"bindUser":userId}},function(err,item){
                    console.log(item);
                        callback(err,item);
                });
            }else{
                callback(err,"sorry already bind");    
            }
        });
    
}
//增加一项客户具体信息
function _addCustomerInfo(jsonReq,callback){
    var database=jsonReq.database;
    var userId=jsonReq.userId;
        boy={
            "name":jsonReq.boyName||null,
            "phone":jsonReq.boyPhone||null,
            "other":jsonReq.boyOther||null
        }
        girl={
            "name":jsonReq.girlName||null,
            "phone":jsonReq.girlPhone||null,
            "other":jsonReq.girlOther||null
        }
        address=jsonReq.address||null;
        message=jsonReq.message;

    var col=database.collection("customerInfo");
        var id=new objectId();
        var userId=_createObjectId(userId);
        var imagesLibId=new objectId();
        if(!userId){return callback("create ObjectId error")};
        col.insert({"_id":id,imagesLibId:imagesLibId,bindUser:null,userId:userId,address:address,reserverMessage:message,member:{"boy":boy,"girl":girl}},function(err,item){
            callback(err,{"cusInfoId":id,"imageLibId":imagesLibId});
        });
}
//通过Id 获取一项客户具体信息
//function _getCustomerInfoById(jsonReq,callback){
function _getImageLibsId(jsonReq,callback){
    var database=jsonReq.database;
    var cusId=jsonReq.cusId;
    var userId=jsonReq.userId;
    var col=database.collection("customerInfo");
    col.find({"_id":cusId,"userId":userId}).toArray(function(err,item){
        if(item.length>0){
            callback(err,item[0].imagesLibId); 
        }else{
            callback(err,null); 
        }
    });
}
//通过用户Id 获取 客户关系表
function _getCustomerList(jsonReq,callback){
    var database=jsonReq.database;
    var userId=jsonReq.userId;
    var col=database.collection("userCustomer");
    col.find({userId:userId}).toArray(function(err,item){
        if(item.length==0){return callback(err,[])};
        var ary=item[0].customerList;
        var tempAry=[];
        for(var i=0;i<ary.length;i++){
            var cusId=_createObjectId(ary[i].cusId);
            tempAry.push(cusId);
        }
        var coll=database.collection("customerInfo");
        coll.find({"_id":{$in:tempAry}},{"reserverMessage":1,member:1,bindUser:1}).toArray(function(err,item){
            callback(err,item);
        });
    
        
    });
};

//在customerList表中创建账号对应的客户关系表
function _createCustomerListForUser(jsonReq,callback){
    var database=jsonReq.database;
    var userId=jsonReq.userId;
        _getCustomerList({
            "database":database,
            "userId":userId
        },function(err,item){
            if(err){return callback(err)}
            if(item.length==0){
                var col=database.collection("userCustomer");
                col.insert({userId:userId},function(err,item){
                    if(err){return callback(err)}
                    callback(err,"create Ok");
                });
            }else{
                callback(err,"customerList exist");
            }
        });
}

//给用户绑定product
function bindProductToCustomer(jsonReq,callback){
    var database=jsonReq.database;
    var cid=_createObjectId(jsonReq.cusInfoId);
    var pid=_createObjectId(jsonReq.productId);
    if(!(cid&&pid)){return callback("create object Id error");}
    var col=database.collection("customerInfo");
        col.update({"_id":cid},{$addToSet:{products:{$each:[{"_id":pid}]}}},function(err,result){
            callback(err,result);
        });
}

//删除用户绑定的product
function removeProductFromCustomer(jsonReq,callback){
    var database=jsonReq.database;
    var cid=_createObjectId(jsonReq.cusInfoId);
    var pid=_createObjectId(jsonReq.productId);
    if(!(cid&&pid)){return callback("create object Id error");}
    var col=database.collection("customerInfo");
        col.update({"_id":cid},{$pull:{products:{"_id":pid}}},function(err,result){
            callback(err,result);
        });
}

//删除用户绑定的product
function getProductsFromCustomer(jsonReq,callback){
    var database=jsonReq.database;
    var cid=_createObjectId(jsonReq.cusInfoId);
    if(!(cid)){return callback("create object Id error");}
    var col=database.collection("customerInfo");
        col.findOne({"_id":cid},{"products":1},function(err,result){
            callback(err,result);
        });
}
/*
function _searchCustomer(jsonReq,callback){
    var database=jsonReq.database;
    var keyword=json.keyword;
    var col=database.collection("customer");
        col.find({$or:[{"name":keyword},{"qqId":keyword},{"email":keyword}]},{"name":1,"_id":0}).toArray(function(err,item){
            callback(err,item);
        })
}

exports.searchCustomer=_searchCustomer;
*/

exports.bindUser=_bindUser;
exports.checkBind=_checkBind;
exports.addCustomerToList=_addCustomerToList;
exports.getCustomerList=_getCustomerList;
exports.addCustomerInfo=_addCustomerInfo;
exports.getImageLibsId=_getImageLibsId;
exports.createCustomerListForUser=_createCustomerListForUser;
exports.getUserAndCustomerRelation=getUserAndCustomerRelation;
exports.getCustomerInfoData=_getCustomerInfoData;
exports.bindProductToCustomer=bindProductToCustomer;
exports.removeProductFromCustomer=removeProductFromCustomer;
exports.getProductsFromCustomer=getProductsFromCustomer;
