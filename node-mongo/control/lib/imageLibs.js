var db=require("../../db");
var Images=require("./images");
var parse=require("./common").parse;
var getPool=db.Common.getPool;
var poolMain=getPool("main");
var Thumbnail=require("./thumbnail");

//

var _deletePhoto=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            if("creator"==result){
                db.ImageLibs.checkImageInCustomer(jsonReq,function(err,result){
                    if(err){ poolMain.release(database); return callback(err); }
                    if(null!=result){
                        Images.deleteOriginImage(jsonReq,function(err,result){
                            if(err){ poolMain.release(database); return callback(err); }
                            db.ImageLibs.removeImageFromImagelibs(jsonReq,function(err,result){
                                if(err){ poolMain.release(database); return callback(err); }
                                    callback(err,result); 
                                    Thumbnail.removeThumbnailByOriginId(jsonReq);
                            });
                        }); 
                    }else{
                        poolMain.release(database);
                        callback("no image");    
                    }
                });
            }else{
                callback("no permission");
            }

        });
    });

}


//�ϴ�ͼƬ������Id��ImagesLib;
var _uploadImageToImagesLib=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        if(err){return callback(err);}
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if("creator"!=result){
                poolMain.release(database);
                callback(err,{"status":"sorry","message":"no permission"});
            }else{
                jsonReq.attr={
                    "metadata":{ property:"private" }
                }
                Images.uploadOriginImage(jsonReq,function(err,fileId){
                    if(err){
                        poolMain.release(database);
                        return callback(err);
                    }
                    jsonReq.fileId=fileId;
                    jsonReq.database=database;
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

//ͨ��userId��cusInfoId���� ͼƬ���������ݣ�
function _getCustomerImages(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,relation){
            if("creator"==relation||"binder"==relation){
                db.ImageLibs.getCustomerImages(jsonReq,function(err,result){
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

exports.uploadImageToImagesLib=_uploadImageToImagesLib;

exports.getCustomerImages=_getCustomerImages;
exports.deletePhoto=_deletePhoto;
