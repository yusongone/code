var db=require("../db/client");

var imageLibs={
    "getImageLibs":function(username,callback){
        db.ImageLibs.getImageLibs(username,callback); 
    },
    createImageLibs:function(json,callback){
        db.ImageLibs.createImageLibs(json,callback); 
    }
}
exports.ImageLibs=imageLibs;
