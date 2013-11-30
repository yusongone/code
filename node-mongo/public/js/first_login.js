var page={};
$(document).ready(function(){

});

page.ajax_newThirdparty=function(){
    $.ajax({
        type:"post", 
        url:"/ajax_newThirdparty",
        dataType:"json",
        success:function(data){
           console.log(data); 
        }
    });
}
