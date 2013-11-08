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
        var col=database.collection("image_libs");

        col.insert({"name":jsonReq.libname,"username":jsonReq.username},function(err,result){
            if(err){return callback({"status":"sorry","message":"db error"});}
            callback(err,{"status":"ok"});
        });
    };
    //通过图片库Id查找此 库下所有信息
    var _getDatasByLibId=function(jsonReq,callback){
        var database=jsonReq.database;
        var id=jsonReq.id;

        var col=database.collection("image_libs");
        var oid= _createObjectId(id);
        if(!oid){ database.close(); return callback("image_libs line 52 id err")};
        col.findOne({"_id":oid},{},function(err,item){
            callback(err,item);
        });
    };
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
    var _uploadImageFile=function(jsonReq,callback){
        var database=jsonReq.database;
            var files=jsonReq.files;
            var length=files.length;
            var count=0;
            for(var i=0;i<length;i++){
                var file=files[i];
                var strId=jsonReq.strId;
                wf(file,strId,function(){
                    count++;
                    if(count==length){
                        callback(null,{"status":"ok"});
                    }
                });
            }
            function wf(file,strId,fun){
                var gs=new gridStore(database,new objectId(),"w",{
                    content_type:"image/png"
                });
                gs.open(function(err,gs){
                    //写入图片
                    gs.writeFile(file.path,function(err,doc){
                        var fileId=doc.fileId;
                        var userId= _createObjectId(strId);
                        if(!userId){database.close();return callback("err")};
                        gs.close();
                        //将图片 id 存入到 相应图片库下；
                        var col=database.collection("image_libs");
                            col.update({"_id":userId,"username":jsonReq.username},{$addToSet:{images:{$each:[{"fileId":fileId}]}}},{w:1},function(err){
                                //database.close();
                                fun();
                                _addBelong({ fileId:fileId, userId:userId,database:database},function(){
                                
                                });
                            });
                    });
                });
            };
    };
//也许可以优化
function _addBelong(jsonReq,callback){
    var database=jsonReq.databse;
    var username=jsonReq.username;
    var fileId=jsonReq.fileId;
    var userId=jsonReq.userId;

    var col=database.collection("image_libs");
        col.update({"_id":userId,"username":username},{$addToSet:{belong:{$each:[{"username":"tt"}]}}},{w:1},function(err,doc){
            callback(err,{});
        });
}

function _checkBelong(jsonReq,callback){
    var libId=jsonReq.libId,
        imageId=jsonReq.imageId,
        username=jsonReq.username;
    var database=jsonReq.database;
        var col=database.collection("image_libs");
        var oid= _createObjectId(libId);
        if(!oid){return callback("image_libs line 164 id err")};
        var iid= _createObjectId(imageId);
        if(!oid){return callback("image_libs line 167 id err")};
        col.find({"_id":oid,$or:[{"username":username},{"belong":{$elemMatch:{"username":username}}}],"images":{$elemMatch:{"fileId":iid}}},{}).toArray(function(err,item){
            callback(err,item);
        });
};




exports.getImageLibs=_getImageLibs;
exports.createImageLibs=_createImageLibs;
exports.getDatasByLibId=_getDatasByLibId;
exports.getImage=_getImage;
exports.uploadImageBuffer=_uploadImageBuffer;
exports.uploadImageFile=_uploadImageFile;
exports.checkBelong=_checkBelong;

