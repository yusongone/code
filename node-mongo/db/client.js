var mongodb=require("mongodb"),
    format=require("util").format,
    crypto=require("crypto");
    mongoClient=mongodb.MongoClient,
    objectId=mongodb.ObjectID,
    Db=mongodb.Db,
    Server=mongodb.Server,
    gridStore=mongodb.GridStore;
var db_conf=require("../config.json").db;
var fs=require("fs");

function insertData(){
    var db_path=format("mongodb://%s/%s",db_conf.ip,"test");
    mongoClient.connect(db_path,function(err,db){
        var col=db.collection("one");
        col.find().toArray(function(err,result){
            console.log(result);
        });
    });
}


//user collection;
var users={
    insertUserName:function(json,callback){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("users");
                col.find({"name":json.userName},{"name":1}).toArray(function(err,item){
                    console.dir(err);
                    if(err){return callback({"status":"sorry","message":err})}
                    var count=item.length;
                    if(count>0){
                        callback({"status":"sorry","message":"用户名已经存在!"});
                        database.close();
                    }else{
                        var md5=crypto.createHash("md5");
                        var md5Pass=md5.update(json.pass).digest("base64");
                        col.insert({"name":json.userName,"pass":md5Pass},function(err,res){
                            console.dir(err);
                            if(err){return callback({"status":"sorry","message":err});}
                            callback({"status":"ok"});
                            database.close();
                        });
                    }
                });
            });
        });
    },
    compareNameAndPass:function(json,callback){
        var db = new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("users");
                var md5=crypto.createHash("md5");
                var md5Pass=md5.update(json.pass).digest("base64");
                col.find({"name":json.userName,"pass":md5Pass}).toArray(function(err,item){
                    if(item.length>0){
                        callback({"status":"ok"});
                        database.close();
                    }else{
                        callback({"status":"sorry","message":"用户名或密码不正确！"});
                        database.close();
                    }
                })
            });
        });
    }
}

/*
    var z=(new objectId(item[0]._id.toString()));
    col.find({"_id":z},{}).toArray(function(err,i){
        console.log("ff");
        console.log("ii",i);
    });
    */

//images libs
var imageLibs={
    //通过用户名 查找名下所有图片库
    getImageLibs:function(username,callback){
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
    },
    //创建一个图片文件夹（库）
    createImageLibs:function(json,callback){
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
    },
    //通过图片库Id查找此 库下所有信息
    getDatasByLibId:function(id,callback){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("image_libs");
                col.findOne({"_id":new objectId(id)},{},function(err,item){
                    callback(item);
                });

            });
        });

    },
    //读取图片
    getImage:function(fileId,callback){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var gs=new gridStore(database,new objectId(fileId),"r");
                    gs.open(function(err,gs){
                        gs.read(function(err,doc){
                            callback(doc);
                        });
                    });
            });
        });
    },
    uploadImageBuffer:function(){
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
                        //将图片 id 存入到 相应图片库下；
                        var col=database.collection("image_libs");
                        //db.one.update({"name":"e"},{$addToSet:{images:{$each:[{"name":"c"}]}}});
                            col.update({"_id":new objectId(json.strId),"username":json.username},{$addToSet:{images:{$each:[{"fileId":fff}]}}},{w:1},function(err){
                                database.close();
                            });
                        })
                    });
                    
            });
        });
    },
    //上传图片，并且把图片ID存放到相应 图片库文件夹下
    uploadImageFile:function(json,callback){
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
                        var fff=doc.fileId;
                        gs.close();
                        //将图片 id 存入到 相应图片库下；
                        var col=database.collection("image_libs");
                        //db.one.update({"name":"e"},{$addToSet:{images:{$each:[{"name":"c"}]}}});
                            col.update({"_id":new objectId(json.strId),"username":json.username},{$addToSet:{images:{$each:[{"fileId":fff}]}}},{w:1},function(err){
                                callback({"status":"ok"});
                                database.close();
                            });
                    });
                });
            });
        });
    }
}
exports.users=users;
exports.ImageLibs=imageLibs;


exports.test=function(buf){
}

