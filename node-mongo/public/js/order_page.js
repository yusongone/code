var page=window.page||{};
$(document).ready(function(){
   page.bindPageEvent(); 
});

page.bindPageEvent=function(){
    $("#addCustomer").click(function(){
        alert("bcd");
    });  
}

page.ajax_createOrder=function(){
    $.ajax(function(){
    });
}
