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
function _insertUserName(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
        db.Users.insertUserName({
            database:database,
            userName:jsonReq.username,
            pass:jsonReq.pass
        },function(jsonRes){
            callback(null,jsonRes);
            database.close();
        });
    });
}

exports.searchUser=_searchUser;
exports.insertUserName=_insertUserName;

