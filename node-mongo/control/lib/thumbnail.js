var db=require("../../db");
var parse=require("./common").parse;

function _createObjectId(str){
        try{
            str=str.toString();
            return  new objectId(str);
        }catch(err){
            console.error("createObjectId:",err);
            return false;
        }
};

var addThumbnailImage=function(jsonReq,callback){
    var database=jsonReq.database;
    var col=database.collection("thumbnailList");
    var originalImageId=jsonReq.originalImageId;
        originalImageId=_createObject(originalImageId);
    var size=jsonReq.size;
        //col.insert({"originalImageId":originalImageId,"size":size,"thumbnailFileId":fileId});
        col.update({"originalImageId":originalImageId,"size":size},{$addToSet:{thumbnailFileId:fileId}},{w:1},function(err){
        });
}

var getThumbnailImage=function(jsonReq,callback){
    var database=jsonReq.database;
    var col=database.collection("thumbnailList");
    var originalImageId=jsonReq.originalImageId;
        originalImageId=_createObject(originalImageId);
    var size=jsonReq.size;
        col.findOne({"originalImageId":originalImageId,"size":size},function(err,doc){
            
        });
}

exports.addThumbnailImage=addThumbnailImage;
exports.getThumbnailImage=getThumbnailImage;
