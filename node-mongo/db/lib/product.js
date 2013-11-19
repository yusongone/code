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

function checkProductDocExist(jsonReq,callback){
    var database=jsonReq.database;
    var userId=jsonReq.userId;
    var uid=_createObjectId(userId);
    if(!uid){return callback(err)};
    var col=database.collection("productList");
    col.findOne({"userId":uid},function(err,result){
        callback(err,result);
    });
}

function AddRowToProductList(jsonReq,callback){
    var database=jsonReq.database;
    var userId=jsonReq.userId;
    var uid=_createObjectId(userId);
    if(!uid){return callback(err)};
    var col=database.collection("productList");
        col.insert({"userId":uid,products:[]},function(err,doc){
           callback(err,doc); 
        });
};

//创建产品
function addProductToList(jsonReq,callback){
    var database=jsonReq.database;
    var name=jsonReq.name;
    var userId=jsonReq.userId;
    var uid=_createObjectId(userId);
    if(!uid){return callback("create object Id error");}
    var col=database.collection("productList");
    var _id=new objectId();
    console.log(name,_id);
        col.update({"userId":uid},{$addToSet:{products:{$each:[{"_id":_id,"name":name}]}}},{w:1},function(err){
            callback(err,_id);
        });
}


//增加产品到列表
/*
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
*/

//
function getProductsListByQuery(jsonReq,callback){
    var database=jsonReq.database;
    var query=jsonReq.query;
        if(query.cusInfoId){
            var cid=_createObjectId(query.cusInfoId);
            if(!cid){return callback("creat object error at getProductsListByQuery function")}
            query.cusInfoId=cid;
        }
        if(query.userId){
            var uid=_createObjectId(query.userId);
            if(!uid){return callback("creat object error at getProductsListByQuery function")}
            query.userId=uid;
        }
    var col=database.collection("productList");
        //col.find({"cusInfoId":cid}).toArray(function(err,itemArray){
        col.findOne(query,{},function(err,itemArray){
            if(itemArray){
                return callback(err,itemArray.products);
            }
            callback(err,[]);
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
    var uid=_createObjectId(userId);
        if(!(uid&&pid)){return callback("create objectId err db/lib/products changeParoduct")}
    var col=database.collection("productList");
    var setObject={};
        name?setObject["products.$.name"]=name:"";
        imgPath?setObject["products.$.imgPath"]=imgPath:"";
        size?setObject["products.$.size"]=size:"";
        price?setObject["products.$.price"]=price:"";
        description?setObject["products.$.description"]=description:"";
        console.log(setObject);
        col.update( {"userId":uid,"products._id":pid},{ "$set":setObject },function(err,item){
                    callback(err,item);
        });
}


exports.addProductToList=addProductToList;
exports.getProductsListByQuery=getProductsListByQuery;
exports.checkProductDocExist=checkProductDocExist;
exports.AddRowToProductList=AddRowToProductList;
exports.changeProduct=changeProduct;
