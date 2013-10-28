var db=require("../../db");
var parse=require("./common").parse;

function _addCustomer(json,callback){
    var json={
        "username":json.username,
        "cusUsername":json.cusUsername
    };
   db.Customer.getCustomerList(json,function(json){
       if(0==json.length){
           db.Customer.createCustomeRow(json,function(){
                _add(json,callback);    
           });
       }else{
            _add(json);    
       }
   }); 

   function _add(json,callback){
       db.Customer.addCustomer(json,function(json){
             callback(json);
       }); 
   }
}

function _getCustomer(){
   db.Customer.getCustomerList(json,function(json){
       if(json.length>0)
         callback(json);
   }); 

}

exports.addCustomer=_addCustomer;
exports.getCustomer=_getCustomer;
