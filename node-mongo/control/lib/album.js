var db=require("../../db");
var parse=require("./common").parse;
var getPool=db.Common.getPool;
var poolMain=getPool("main");

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
        db.Album.getAlbumList(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            poolMain.release(database);
            callback(err,result);
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
                
            }
        });
        return;
    });
}

var getPhotosFromAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.getPhotosFromAlbum(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            poolMain.release(database);
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
