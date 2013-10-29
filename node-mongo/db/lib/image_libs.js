var mongodb=require("mongodb"),
    crypto=require("crypto");
    objectId=mongodb.ObjectID,
    Db=mongodb.Db,
    Server=mongodb.Server,
    gridStore=mongodb.GridStore;
var db_conf=require("../../config.json").db;

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
    var _getImageLibs=function(username,callback){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("image_libs");
                col.find({"username":username},{}).toArray(function(err,item){
                        callback({"status":"ok","data":item});
                        database.close();
                })
            });
        });
    };
    //创建一个图片文件夹（库）
    var _createImageLibs=function(json,callback){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("image_libs");
                col.insert({"name":json.libname,"username":json.username},function(err,result){
                    if(err){return callback({"status":"sorry","message":"db error"});}
                    callback({"status":"ok"});
                    database.close();
                });
            });
        });
    };
    //通过图片库Id查找此 库下所有信息
    var _getDatasByLibId=function(id,callback){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("image_libs");
                var oid= _createObjectId(id);
                if(!oid){return callback("image_libs line 52 id err")};
                col.findOne({"_id":oid},{},function(err,item){
                    callback(item);
                });

            });
        });

    };
    //读取图片
    var _getImage=function(fileId,callback){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var id= _createObjectId(fileId);
                if(!id){return callback("err")};
                var gs=new gridStore(database,id,"r");
                    gs.open(function(err,gs){
                        gs.read(function(err,doc){
                            callback(doc);
                        });
                    });
            });
        });
    };
    var _uploadImageBuffer=function(){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
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
                            var userId= _createObjectId(json.strId);
                            if(!UserId){return callback("err")};
                        //将图片 id 存入到 相应图片库下；
                        var col=database.collection("image_libs");
                        //db.one.update({"name":"e"},{$addToSet:{images:{$each:[{"name":"c"}]}}});
                            col.update({"_id":userId,"username":json.username},{$addToSet:{images:{$each:[{"fileId":fff}]}}},{w:1},function(err){
                                database.close();
                            });
                        })
                    });
                    
            });
        });
    };
    //上传图片，并且把图片ID存放到相应 图片库文件夹下
    var _uploadImageFile=function(json,callback){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                // fileId=new objectId();
                var gs=new gridStore(database,new objectId(),"w",{
                    content_type:"image/png",
                    metadata:{
                        "author":"me!"
                    }
                });
                gs.open(function(err,gs){
                    //写入图片
                    gs.writeFile(json.file.path,function(err,doc){
                        var fileId=doc.fileId;
                        var userId= _createObjectId(json.strId);
                        if(!userId){return callback("err")};
                        gs.close();
                        //将图片 id 存入到 相应图片库下；
                        var col=database.collection("image_libs");
                        //db.one.update({"name":"e"},{$addToSet:{images:{$each:[{"name":"c"}]}}});
                            col.update({"_id":userId,"username":json.username},{$addToSet:{images:{$each:[{"fileId":fileId}]}}},{w:1},function(err){
                                callback({"status":"ok"});
                                database.close();
                            });
                    });
                });
            });
        });
    };


exports.getImageLibs=_getImageLibs;
exports.createImageLibs=_createImageLibs;
exports.getDatasByLibId=_getDatasByLibId;
exports.getImage=_getImage;
exports.uploadImageBuffer=_uploadImageBuffer;
exports.uploadImageFile=_uploadImageFile;


