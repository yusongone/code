var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;


function _createObjectId(str){
        try{
            str=str.toString();
            return  new objectId(str);
        }catch(err){
            console.error("createObjectId:",err);
            return false;
        }
};

//创建产品
function addProduct(jsonReq,callback){
    var database=jsonReq.database;
    var name=jsonReq.name||null,
        userId=jsonReq.userId,
        imgPath=jsonReq.imgPath||null,
        size=jsonReq.size||null,
        price=jsonReq.price||null,
        description=jsonReq.description||null;
    var uid=_createObjectId(userId);
    var col=database.collection("product");
        col.insert({name:name,userId:uid,imgPath:imgPath,size:size,price:price,description:description},function(err,item){
            callback(err,item);
        });
}

//修改产品
function changeProduct(jsonReq,callback){
    var database=jsonReq.database;
    var name=jsonReq.name,
        userId=jsonReq.userId,
        imgPath=jsonReq.imgPath||null,
        size=jsonReq.size,
        price=jsonReq.price,
        productId=jsonReq.productId,
        description=jsonReq.description;
    var pid=_createObjectId(productId);
    var col=database.collection("product");
        col.update({"_id":pid},{name:name,imgPath:imgPath,size:size,price:price,description:description},function(err,item){
            callback(err,item);
        });
}

//增加产品到列表
function addProductToList(jsonReq,callback){
    var database=jsonReq.database;
    var cusId=jsonReq.cusInfoId;
    var productId=jsonReq.productId;
    var cid=_createObjectId(cusId);
    var pid=_createObjectId(productId);
    if(!(cid&&pid)){return callback("creat object error at addProductToList function")}
    var col=database.collection("productList");
        col.update({"cusInfoId":cid},{$addToSet:{products:{$each:[{"productId":pId}]}}},{w:1},function(err,doc){
            callback(err,{"status":"ok"});
        });
}

//
function getProductsListByQuery(jsonReq,callback){
    var database=jsonReq.database;
    var query=jsonReq.query;
        if(query.cusInfoId){
            var cid=_createObjectId(query.cusInfoId);
            if(!cid){return callback("creat object error at addProductToList function")}
            query.cusInfoId=cid;
        }
        if(query.userId){
            var uid=_createObjectId(query.userId);
            if(!uid){return callback("creat object error at addProductToList function")}
            query.userId=uid;
        }
    var col=database.collection("product");
        //col.find({"cusInfoId":cid}).toArray(function(err,itemArray){
        col.find(query,{}).toArray(function(err,itemArray){
            callback(err,itemArray);
        });
}

exports.addProduct=addProduct;
exports.addProductToList=addProductToList;
exports.getProductsListByQuery=getProductsListByQuery;
