var db=require("../../db");
var parse=require("./common").parse;
var getPool=db.Common.getPool;
var poolMain=getPool("main");


function _searchUser(json,callback){
    poolMain.acquire(function(err,database){
        if(err){return callback(err);}
        db.Users.searchUser({
            database:database,
            "keyword":json.keyword
        },function(err,json){
            poolMain.release(database);
            if(err){return callback(err)};
            callback(err,result);
        });
    });
}
function _login(jsonReq,callback){
    var username=jsonReq.username,
        pass=jsonReq.pass;
    poolMain.acquire(function(err,database){
        db.Users.compareNameAndPass({
            database:database,
            username:username,
            pass:pass
        },function(err,result){
            poolMain.release(database);
            if(err){return callback(err)};
            callback(err,result);
        });
    });
}
function _insertUserName(jsonReq,callback){
    poolMain.acquire(function(err,database){
        if(err){return callback(err);}
        db.Users.insertUserName({
            database:database,
            username:jsonReq.username,
            pass:jsonReq.pass
        },function(err,jsonRes){
            poolMain.release(database);
            if(err){return callback(err)};
            callback(err,jsonRes);
        });
    });
}

exports.searchUser=_searchUser;
exports.insertUserName=_insertUserName;
exports.login=_login;

