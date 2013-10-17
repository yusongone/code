var mongodb=require("mongodb"),
    format=require("util").format,
    mongoClient=mongodb.MongoClient;
    

    mongoClient.connect("mongodb://127.0.0.1/test",function(err,db){
        var col=db.collection("one");
        col.find().toArray(function(err,result){
            console.log(result);
        });
    });
