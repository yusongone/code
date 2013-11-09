var mongodb=require("mongodb"),
    crypto=require("crypto");
    objectId=mongodb.ObjectID,
    Db=mongodb.Db,
    Server=mongodb.Server,
    gridStore=mongodb.GridStore;
var db_conf=require("../../config.json").db;
var createDb=require("./common").createDb;


function _createObjectId(str){
        try{
            str=str.toString();
            return  new objectId(str);
        }catch(err){
            console.error("createObjectId:",err);
            return false;
        }
};

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
        //callback(err,item[0].customerList);
        if(item.length==0){return callback(err,[])};
        var ary=item[0].customerList;
        var tempAry=[];
        for(var i=0;i<ary.length;i++){
            var cusId=_createObjectId(ary[i].cusId);
          //  if(!(cusId)){return callback("create ObjectId error")}
            tempAry.push(cusId);
        }
        var coll=database.collection("customerInfo");
        coll.find({"_id":{$in:tempAry}},{"reserverMessage":1,member:1}).toArray(function(err,item){
            callback(err,item);
        });
    
        
    });
};

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
