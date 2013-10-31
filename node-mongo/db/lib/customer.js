var mongodb=require("mongodb"),
    crypto=require("crypto");
    objectId=mongodb.ObjectID,
    Db=mongodb.Db,
    Server=mongodb.Server,
    gridStore=mongodb.GridStore;
var db_conf=require("../../config.json").db;

function _createObjectId(str){
        try{
            return  new objectId(id);
        }catch(err){
            return false;
        }
};

function _addCustomer(json,callback){
        var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
        db.open(function(err,database){
            database.authenticate(db_conf.user,db_conf.pass,function(err,db){
                var col=database.collection("customer");
                col.update({"username":json.username},{$addToSet:{customerList:{$each:[{"username":json.cusUsername}]}}},{w:1},function(err){
                    callback({"status":"ok"});
                    database.close();
                });
            });
        });
};

function _getCustomerList(json,callback){
    var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
    db.open(function(err,database){
        database.authenticate(db_conf.user,db_conf.pass,function(err,db){
            var col=database.collection("customer");
            // maybe use findOne function; need overwrite
            col.find({username:json.username}).toArray(function(err,item){
                if(0<item.length){
                    callback(item[0].customerList);
                }else{
                    callback(null);
                }
            });
        });
    });
}

function _createCustomerRow(json,callback){
    var db= new Db("picOnline", new Server(db_conf.ip, db_conf.port, {auto_reconnect: true}, {w:1}));
    db.open(function(err,database){
        database.authenticate(db_conf.user,db_conf.pass,function(err,db){
            var col=database.collection("customer");
            col.find({username:json.username}).toArray(function(err,item){
                if(0==item.length){
                    col.insert({username:json.username},function(err,item){
                        if(err){return callback("err")}
                        callback("create Ok");
                    });
                }else{
                    callback("already exists");
                };
            });
        });
    });
}

exports.addCustomer=_addCustomer;
exports.getCustomerList=_getCustomerList;
exports.createCustomerRow=_createCustomerRow;


