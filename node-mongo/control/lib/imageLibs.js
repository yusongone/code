var db=require("../../db");
var parse=require("./common").parse;

    var _getImageLibs=function(username,callback){
        db.ImageLibs.getImageLibs(username,function(json){
            var da=json.data;
            var tempAry=[];
            for(var i=0,l=da.length;i<l;i++){
                var z={
                    "name":da[i].name,
                    "id":parse.strToBase64(da[i]._id.toString())
                }
                tempAry.push(z);
            }
            callback({"status":"ok","data":tempAry});
        }); 
    };
    var _createImageLibs=function(json,callback){
        db.ImageLibs.createImageLibs(json,callback); 
    };
    var _uploadImage=function(json,callback){
        json.strId=parse.base64ToStr(json.libId);
        //判断此 图片库 是否属于当前登录人
        db.ImageLibs.getDatasByLibId(json.strId,function(item){
            console.dir(item);
            if(json.username==item.username){
                db.ImageLibs.uploadImageFile(json,function(data){
                    callback(data);
                });
            }else{
                callback("sorry,您的名下不存在此图片库ID");
            }
        });
    };
    var _getImage=function(id,callback){
       // var strId=parse.base64ToStr(json.fileId);
        db.ImageLibs.getImage(id,function(data){
            callback(data);
        });
    };
    var _getImagesByLibId=function(id,callback){
        var strId=parse.base64ToStr(id);
        db.ImageLibs.getDatasByLibId(strId,function(item){
            if(item&&item.images){
                callback(item.images);
            }else{
                callback({"status":"sorry"});
            }
        });
    };

exports.getImageLibs=_getImageLibs;
exports.createImageLibs=_createImageLibs;
exports.uploadImage=_uploadImage;
exports.getImage=_getImage;
exports.getImagesByLibId=_getImagesByLibId;
