var pageSpace={};
$(document).ready(function(){
    var addBox=$("#addBox");
    $(".add").click(function(){
        pageSpace.createAddBox(addBox);
    });
    pageSpace.ajax_getProductList();
});


pageSpace.createAddBox=function(addBox){
    addBox.slideDown("slow");
    var div=$("<div/>",{"class":"inputBox"});    
    var tab=$("<lable/>",{"text":"名称","class":"lab_name"});
    var moduleName=$("<input/>",{"class":"text"})
    var ok=$("<div/>",{"class":"btnBlue","text":"提交"});
    var cancel=$("<div/>",{"class":"btnBlue","text":"取消"});
        div.append(tab,moduleName,ok,cancel);
        addBox.append(div);

        ok.click(function(){
            pageSpace.ajax_addProduct(moduleName.val());
        });
}


pageSpace.ajax_getProductList=function(){
    $.ajax({
        type:"post",
        url:"/getAllProduct",
        dataType:"json",
        success:function(data){
            if(data.status=="ok"){
            }
        }
    });
}
pageSpace.ajax_addProduct=function(name){
    $.ajax({
        type:"post",
        url:"/addProduct",
        dataType:"json",
        data:{productName:name},
        success:function(data){
            console.log(data);
        }
    });
}
pageSpace.createProduct=function(name){
});

pageSpace.Product=(function(){
    function product(){
    }
    product.prototype.initUI=function(){
         
    }
})();
