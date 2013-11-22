var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;

function _createObjectId(str){
        try{
            return  new objectId(str);
        }catch(err){
            console.log(err);
            return false;
        }
};


//images libs
    //ͨ���û��� ������������ͼƬ��
    var _getImageLibs=function(jsonReq,callback){
        var database=jsonReq.databse;
        var username=jsonReq.username;

        var col=database.collection("image_libs");
        col.find({"username":username},{}).toArray(function(err,item){
            callback(err,item);
            database.close();
        });
    };
    //����һ��ͼƬ�ļ��У��⣩
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

    var checkImageInCustomer=function(jsonReq,callback){
        var database=jsonReq.database;    
        var fileId=jsonReq.fileId;
        var cusInfoId=jsonReq.cusInfoId;
            cusInfoId=_createObjectId(cusInfoId);
            fileId=_createObjectId(fileId);
            if(!(fileId&&cusInfoId)){return callback("err")};
        var col=database.collection("image_libs");
            col.findOne({"cusInfoId":cusInfoId,"images":{$elemMatch:{"fileId":fileId}}},function(err,doc){
               if(err){return callback(err)} 
               callback(err,doc);
            });
    }    

    var _addImageIdToLibs=function(jsonReq,callback){
        var database=jsonReq.database;
        var userId=jsonReq.userId;
        var cusInfoId=jsonReq.cusInfoId;
        var fileId=jsonReq.fileId;
            cusInfoId= _createObjectId(cusInfoId);
            userId= _createObjectId(userId);
            if(!(userId&&cusInfoId)){return callback("err")};
        var filename=jsonReq.files[0].name;
        var col=database.collection("image_libs");
        console.log(filename);
            col.update({"userId":userId,"cusInfoId":cusInfoId},{$addToSet:{images:{$each:[{"fileId":fileId,"filename":filename}]}}},{w:1},function(err){
                    callback(err,{"status":"ok"});
                });
    };

    //ͨ��ͼƬ��Id���Ҵ� ����������Ϣ
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

//ͨ�� cusInfoId ��ȡ ͼƬ�б�
function getImagesListByCusInfoId(jsonReq,callback){
    var database=jsonReq.database;
    var userId=jsonReq.userId;
    var cusInfoId=jsonReq.cusInfoId;
    var cid= _createObjectId(cusInfoId);
    if(!cid){return callback("err")};
    var col=database.collection("image_libs");
    console.log(cid);
        col.findOne({"cusInfoId":cid},function(err,doc){
            if(doc){
              callback(err,doc.images);    
            }else{
              callback(err,null);    
            };
        });
}

function removeImageFromImagelibs(jsonReq,callback){
   var database=jsonReq.database; 
    var userId=jsonReq.userId;
    var cusInfoId=jsonReq.cusInfoId;
    var fileId=jsonReq.fileId;
    var cid= _createObjectId(cusInfoId);
    var fid= _createObjectId(fileId);
    if(!(cid&&fid)){return callback("err")};
    var col=database.collection("image_libs");
        //col.remove({"cusInfoId":cid,"images":{$elemMatch:{"fileId":fid}}},function(err,result){
        col.update({"cusInfoId":cid},{$pull:{images:{"fileId":fid}}},function(err,result){
            if(err){return callback(err)} 
            console.log(result);
            callback(err,result);
        });
}



exports.getImageLibs=_getImageLibs;
exports.createImageLibs=_createImageLibs;
exports.getDatasByLibId=_getDatasByLibId;
exports.addImageIdToLibs=_addImageIdToLibs;

exports.getImagesListByCusInfoId=getImagesListByCusInfoId;
exports.checkImageInCustomer=checkImageInCustomer;
exports.removeImageFromImagelibs=removeImageFromImagelibs;
