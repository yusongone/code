var mongodb=require("mongodb"),
    format=require("util").format,
    mongoClient=mongodb.MongoClient,
    objectId=mongodb.ObjectID,
    gridStore=mongodb.GridStore;

function insertData(){
    mongoClient.connect("mongodb://127.0.0.1/test",function(err,db){
        var col=db.collection("one");
        col.find().toArray(function(err,result){
            console.log(result);
        });
    });

}
var fileId; 
function putImage(file){
    mongoClient.connect("mongodb://127.0.0.1/test",function(err,db){
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
    mongoClient.connect("mongodb://127.0.0.1/test",function(err,db){
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
