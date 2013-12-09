var db=require("../../db");
var parse=require("./common").parse;
var getPool=db.Common.getPool;
var poolMain=getPool("main");
var Thumbnail=require("./thumbnail");

//

var createAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.createAlbum(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            poolMain.release(database);
            callback(err,result);
        });
    });

}

var getAlbumList=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.getAlbumList(jsonReq,function(err,resultAry){
            if(err){ poolMain.release(database); return callback(err) };
            var resAry=[];
            for(var i=0;i<resultAry.length;i++){
                var tempObj=resultAry[i];
                var resObj={};
                    resObj.count=tempObj.photos?tempObj.photos.length:0;
                    resObj.img=tempObj.photos&&tempObj.photos.length>0?tempObj.photos[0].id:"none";
                    resObj._id=tempObj._id;
                    resObj.name=tempObj.name;
                    resAry.push(resObj);
            } 
            poolMain.release(database);
            callback(err,resAry);
        });
    });
}

var removeAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.removeAlbum(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            poolMain.release(database);
            callback(err,result);
        });
    });
}

var changeAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.changeAlbum(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            poolMain.release(database);
            callback(err,result);
        });
    });
}

//
//------------- album list
//
var uploadPhotoToAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.checkAlbumAuth(jsonReq,function(err,result){
            if(result){
                db.Images.uploadImage(jsonReq,function(err,fileId){
                    if(err){
                        poolMain.release(database);
                        return callback(err);
                    }
                    jsonReq.fileId=fileId;
                    //把添加的图片Id添加到imagesLib中；
                    db.Album.addPhotoIdToAlbum(jsonReq,function(err,result){
                        poolMain.release(database);
                        if(err){
                            return callback(err);
                        }
                        callback(err,result);
                    });
                });       
                
            }else{
                poolMain.release(database);
                callback(err,result);
            }
        });
        return;
    });
}

var deletePhotoFromAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.checkAlbumAuth(jsonReq,function(err,result){
            if(result){
                db.Images.deleteImage(jsonReq,function(err,fileId){
                    if(err){return callback(err)}
                    db.Album.deletePhotoIdFromAlbum(jsonReq,function(err,result){
                        callback(err,result);
                        Thumbnail.removeThumbnailByOriginId(jsonReq);
                    });
                });
            }else{
                poolMain.release(database);
                callback(err,result);
            }
        });
    }); 
}

var getPhotosFromAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.getPhotosFromAlbum(jsonReq,function(err,result){
            poolMain.release(database);
            if(err){return callback(err) };
            callback(err,result);
        });
    });
}




exports.createAlbum=createAlbum;
exports.getAlbumList=getAlbumList;
exports.removeAlbum=removeAlbum;
exports.changeAlbum=changeAlbum;
exports.uploadPhotoToAlbum=uploadPhotoToAlbum;
exports.getPhotosFromAlbum=getPhotosFromAlbum;
exports.deletePhotoFromAlbum=deletePhotoFromAlbum;
