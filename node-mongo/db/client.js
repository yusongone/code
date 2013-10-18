var mongodb=require("mongodb"),
    format=require("util").format,
    crypto=require("crypto");
    mongoClient=mongodb.MongoClient,
    objectId=mongodb.ObjectID,
    gridStore=mongodb.GridStore;
var db_ip=require("../config.json").db.ip;

function insertData(){
    var db_path=format("mongodb://%s/%s",db_ip,"test");
    mongoClient.connect(db_path,function(err,db){
        var col=db.collection("one");
        col.find().toArray(function(err,result){
            console.log(result);
        });
    });
}
var fileId; 
function putImage(file){
    var db_path=format("mongodb://%s/%s",db_ip,"test");
    mongoClient.connect(db_path,function(err,db){
           // fileId=new objectId();
        var gs=new gridStore(db,"fefe.aaa","w",{
            content_type:"image/png",
            metadata:{
                "author":"me!"
            }
        });

        gs.open(function(err,gs){
            gs.writeFile(file.path,function(err,doc){
                var fff=doc.fileId;
                var col=db.collection("one");
                    col.insert({"fileId":fff,"name":"cd"},function(err,result){
                        console.log(result);
                    });

            });
        });
    });
}

function get(callback){
    var fff;
    var db_path=format("mongodb://%s/%s",db_ip,"test");
    mongoClient.connect(db_path,function(err,db){
        var col=db.collection("one");
            col.findOne({"name":"cd"},function(err,result){
                fff=result.fileId;
                console.log(fff);
        var gs=new gridStore(db,fff,"r");
        gs.open(function(err,gs){
            gs.read(function(err,doc){
             callback(doc);
            });
        });
        });
        
            /*
        */

    });
}



exports.putImage=putImage;
exports.get=get;

//user collection;
var users={
    insertUserName:function(json,callback){
        var db_path=format("mongodb://%s/%s",db_ip,"picOnline");
        mongoClient.connect(db_path,function(err,db){
            var col=db.collection("users");
                col.find({"name":json.userName},{"name":1}).toArray(function(err,item){
                    var count=item.length;
                    if(count>0){
                        callback({"status":"sorry","message":"用户名已经存在!"});
                        db.close();
                    }else{
                        var md5=crypto.createHash("md5");
                        var md5Pass=md5.update(json.pass).digest("base64");
                        col.insert({"name":json.userName,"pass":md5Pass},function(err,res){
                            if(err){return callback({"status":"sorry","message":"db error"});}
                            callback({"status":"ok"});
                            db.close();
                        });
                    }
                });
        });
    },
    compareNameAndPass:function(json,callback){
        var db_path=format("mongodb://%s/%s",db_ip,"picOnline");
        mongoClient.connect(db_path,function(err,db){
            var col=db.collection("users");
            var md5=crypto.createHash("md5");
            var md5Pass=md5.update(json.pass).digest("base64");
            col.find({"name":json.userName,"pass":md5Pass}).toArray(function(err,item){
                console.log(item);
                if(item.length>0){
                    callback({"status":"ok"});
                    db.close();
                }else{
                    callback({"status":"sorry","message":"用户名或密码不正确！"});
                    db.close();
                }
            })
        });
    }
}


//images libs
var imageLibs={
    getImageLibs:function(json,callback){
        var db_path=format("mongodb://%s/%s",db_ip,"picOnline");
        mongoClient.connect(db_path,function(err,db){
            var col=db.collection("image_libs");
            col.find({"name":json.userName},{"_id":0}).toArray(function(err,item){
                if(item.length>0){
                    callback({"status":"ok","data":item});
                    db.close();
                }else{
                    callback({"status":"sorry","message":"目前数据为空"});
                    db.close();
                }
            })
        });
        
    },
    createImageLibs:function(json,callback){
        var db_path=format("mongodb://%s/%s",db_ip,"picOnline");
        mongoClient.connect(db_path,function(err,db){
            var col=db.collection("image_libs");
                col.insert({"name":json.libname,"username":json.username},function(err,result){
                    if(err){return callback({"status":"sorry","message":"db error"});}
                    console.log("ok");
                    callback({"status":"ok"});
                    db.close();
                });
        });
        
    }
}
exports.users=users;
exports.ImageLibs=imageLibs;

