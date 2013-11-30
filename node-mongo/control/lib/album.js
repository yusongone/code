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

exports.createAlbum=createAlbum;
exports.getAlbumList=getAlbumList;
exports.removeAlbum=removeAlbum;
exports.changeAlbum=changeAlbum;
