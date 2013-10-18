var mongodb=require("mongodb"),
    format=require("util").format,
    mongoClient=mongodb.MongoClient,
    gridStore=mongodb.GridStore;

function insertData(){
    mongoClient.connect("mongodb://127.0.0.1/test",function(err,db){
        var col=db.collection("one");
        col.find().toArray(function(err,result){
            console.log(result);
        });
    });

}
    
function putImage(file){
    mongoClient.connect("mongodb://127.0.0.1/test",function(err,db){
        var gs=new gridStore(db,"test.png","w",{
            content_type:"image/png",
            metadata:{
                "author":"me!"
            }
        });

        gs.open(function(err,gs){
            gs.writeFile(file.path,function(err,doc){
             console.log(doc);
            });
        });

    });
}

function get(callback){
    mongoClient.connect("mongodb://127.0.0.1/test",function(err,db){
        var gs=new gridStore(db,"test.png","r");
        gs.open(function(err,gs){
            gs.read(function(err,doc){
             callback(doc);
            });
        });
            /*
        */

    });
}



exports.putImage=putImage;
exports.get=get;
