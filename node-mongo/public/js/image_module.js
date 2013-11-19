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
                var ary=data.data;
                var product=pageSpace.Product;
                for(var i=0,l=ary.length;i<l;i++){
                    var d=new product(ary[i]);
                    $("body").append(d.body);
                }
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
pageSpace.ajax_changeProduct=function(name){
    var jsonReq={
        productName:"",
        productId:"528a925bba32037949000001",
        imagePath:"abffc",
        size:"--",
        price:"",
        description:"asdfefeaslfefefesasdfefasefasdfefe"
    }
    $.ajax({
        type:"post",
        url:"/changeProduct",
        dataType:"json",
        data:jsonReq,
        success:function(data){
            console.log(data);
        }
    });
};

pageSpace.Product=(function(){
    function product(json){
        var id=json["_id"];
        this.body=$("<div/>",{});
        this.initUI(json);
    }
    product.prototype.initUI=function(json){
        var z=$("<div/>",{text:json.name});
        this.body.append(z);
    }
    product.prototype.initUI=function(json){
    }
    return product;
})();
