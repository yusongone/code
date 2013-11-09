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
    //����һ��ͼƬ��
    var _createImageLibs=function(json,callback){
        db.ImageLibs.createImageLibs(json,function(err,result){
            callback(err,result);
            database.close();
        }); 
    };
    //�ж�ͼƬ���Ƿ����ڵ�½�û�
    /*
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
    */



//Images function
    var _uploadImage=function(json,callback){
        json.strId=parse.base64ToStr(json.libId);
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
        //�жϴ� ͼƬ�� �Ƿ����ڵ�ǰ��¼��
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
                callback("sorry,�������²����ڴ�ͼƬ��IDff");
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
                database:database
             },function(err,data){
                database.close();
                callback(err,data);
            });
        });
    });
    };
    var _getImagesByCusInfoId=function(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        if(err){return callback(err);}
        //var strId=parse.base64ToStr(id);
        var cusInfoId=jsonReq.cusInfoId;
        var userId=jsonReq.userId;
        db.Customer.getImageLibsId({
            cusInfoId:cusInfoId,
            userId:userId
        },function(err,jsonRes){
            if(jsonRes){
                db.ImageLibs.getDatasByLibId({
                    database:database,
                    imagesLibId:jsonRes
                },function(err,item){
                    database.close();
                    if(item&&item.images){
                        callback(err,item.images);
                    }else{
                        callback("sorry");
                    }
                });
            }
        });
    });
    };
// user �û� ѡƬ ͼƬ�б�
// ͨ��bindUser ���� CusInfoId ,ͨ�� CusInfoId ����Images��Ϣ

//CusInfoId �� Images id
//������֤ userId��CusInfoId��ϵ/bindUser ���� userId��������ڣ�ͨ��ImagesId ȡͼƬ���أ�


//ͨ��userId��cusInfoId���� ͼƬ���������ݣ�
function _findLibsByUserIdAndCusInfoId(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        db.ImageLibs.findLibsByUserIdAndCusInfoId(jsonReq,function(err,item){
            database.close();
            callback(err,item);
        });
    });

}

exports.getImageLibs=_getImageLibs;
exports.createImageLibs=_createImageLibs;
exports.uploadImage=_uploadImage;
exports.getImage=_getImage;
exports.getImagesByCusInfoId=_getImagesByCusInfoId;
//exports.checkLibsBelong=_checkLibsBelong;


exports.findLibsByUserIdAndCusInfoId=_findLibsByUserIdAndCusInfoId;
