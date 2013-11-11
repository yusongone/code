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

//��ȡͼƬ
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
            //��ͼƬ id ���뵽 ��ӦͼƬ���£�
            var col=database.collection("image_libs");
            //db.one.update({"name":"e"},{$addToSet:{images:{$each:[{"name":"c"}]}}});
                col.update({"_id":userId,"username":jsonReq.username},{$addToSet:{images:{$each:[{"fileId":fff}]}}},{w:1},function(err){
                    callback();
                });
            })
        });
};
//�ϴ�ͼƬ�����Ұ�ͼƬID��ŵ���Ӧ ͼƬ���ļ�����
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
                //д��ͼƬ
                gs.writeFile(file.path,function(err,doc){
                    var fileId=doc.fileId;
                    var userId= _createObjectId(strId);
                    if(!userId){database.close();return callback("err")};
                    gs.close();
                    //��ͼƬ id ���뵽 ��ӦͼƬ���£�
                    var col=database.collection("image_libs");
                        col.update({"_id":userId,"username":jsonReq.username},{$addToSet:{images:{$each:[{"fileId":fileId}]}}},{w:1},function(err){
                            //database.close();
                            fun();
                            });
                        });
                });
            });
        };
};
