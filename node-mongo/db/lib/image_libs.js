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
    //ͨ���û��� ������������ͼƬ��
    var _getImageLibs=function(username,callback){
        var db=createDb();
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
    //����һ��ͼƬ�ļ��У��⣩
    var _createImageLibs=function(json,callback){
        var db=createDb();
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
    //ͨ��ͼƬ��Id���Ҵ� ����������Ϣ
    var _getDatasByLibId=function(id,callback){
        var db=createDb();
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("image_libs");
                var oid= _createObjectId(id);
                if(!oid){ database.close(); return callback("image_libs line 52 id err")};
                col.findOne({"_id":oid},{},function(err,item){
                    callback(item);
                    database.close();
                });
            });
        });

    };
    //��ȡͼƬ
    var _getImage=function(fileId,callback){
        var db=createDb();
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var id= _createObjectId(fileId);
                if(!id){return callback("err")};
                var gs=new gridStore(database,id,"r");
                    gs.open(function(err,gs){
                        gs.read(function(err,doc){
                            callback(doc);
                            database.close();
                        });
                    });
            });
        });
    };
    var _uploadImageBuffer=function(){
        var db=createDb();
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
                            if(!UserId){ database.close(); return callback("err")};
                        //��ͼƬ id ���뵽 ��ӦͼƬ���£�
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
    //�ϴ�ͼƬ�����Ұ�ͼƬID��ŵ���Ӧ ͼƬ���ļ�����
    var _uploadImageFile=function(json,callback){
        var db=createDb();
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
            var files=json.files;
            var length=files.length;
            var count=0;
            for(var i=0;i<length;i++){
                var file=files[i];
                var strId=json.strId;
                wf(file,strId,function(){
                    count++;
                    if(count==length){
                        callback({"status":"ok"});
                         database.close();
                    }
                });
            }
            function wf(file,strId,fun){
                var gs=new gridStore(database,new objectId(),"w",{
                    content_type:"image/png"
                });
                gs.open(function(err,gs){
                    //д��ͼƬ
                    gs.writeFile(file.path,function(err,doc){
                        var fileId=doc.fileId;
                        var userId= _createObjectId(strId);
                        if(!userId){database.close();return callback("err")};
                        gs.close();
                        //��ͼƬ id ���뵽 ��ӦͼƬ���£�
                        var col=database.collection("image_libs");
                            col.update({"_id":userId,"username":json.username},{$addToSet:{images:{$each:[{"fileId":fileId}]}}},{w:1},function(err){
                                //database.close();
                                fun();
                                _addBelong(fileId,userId,json.username);
                            });
                    });
                });
            };
            });
        });
    };
//Ҳ������Ż�
function _addBelong(fileId,userId,username){
    var db=createDb();
    db.open(function(err,database){
        database.authenticate(db_conf.user,db_conf.pass,function(err,db){
            var col=database.collection("image_libs");
                col.update({"_id":userId,"username":username},{$addToSet:{belong:{$each:[{"username":"tt"}]}}},{w:1},function(){
                    database.close();
                });
        });
    });

}

function _checkBelong(json,callback){
    var libId=json.libId,
        imageId=json.imageId,
        username=json.username;
    var db=createDb();
    db.open(function(err,database){
        database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("image_libs");
                var oid= _createObjectId(libId);
                if(!oid){return callback("image_libs line 164 id err")};
                var iid= _createObjectId(imageId);
                if(!oid){return callback("image_libs line 167 id err")};
                col.find({"_id":oid,$or:[{"username":username},{"belong":{$elemMatch:{"username":username}}}],"images":{$elemMatch:{"fileId":iid}}},{}).toArray(function(err,item){
                    callback(err,item);
                    database.close();
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
exports.checkBelong=_checkBelong;

