var db=require("../../db");
var parse=db.Common.parse;
var Type=db.Common.Type;
var getPool=db.Common.getPool;
var poolMain=getPool("main");


function addProduct(jsonReq,_callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        //查看产品列表 productList 中是否存在 此userId的doc；如果有，直接插入，如没有，创建后插入；
        db.Product.checkProductDocExist(jsonReq,function(err,result){
            if(result==null){
                db.Product.AddRowToProductList(jsonReq,function(err,callback){
                    _addProduct(jsonReq,_callback);
                });
            }else{
                _addProduct(jsonReq,_callback);
            }
        });

        function _addProduct(err,callback){
           db.Product.addProductToList(jsonReq,function(err,id){
                poolMain.release(database);
                callback(err,id); 
           });
        }
   });

}

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

function changeProduct(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Product.changeProduct(jsonReq,function(err,result){
            callback(err,result);  
        });
    });
};

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


exports.addProduct=addProduct;
exports.getCustomerProduct=getCustomerProduct;
exports.getProductByUserId=getProductByUserId;
exports.changeProduct=changeProduct;
