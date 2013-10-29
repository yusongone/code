var page={};
$(document).ready(function(){
    page.bindEvent();
   // page.ajax_getCusList();
});

page.bindEvent=function(){
    $("#add").click(function(){
        //page.ajax_addCustomer($("#customer_name").val());
        page.ajax_searchUser($("#customer_name").val());
    });
};

page.ajax_addCustomer=function(username){
    $.ajax({
        "type":"post",
        "url":"/ajax_addCustomer",
        "dataType":"json",
        "data":{"cusUsername":username},
        "success":function(result){
            if("ok"==result.status){
                alert("create ok");
            }else{
            }
        },
        "error":function(){
        
        }
    });
};

page.ajax_searchUser=function(username){
    $.ajax({
        "type":"post",
        "url":"/ajax_searchUser",
        "dataType":"json",
        "data":{"keyword":username},
        "success":function(result){
            if("ok"==result.status){
                alert("create ok");
            }else{
            }
        },
        "error":function(){
        
        }
    });
}
page.ajax_getCusList=function(){
    $.ajax({
        "type":"post",
        "url":"/ajax_getCustomer",
        "dataType":"json",
        "success":function(result){
            if("ok"==result.status){
                console.log(result.data);
            }else{
                alert("error");
            }
        },
        "error":function(){
        
        }
    });
};

page.li=(function(){

})();
