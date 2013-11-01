var db=require("../../db");
var parse=require("./common").parse;

var d=null;
    var _getImageLibs=function(username,callback){
        db.ImageLibs.getImageLibs(username,function(json){
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
            callback({"status":"ok","data":tempAry});
        }); 
    };
    //����һ��ͼƬ��
    var _createImageLibs=function(json,callback){
        db.ImageLibs.createImageLibs(json,callback); 
    };
    //�ж�ͼƬ���Ƿ����ڵ�½�û�
    var _checkLibsBelong=function(json,callback){
        var libId=parse.base64ToStr(json.libId);
        var username=json.username;
        db.ImageLibs.getDatasByLibId(libId,function(item){
            if(username==item.username){
                callback(true);
            }else{
                callback(false);
            }
        });
    }



//Images function
    var _uploadImage=function(json,callback){
        json.strId=parse.base64ToStr(json.libId);
        //�жϴ� ͼƬ�� �Ƿ����ڵ�ǰ��¼��
        db.ImageLibs.getDatasByLibId(json.strId,function(item){
            if(json.username==item.username){
                db.ImageLibs.uploadImageFile(json,function(data){
                    callback(data);
                });
            }else{
                callback("sorry,�������²����ڴ�ͼƬ��IDff");
            }
        });
    };
    var _getImage=function(json,callback){
       // var strId=parse.base64ToStr(json.fileId);
        db.ImageLibs.checkBelong({
            "libId":parse.base64ToStr(json.libId),
            "imageId":json.imageId,
            "username":json.username
        },function(err,data){
            if(!(data.length>0)){
                return callback("no image");
            }
            db.ImageLibs.getImage(json.imageId,function(data){
                callback(data);
            });
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
exports.checkLibsBelong=_checkLibsBelong;
