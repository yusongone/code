var db_conf=require("../../config.json").db;
var thu_conf=require("../../config.json").thumbnail;


function _getAuthenticationDatabase(callback){
        var db= new Db(db_conf.dbname, new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}),{safe:true});
        db.open(function(err,database){
            if(err){return callback(err);}
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                callback(err,database);
            });
        });
};

function _getThumbnailDatabase(callback){
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
