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
            return  new objectId(id);
        }catch(err){
            return false;
        }
};

function _addCustomer(jsonReq,callback){
        var database=jsonReq.database;
        var cusId=jsonReq.cusId;
        var username=jsonReq.username;
        var col=database.collection("customerList");
            col.update({"username":username},{$addToSet:{customerList:{$each:[{"cusId":cusId}]}}},{w:1},function(err,doc){
                console.log(doc);
                callback(err,{"status":"ok"});
            });
};

function _createCustomer(jsonReq,callback){
    var database=jsonReq.database;
    var imageId=jsonReq.imageId,
        userId=jsonReq.userId||null,
        username=jsonReq.username||null,
        boy=jsonReq.boyInfo,
        girl=jsonReq.girlInfo,
        address=jsonReq.address||null;
        message=jsonReq.message;

    var col=database.collection("customer");
        var id=new objectId();
        col.insert({"_id":id,images:imageId,bindUser:userId,address:address,reserverMessage:message,member:{"boy":boy,"girl":girl}},function(err,item){
            callback(err,item);
            /*
            _addCustomer({
                database:database,
                "username":username,
                cusId:id//may be error;
            },function(err,result){
                callback(err,{"message":"ok"});
            });
            */
        });
}

function _getCustomerInfoById(jsonReq,callback){
    var database=jsonReq.database;
    var cusId=jsonReq.cusId;
    var col=database.collection("customer");
    console.log(cusId);
    col.find({"_id":cusId}).toArray(function(err,item){
        callback(err,item); 
    });
}

function _getCustomerList(jsonReq,callback){
    var database=jsonReq.database;
    var username=jsonReq.username;
    var col=database.collection("customerList");
    col.find({username:username}).toArray(function(err,item){
    });
};
/*
function _getCustomerList(jsonReq,callback){
    var database=jsonReq.database;
    var username=jsonReq.username;
            var col=database.collection("customer");
            // maybe use findOne function; need overwrite
            col.find({username:username}).toArray(function(err,item){
                if(0<item.length){
                    var count=0;
                    var userList=[];
                    var cusList=item[0].customerList;
                    for(var i=0,l=cusList.length;i<l;i++){
                        var obj=cusList[i];
                        var value;
                        var key;
                        for(var _key in obj){
                            value=obj[_key];
                            key=_key;
                            break;
                        }
                        var colUsers=database.collection("users");
                        (function(){
                            var k=key;
                            var v=value;
                            var page={"username":"name","qq":"qq","email":"email"}
                            var tempObj={};
                                tempObj[page[key]]=value;
                           // colUsers.find({$or:[{"name":value},{"qq":value},{"email":value}]},{"name":1,"_id":0,"email":1,"qq":1,"mobile":1}).toArray(function(err,item2){
                            colUsers.find(tempObj).toArray(function(err,item2){
                            count++;
                            if(0<item2.length){
                                userList.push(item2[0]);
                            }else{
                                var tempObj={};
                                    tempObj[k]=v;
                                userList.push(tempObj);
                            };
                            if(count==item[0].customerList.length){
                                callback(err,userList);
                            }
                        })
                        })();
                    }
                    //callback(item[0].customerList);
                }else{
                    callback(null);
                }
            });
}
*/
/*
function _createCustomerRow(jsonReq,callback){
    var database=jsonReq.database;
    var username=jsonReq.username;
    var col=database.collection("customer");
        col.find({username:username}).toArray(function(err,item){
            if(0==item.length){
                col.insert({username:username},function(err,item){
                    if(err){return callback("err")}
                    callback("create Ok");
                });
            }else{
                callback("already exists");
            };
        });
}
*/
function _searchCustomer(jsonReq,callback){
    var database=jsonReq.database;
    var keyword=json.keyword;
    var col=database.collection("customer");
        col.find({$or:[{"name":keyword},{"qqId":keyword},{"email":keyword}]},{"name":1,"_id":0}).toArray(function(err,item){
            callback(err,item);
        })
}

exports.searchCustomer=_searchCustomer;
exports.addCustomer=_addCustomer;
exports.getCustomerList=_getCustomerList;
exports.createCustomer=_createCustomer;
exports.getCustomerInfoById=_getCustomerInfoById;


