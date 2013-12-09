var mongodb=require("mongodb"),
    Db=mongodb.Db,
    Server=mongodb.Server,
    objectId=mongodb.ObjectID;
var db_conf=require("../../config.json").db;
var thu_conf=require("../../config.json").thumbnail;
var poolModule=require("generic-pool");

var poolMain = poolModule.Pool({
        name     : 'main',
        create   : function(callback) {
            mongodb.MongoClient.connect("mongodb://"+db_conf.ip+"/"+db_conf.dbname,{server:{poolSize:1}},function(err,database){
                    if(err){return callback(err);}
                    database.authenticate(db_conf.user,db_conf.pass,function(err,ddb){
                        callback(err,database);
                    });
            });
        },
        destroy  : function(database) { 
            database.close();
         }, //当超时则释放连接
        max      : 10,   //最大连接数
        idleTimeoutMillis : 30000,  //超时时间
      log : true
       //  log : false
    });
var z=0;
var t=0;
var poolThumbnail = poolModule.Pool({
        name     : 'thumbnail',
        create   : function(callback) {
            mongodb.MongoClient.connect("mongodb://"+thu_conf.ip+"/"+thu_conf.dbname,{server:{poolSize:1}},function(err,database){
                    if(err){return callback(err);}
                    database.authenticate(thu_conf.user,thu_conf.pass,function(err,ddb){
                        callback(err,database);
                    });
            });
        },
        destroy  : function(database) { 
            database.close();
         }, //当超时则释放连接
        max      : 10,   //最大连接数
        idleTimeoutMillis : 30000,  //超时时间
        log : true  
        //log : false
    });


function _getAuthenticationDatabase(callback){
         console.log("*****************************************");
        var db= new Db(db_conf.dbname, new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}),{safe:true});
        db.open(function(err,database){
            if(err){return callback(err);}
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                callback(err,database);
            });
        });
};

function _getThumbnailDatabase(callback){
            console.log("*****************************************");
        var db= new Db(thu_conf.dbname, new Server(thu_conf.ip, thu_conf.port, {auto_reconnect: true}, {w:1}),{safe:true});
        db.open(function(err,database){
            if(err){return callback(err);}
            database.authenticate(thu_conf.user,thu_conf.pass,function(err,db){
                callback(err,database);
            });
        });
}

exports.getAuthenticationDatabase=_getAuthenticationDatabase;
exports.getThumbnailDatabase=_getThumbnailDatabase;
exports.getPool=function(type){
    var pool;
    switch(type){
        case "main":pool=poolMain;break;
        case "thumbnail":pool=poolThumbnail;break;
    };
    return pool;
}
exports.createObjectId=function(str){
    try{
        str=str.toString();
        return  new objectId(str);
    }catch(err){
        console.error("createObjectId:",err);
        return false;
    }
};

