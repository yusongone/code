var db=require("../../db");
var parse=require("./common").parse;


function _searchUser(json,callback){
    db.Users.searchUser({
        "keyword":json.keyword
    },function(json){
        callback(json);
    });
}

exports.searchUser=_searchUser;

