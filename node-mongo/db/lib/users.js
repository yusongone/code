var mongodb=require("mongodb"),
    format=require("util").format,
    crypto=require("crypto");
    objectId=mongodb.ObjectID,
    Db=mongodb.Db,
    Server=mongodb.Server;
var db_conf=require("../../config.json").db;
var createDb=require("./common").createDb;


//user collection;
    var _insertUserName=function(json,callback){
        var db=createDb();
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("users");
                col.find({"name":json.userName},{"name":1}).toArray(function(err,item){
                    console.dir(err);
                    if(err){database.close();return callback({"status":"sorry","message":err})}
                    var count=item.length;
                    if(count>0){
                        callback({"status":"sorry","message":"用户名已经存在!"});
                        database.close();
                    }else{
                        var md5=crypto.createHash("md5");
                        var md5Pass=md5.update(json.pass).digest("base64");
                        col.insert({"name":json.userName,"pass":md5Pass},function(err,res){
                            console.dir(err);
                            if(err){return callback({"status":"sorry","message":err});}
                            callback({"status":"ok"});
                            database.close();
                        });
                    }
                });
            });
        });
    };
    var _compareNameAndPass=function(json,callback){
        var db=createDb();
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("users");
                var md5=crypto.createHash("md5");
                var md5Pass=md5.update(json.pass).digest("base64");
                col.find({"name":json.userName,"pass":md5Pass}).toArray(function(err,item){
                    if(item.length>0){
                        callback({"status":"ok","userId":item[0]["_id"]});
                        database.close();
                    }else{
                        callback({"status":"sorry","message":"用户名或密码不正确！"});
                        database.close();
                    }
                })
            });
        });
    }


function _searchUser(json,callback){
        var db=createDb();
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("users");
                col.find({$or:[{"name":json.keyword},{"qq":json.keyword},{"email":json.keyword}]},{"name":1,"_id":0}).toArray(function(err,item){
                    callback(item);
                    database.close();
                })
            });
        });
}


exports.searchUser=_searchUser;
exports.insertUserName=_insertUserName;
exports.compareNameAndPass=_compareNameAndPass;
