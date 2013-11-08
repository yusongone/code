var db=require("../../db");
var parse=require("./common").parse;

var d=null;
    var _getImageLibs=function(username,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
        db.ImageLibs.getImageLibs({
            database:database,     
            username:username
        },function(err,json){
            var da=json.data;
            var tempAry=[];
            d=da[0]._id.toString();
            for(var i=0,l=da.length;i<l;i++){
                var z={
                    "name":da[i].name,
                    "id":parse.strToBase64(da[i]._id.toString())
                }
                tempAry.push(z);
            }
            callback(err,tempAry);
            database.close();
        }); 
    });
    };
    //创建一个图片库
    var _createImageLibs=function(json,callback){
        db.ImageLibs.createImageLibs(json,function(err,result){
            callback(err,result);
            database.close();
        }); 
    };
    //判断图片库是否属于登陆用户
    var _checkLibsBelong=function(json,callback){
        var libId=parse.base64ToStr(json.libId);
        var username=json.username;
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
        db.ImageLibs.getDatasByLibId({
            database:database,
            "libId":libId
            },function(err,item){
            if(username==item.username){
                callback(err,true);
            }else{
                callback(err,false);
            }
        });
    });
    }



//Images function
    var _uploadImage=function(json,callback){
        json.strId=parse.base64ToStr(json.libId);
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
        //判断此 图片库 是否属于当前登录人
        db.ImageLibs.getDatasByLibId({
            database:database,
            strId:json.strId,
        },function(err,item){
            database.close();
            if(json.username==item.username){
                json.database=database;
                db.ImageLibs.uploadImageFile(json,function(data){
                    callback(err,data);
                });
            }else{
                callback("sorry,您的名下不存在此图片库IDff");
            }
        });
    });
    };
    var _getImage=function(json,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
       // var strId=parse.base64ToStr(json.fileId);
        db.ImageLibs.checkBelong({
            "database":database,
            "libId":parse.base64ToStr(json.libId),
            "imageId":json.imageId,
            "username":json.username
        },function(err,data){
            if(!(data.length>0)){
                return callback("no image");
            }
            db.ImageLibs.getImage({
                json.imageId,
                database:database
             },function(err,data){
                database.close();
                callback(err,data);
            });
        });
    };
    var _getImagesByLibId=function(id,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
        var strId=parse.base64ToStr(id);
        db.ImageLibs.getDatasByLibId({
            database:database,
            strId:strId
        },function(err,item){
            database.close();
            if(item&&item.images){
                callback(err,item.images);
            }else{
                callback("sorry");
            }
        });
    });
    };

exports.getImageLibs=_getImageLibs;
exports.createImageLibs=_createImageLibs;
exports.uploadImage=_uploadImage;
exports.getImage=_getImage;
exports.getImagesByLibId=_getImagesByLibId;
exports.checkLibsBelong=_checkLibsBelong;
