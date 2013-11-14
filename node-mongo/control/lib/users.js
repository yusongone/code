var db=require("../../db");
var parse=require("./common").parse;


function _searchUser(json,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
        db.Users.searchUser({
            database:database,
            "keyword":json.keyword
        },function(json){
            database.close();
            callback(json);
        });
    });
}
function _login(jsonReq,callback){
    var username=jsonReq.username,
        pass=jsonReq.pass;
    db.Common.getAuthenticationDatabase(function(err,database){
        db.Users.compareNameAndPass({
            database:database,
            username:username,
            pass:pass
        },function(err,result){
            database.close();
           callback(err,result);  
        });
    });
}
function _insertUserName(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
        db.Users.insertUserName({
            database:database,
            username:jsonReq.username,
            pass:jsonReq.pass
        },function(err,jsonRes){
            if(err){return callback(err)};
            callback(err,jsonRes);
            database.close();
        });
    });
}

exports.searchUser=_searchUser;
exports.insertUserName=_insertUserName;
exports.login=_login;

