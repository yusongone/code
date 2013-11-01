var db_conf=require("../../config.json").db;

function _createDb(){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}),{safe:true});
    return db;
}
exports.createDb=_createDb;
