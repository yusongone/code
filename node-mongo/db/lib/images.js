var mongodb=require("mongodb"),
    crypto=require("crypto");
    objectId=mongodb.ObjectID,
    Db=mongodb.Db,
    Server=mongodb.Server,
    gridStore=mongodb.GridStore;
var db_conf=require("../../config.json").db;
var createDb=require("./common").createDb;

function _createObjectId(str){
        try{
            str=str.toString();
            return  new objectId(str);
        }catch(err){
            console.log(err);
            return false;
        }
};


//images libs
var _getImageInfo=function(jsonReq,callback){
    var database=jsonReq.database;
    var col=database.collection("fs.files");
        var queryObj=jsonReq.queryObj;
        col.findOne(queryObj,function(err,result){
            callback(err,result);
        });;

}
//通过Id读取图片
var _getImage=function(jsonReq,callback){
    var database=jsonReq.database;
    var fileId=jsonReq.fileId;
    var id= _createObjectId(fileId);
    if(!id){return callback("err")};
    var gs=new gridStore(database,id,"r");
        gs.open(function(err,gss){
            if(err){gs.close();return callback(err);};
            gs.read(function(err,doc){
                gs.close();
                callback(err,doc);
            });
        });
};

var _uploadBuffer=function(jsonReq,callback){
    var database=jsonReq.database;
    var oid=new objectId();
    var buf=jsonReq.buf;
    var attr=jsonReq.attr;
    var gs=new gridStore(database,oid,"w",attr);
    gs.open(function(err,gss){
        gs.write(buf.toString("binary"),function(err,doc){
            if(err){return callback(err);}
            var fileId=doc.fileId;
            gs.close(function(err,result){
                callback(err,fileId);
            });
        });
    });
};
//上传图片，并且把图片ID存放到相应 图片库文件夹下
function uploadImage(jsonReq,callback){
    var database=jsonReq.database;
    var file=jsonReq.files[0];
    var gs=new gridStore(database,new objectId(),"w",{
        content_type:"image/png"
    });
    gs.open(function(err,gs){
        gs.writeFile(file.path,function(err,doc){
            if(err){return callback(err);}
            var fileId=doc.fileId; 
            gs.close(function(err,result){
                callback(err,fileId);
            });
            //将图片 id 存入到 相应图片库下；
        });
    });
}

exports.uploadImage=uploadImage;
exports.uploadBuffer=_uploadBuffer;
exports.getImage=_getImage;
exports.getImageInfo=_getImageInfo;
