var db=require("../../db");
var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;
var Common=db.Common;


function _test_addCustomer(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Customer.addCustomer({
            "database":database,
            "username":"test1",
            "cusId":new objectId()
        },function(err,result){
            database.close();
            if(err){return console.log("******db_users>>>>>>>>>>>>>>>>>>> insertUserName Error")};
            if(result.status=="ok"){
                console.log("db_customer-------->add Customer ok");
            }
        });
    });
}


function _test_createCustomer(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Customer.createCustomer({
            "database":database,
            "imageId":new objectId(),
            "userId":new objectId(),
            "reserverMessage":"abc",
            "boyInfo":{
                    "name":"刘德华",
                    "phone":"13000000000"
                },
            "girlInfo":{
                    "name":"张惠妹",
                    "phone":"13222222222"
                },
            "address":"北京"
        },function(err,result){
            database.close();
            if(err){return console.log("******db_users>>>>>>>>>>>>>>>>>>> createCustomer Error")};
            if(result.length>0){
                console.log("db_customer-------->create Customer insert ok");
            }else{
                console.log("db_customer========>create Customer insert faile ok");
            }
        });
    });
}

function _test_getCustomerById(){
    Common.getAuthenticationDatabase(function(err,database){
        db.Customer.getCustomerInfoById({
            "database":database,
            "cusId":new objectId("527ba64b31c714db78000003") 
        },function(err,result){
            if(err){return console.log("******db_users>>>>>>>>>>>>>>>>>>> createCustomer Error")};
            console.log(result);
        });
    });
}


exports.test=function(){
    _test_createCustomer();
    _test_addCustomer();
    _test_getCustomerById();
}
