var db=require("../../db");
var parse=require("./common").parse;
var getPool=db.Common.getPool;
var poolMain=getPool("main");

//


//====================================
    var _getImageLibs=function(username,callback){
    poolMain.acquire(function(err,database){
        if(err){return callback(err);}
        db.ImageLibs.getImageLibs({
            database:database,     
            username:username
        },function(err,json){
            poolMain.release(database);
            if(err){return callback(err);}
            var da=json.data;
            var tempAry=[];
            for(var i=0,l=da.length;i<l;i++){
                var z={
                    "name":da[i].name,
                    "id":parse.strToBase64(da[i]._id.toString())
                }
                tempAry.push(z);
            }
            callback(err,tempAry);
        }); 
    });
    };
//����һ��ͼƬ��
var _createImageLibs=function(json,callback){
    db.ImageLibs.createImageLibs(json,function(err,result){
        poolMain.release(database);
        callback(err,result);
    }); 
};

//�ϴ�ͼƬ������Id��ImagesLib;
var _uploadImageToImagesLib=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        if(err){return callback(err);}
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            console.log(result);
            if("creator"!=result){
                poolMain.release(database);
                callback(err,{"status":"sorry","message":"no permission"});
            }else{
                db.Images.uploadImage(jsonReq,function(err,fileId){
                    if(err){
                        poolMain.release(database);
                        return callback(err);
                    }
                    jsonReq.fileId=fileId;
                    //����ӵ�ͼƬId��ӵ�imagesLib�У�
                    db.ImageLibs.addImageIdToLibs(jsonReq,function(err,result){
                        poolMain.release(database);
                        if(err){
                            return callback(err);
                        }
                        callback(err,result);
                    });
                });       
            }
        });
    });
};

    var _getImagesByCusInfoId=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
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
                    poolMain.release(database);
                    if(err){
                        return callback(err);
                    }
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
function _getSelectPhotos(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,relation){
            if("binder"==relation){
                db.ImageLibs.getImagesListByCusInfoId(jsonReq,function(err,result){
                    poolMain.release(database);
                    if(err){
                        return callback(err);
                    }
                    if(result){
                        callback(err,{"status":"ok","data":result});    
                    }else{
                        callback(err,{"status":"sorry"});
                    }
                });
            }
        });
    })

};


//ͨ��userId��cusInfoId���� ͼƬ���������ݣ�
function _getCustomerImages(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,relation){
            if("creator"==relation){
                db.ImageLibs.getImagesListByCusInfoId(jsonReq,function(err,result){
                    poolMain.release(database);
                    if(err){
                        return callback(err);
                    }
                    if(result){
                        callback(err,{"status":"ok","data":result});    
                    }else{
                        callback(err,{"status":"sorry"});
                    }
                });         
            }else{
                callback(err,{"status":"sorry"});
            }
             
        });
    });
}

exports.getImageLibs=_getImageLibs;
exports.createImageLibs=_createImageLibs;
exports.uploadImageToImagesLib=_uploadImageToImagesLib;
exports.getImagesByCusInfoId=_getImagesByCusInfoId;
//exports.checkLibsBelong=_checkLibsBelong;


exports.getSelectPhotos=_getSelectPhotos;
exports.getCustomerImages=_getCustomerImages;
