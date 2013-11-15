var mongodb=require("mongodb"),
    format=require("util").format,
    objectId=mongodb.ObjectID,
    crypto=require("crypto");


//user collection;
    var _insertUserName=function(jsonReq,callback){
            var database=jsonReq.database;
            var col=database.collection("users");
            var username=jsonReq.username;
            var pass=jsonReq.pass;
            col.find({"name":username},{"name":1}).toArray(function(err,item){
                if(err){return callback(err)};
                var count=item.length;
                if(count>0){
                    callback(err,{"status":"sorry","message":"name ware exist!"});
                }else{
                    var md5=crypto.createHash("md5");
                    var md5Pass=md5.update(pass).digest("base64");
                    col.insert({"name":username,"pass":md5Pass},function(err,res){
                        if(err){return callback(err)};
                        callback(err,{"status":"ok"});
                    });
                }
            });
    };

    var _compareNameAndPass=function(jsonReq,callback){
        var database=jsonReq.database;
        var username=jsonReq.username;
        var pass=jsonReq.pass;

        var col=database.collection("users");
        var md5=crypto.createHash("md5");
        var md5Pass=md5.update(pass).digest("base64");

        col.find({"name":username,"pass":md5Pass}).toArray(function(err,item){
            if(item.length>0){
                callback(err,{"status":"ok","userId":item[0]["_id"]});
            }else{
                callback(err,{"status":"sorry","message":"用户名或密码不正确！"});
            }
        })
    }

    var getUserInfoById=function(jsonReq,callback){
        var database=jsonReq.database;
        var userId=jsonReq.userId;
        var col=database.collection("users");
        var uid=_createObject(userId);
        if(!uid){return callback("create uid error at getUserInfoById")}
        col.findOne({"_id":uid},function(err,doc){
            if(err){return callback(err)}
            callback(err,doc);
        });
    };


function _searchUser(jsonReq,callback){
        var database=jsonReq.database;
        var keyword=jsonReq.keyword;
        var col=database.collection("users");
        col.find({$or:[{"name":keyword},{"qq":keyword},{"email":keyword}]},{"name":1,"_id":0}).toArray(function(err,item){
            callback(err,item);
        });
}


exports.searchUser=_searchUser;
exports.insertUserName=_insertUserName;
exports.compareNameAndPass=_compareNameAndPass;
exports.getUserInfoById=getUserInfoById;
