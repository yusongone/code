var db=require("../../db");
var parse=db.Common.parse;
var Type=db.Common.Type;
var getPool=db.Common.getPool;
var poolMain=getPool("main");


function addProduct(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
       db.Product.addProduct(jsonReq,function(err,doc){
            poolMain.release(database);
           if(doc){
                callback(err,doc["_id"]); 
           }else{
                callback(err,null); 
           }
       });
   });

}

function getCustomerProduct(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        jsonReq.query={
            cusInfoId:jsonReq.cusInfoId
        }
        db.Product.getCustomerProduct(jsonReq,function(err,doc){
            poolMain.release(database);
           if(doc){
                callback(err,doc["_id"]); 
           }else{
                callback(err,null); 
           }
       });
   });

};
function getProductByUserId(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        jsonReq.query={
            userId:jsonReq.userId
        }
        db.Product.getProductsListByQuery(jsonReq,function(err,doc){
            poolMain.release(database);
           if(doc){
                callback(err,doc); 
           }else{
                callback(err,null); 
           }
       });
   });

}


exports.addProduct=addProduct;
exports.getCustomerProduct=getCustomerProduct;
exports.getProductByUserId=getProductByUserId;
