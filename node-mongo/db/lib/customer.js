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

function _addCustomer(json,callback){
        var db=createDb();
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("customer");
                var dd={};
                dd[json.type]=json.cusUsername;
                    col.update({"username":json.username},{$addToSet:{customerList:{$each:[dd]}}},{w:1},function(err){
                        callback({"status":"ok"});
                        database.close();
                    });
            });
        });
};

function _getCustomerList(json,callback){
    var db=createDb();
    db.open(function(err,database){
        database.authenticate(db_conf.user,db_conf.pass,function(err,db){
            var col=database.collection("customer");
            // maybe use findOne function; need overwrite
            col.find({username:json.username}).toArray(function(err,item){
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
                                callback(userList);
                                database.close();
                            }
                        })
                        })();
                    }
                    //callback(item[0].customerList);
                }else{
                    callback(null);
                    database.close();
                }
            });
        });
    });
}

function _createCustomerRow(json,callback){
    var db=createDb();
    db.open(function(err,database){
        database.authenticate(db_conf.user,db_conf.pass,function(err,db){
            var col=database.collection("customer");
            col.find({username:json.username}).toArray(function(err,item){
                if(0==item.length){
                    col.insert({username:json.username},function(err,item){
                        if(err){return callback("err")}
                        callback("create Ok");
                    });
                }else{
                    callback("already exists");
                };
                database.close();
            });
        });
    });
}
function _searchCustomer(json,callback){
        var db=createDb();
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("customer");
                col.find({$or:[{"name":json.keyword},{"qqId":json.keyword},{"email":json.keyword}]},{"name":1,"_id":0}).toArray(function(err,item){
                    callback(item);
                    database.close();
                })
            });
        });
}

exports.searchCustomer=_searchCustomer;
exports.addCustomer=_addCustomer;
exports.getCustomerList=_getCustomerList;
exports.createCustomerRow=_createCustomerRow;


