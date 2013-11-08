var db_conf=require("../../config.json").db;

function _createDb(){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}),{safe:true});
    return db;
}

function _getAuthenticationDatabase(callback){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}),{safe:true});
        db.open(function(err,database){
            if(err){return callback(err);}
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                callback(err,database);
            });
        });
};

exports.createDb=_createDb;
exports.getAuthenticationDatabase=_getAuthenticationDatabase;
