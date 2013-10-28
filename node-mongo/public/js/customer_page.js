var page={};
$(document).ready(function(){
    page.bindEvent();
});

page.bindEvent=function(){
    $("#add").click(function(){
        page.ajax_addCustomer($("#customer_name").val());
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

page.ajax_getCusList=function(){

};
