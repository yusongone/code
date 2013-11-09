var mongodb=require("mongodb"),
    crypto=require("crypto");
    objectId=mongodb.ObjectID,
    Db=mongodb.Db,
    gridStore=mongodb.GridStore;
var db_conf=require("../../config.json").db;
var createDb=require("./common").createDb;

function _createObjectId(str){
        try{
            return  new objectId(str);
        }catch(err){
            console.log(err);
            return false;
        }
};


//images libs
    //通过用户名 查找名下所有图片库
    var _getImageLibs=function(jsonReq,callback){
        var database=jsonReq.databse;
        var username=jsonReq.username;

        var col=database.collection("image_libs");
        col.find({"username":username},{}).toArray(function(err,item){
            callback(err,item);
            database.close();
        });
    };
    //创建一个图片文件夹（库）
    var _createImageLibs=function(jsonReq,callback){
        var database=jsonReq.database;
        var userId=jsonReq.userId;
        var cusInfoId=jsonReq.cusInfoId;
        var _id=jsonReq.imageLibId;
        var col=database.collection("image_libs");
        var uid= _createObjectId(userId);
        if(!uid){return callback("image_libs line 52 id err")};
        col.insert({"_id":_id,"userId":uid,"cusInfoId":cusInfoId},function(err,result){
            if(err){return callback({"status":"sorry","message":"db error"});}
            callback(err,{"status":"ok","_id":_id});
        });
    };
    
    var _addImageIdToLibs=function(jsonReq,callback){
        var database=jsonReq.database;
        var userId=jsonReq.userId;
        var cusInfoId=jsonReq.cusInfoId;
        var fileId=jsonReq.fileId;
            cusInfoId= _createObjectId(cusInfoId);
            userId= _createObjectId(userId);
            if(!(userId&&cusInfoId)){return callback("err")};
        var col=database.collection("image_libs");
            col.update({"userId":userId,"cusInfoId":cusInfoId},{$addToSet:{images:{$each:[{"fileId":fileId}]}}},{w:1},function(err){
                    callback(err,{"status":"ok"});
                });
    };

    //通过图片库Id查找此 库下所有信息
    var _getDatasByLibId=function(jsonReq,callback){
        var database=jsonReq.database;
        var imagesLibId=jsonReq.imagesLibId;

        var col=database.collection("image_libs");
        var oid= _createObjectId(imagesLibId);
        if(!oid){ return callback("image_libs line 52 id err")};
        col.findOne({"_id":oid},{},function(err,item){
            callback(err,item);
        });
    };

//通过 cusInfoId 获取 图片列表；
function getImagesListByCusInfoId(jsonReq,callback){
    var database=jsonReq.database;
    var userId=jsonReq.userId;
    var cusInfoId=jsonReq.cusInfoId;
    var cid= _createObjectId(cusInfoId);
    if(!cid){return callback("err")};
    var col=database.collection("image_libs");
        col.findOne({"cusInfoId":cid},function(err,doc){
            if(doc){
              callback(err,doc.images);    
            }else{
              callback(err,null);    
            };
        });
}



exports.getImageLibs=_getImageLibs;
exports.createImageLibs=_createImageLibs;
exports.getDatasByLibId=_getDatasByLibId;
exports.addImageIdToLibs=_addImageIdToLibs;

exports.getImagesListByCusInfoId=getImagesListByCusInfoId;
