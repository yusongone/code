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
            return  new objectId(str);
        }catch(err){
            console.log(err);
            return false;
        }
};


//images libs

//读取图片
var _getImage=function(jsonReq,callback){
    var database=jsonReq.database;
    var fileId=jsonReq.fileId;
    var id= _createObjectId(fileId);
    if(!id){return callback("err")};

    var gs=new gridStore(database,id,"r");
        gs.open(function(err,gs){
            gs.read(function(err,doc){
                callback(err,doc);
                gs.close();
            });
        });
};

var _uploadImageBuffer=function(jsonReq,callback){
    var database=jsonReq.database;
    //var col=database.collection("image_libs");
    var gs=new gridStore(database,"t.png","w",{"content_type":"image/png","chunkSize":buf.length});
        gs.open(function(err,gs){
            /*
            gs.collection(function(err,coll){
                coll.find({"md5":"28a230b1646b40125b6fec83d19bdbfe"},{}).toArray(function(err,result){
                    database.close();
                });
            });
            */
            gs.write(buf.toString("binary"),function(err,doc){
                var fff=doc.fileId;
                gs.close();
                var userId= _createObjectId(jsonReq.strId);
                if(!UserId){ database.close(); return callback("err")};
            //将图片 id 存入到 相应图片库下；
            var col=database.collection("image_libs");
            //db.one.update({"name":"e"},{$addToSet:{images:{$each:[{"name":"c"}]}}});
                col.update({"_id":userId,"username":jsonReq.username},{$addToSet:{images:{$each:[{"fileId":fff}]}}},{w:1},function(err){
                    callback();
                });
            })
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
            gs.close();
            callback(err,fileId);
            //将图片 id 存入到 相应图片库下；
        });
    });
}

exports.uploadImage=uploadImage;
exports.getImage=_getImage;
