var Common=require("./common");
var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;

    var _createObjectId=Common.createObjectId;
//
//--- album list
//
    //当前用户创建一个相册
    var createAlbum=function(jsonReq,callback){
        var database=jsonReq.database;
        var uid= _createObjectId(jsonReq.userId);
            if(!uid){return callback("err")};
        var col=database.collection("album");
            col.insert({"userId":uid},function(err,docAry){
                if(docAry){
                    callback(err,docAry[0]); 
                }else{
                    callback(err,null);
                }
            });
    };


    var getAlbumList=function(jsonReq,callback){
        var database=jsonReq.database; 
        var uid= _createObjectId(jsonReq.userId);
            if(!uid){return callback("err")};
        var col=database.collection("album");
            col.find({"userId":uid},{"userId":0}).toArray(function(err,docAry){
                callback(err,docAry);
            });
    }

    var removeAlbum=function(jsonReq,callback){
        var database=jsonReq.database; 
        var uid= _createObjectId(jsonReq.userId);
        var albumId= _createObjectId(jsonReq.albumId);
            if(!(uid&&albumId)){return callback("err")};
        var col=database.collection("album");
            col.remove({"_id":albumId,"userId":uid},function(err,result){
                console.log(result);
                callback(err,result);
            });
    }

    var changeAlbum=function(jsonReq,callback){
        var database=jsonReq.database; 
        var name=jsonReq.name;
        var uid= _createObjectId(jsonReq.userId);
        var albumId= _createObjectId(jsonReq.albumId);
            if(!(uid&&albumId)){return callback("err")};
        var col=database.collection("album");
        console.log(albumId,uid);
            col.update({"_id":albumId,"userId":uid},{"$set":{"name":name}},function(err,result){
                console.log(result);
                callback(err,result);
            });
    }
    
//
//--- album list
//

    var getPhotosFromAlbum=function(jsonReq,callback){
        var database=jsonReq.database; 
        var name=jsonReq.name;
        var uid= _createObjectId(jsonReq.userId);
        var albumId= _createObjectId(jsonReq.albumId);
            if(!(uid&&albumId)){return callback("err")};
        var col=database.collection("album");
        console.log(albumId,uid);
            col.update({"_id":albumId,"userId":uid},{"$set":{"name":name}},function(err,result){
                console.log(result);
                callback(err,result);
            });
         
    }


exports.createAlbum=createAlbum;
exports.getAlbumList=getAlbumList;
exports.removeAlbum=removeAlbum;
exports.changeAlbum=changeAlbum;


