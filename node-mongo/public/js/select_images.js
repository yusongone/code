var pTop;
$(document).ready(function(){
   ajax_get($("#cusInfoId").val()); 
    ajax_getCusProducts($("#cusInfoId").val());
    pTop=$(".content").position().top;
});
var ajax_get=function(cusInfoId){
    console.log(cusInfoId);
    $.ajax({
        "type":"post",
        "url":"/getSelectImages",
        "datatype":"json",
        "data":{"cusInfoId":cusInfoId},
        "success":function(json){
            if("sorry"==json.status){alert(json.message);return false;};
            var data=json.data;
            var c=["a","b","c","d"];
            var pThumList=ProductThumbList.signList;
            for(var i=0,l=data.length;i<l;i++){
                var id=data[i].fileId; 
                var img=$("<img/>",{"src":"/photo/"+cusInfoId+"/"+id+"?size=300"});
                var thu=$("<li/>",{"class":"thu"});
                $("."+c[i%4]).append(thu.append(img));
                thu.data("id",id);
                thu.data("filename",data[i].filename);
                thu.hover(function(){
                    $(this).append(pThumList.data("thum",$(this)));
                },function(){
                    //z.remove();
                });
            };
        }
    });
};
var ajax_getCusProducts=function(cusInfoId){
    console.log("efef");
    $.ajax({
        "type":"post",
        "url":"/ajax_getProductsFromCustomer",
        "dataType":"json",
        "data":{
            "cusInfoId":cusInfoId
        },
        "success":function(data){
            if(data.status=="ok"){
            var ary=data.data;
            ProductThumbList.init(ary);
            }
        }
    });
}

$(window).scroll(function(evt){
    if($(this).scrollTop()>pTop){
        $(".productBox").css({"position":"fixed","top":0});
    }else{
        $(".productBox").css({"position":"absolute","top":0});
    };
});

var ProductThumbList=(function(){
    var charAry=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","O","R","S","T","U","V"];
    var thumList=[];
    var productList=$("<div/>",{"class":"productList"});
    var signList=$("<ul/>",{"class":"signList"})
    function Thum(json){
        this.data=json;
        this.list=[];
        this.body=$("<li/>",{"class":"productLi","title":this.data.name});
        this.initUI();
        this.createSign();
    } 
   Thum.prototype.initUI=function(){
       var name=$("<div/>",{"class":"textOver name","text":this.data.name});
       var sign=$("<div/>",{"class":"sign","text":charAry[this.data.index]});
       this.count=$("<div/>",{"class":"count","text":0});
       var img=$("<img/>",{"class":"headImage","src":"/public_image/"+this.data.imgPath+"?size=100&type=fill"})
       this.body.append(img,name,this.count,sign);
       productList.append(this.body);
   
   }
   Thum.prototype.addThu=function(thu){
       this.list.push(thu.data("_id"));
        this.count.text(this.list.length)
        thu.css("opacity","0.7");
        var div=$("<div/>",{"class":"over","text":charAry[this.data.index]})
        thu.append(div);
   }
   Thum.prototype.createSign=function(){
       var that=this;
        this.sign=$("<li/>",{"class":"sign","text":charAry[this.data.index]});
        signList.append(this.sign);
        this.sign.click(function(){
            var thu=signList.data("thum");
                that.addThu(thu);
        });
   }
   Thum.prototype.bindEvent=function(){
   
   }

   function _createThumbList(ary){
        for(var i=0;i<ary.length;i++){
            var json=ary[i];
                json.index=i;
            var thum=new Thum(json);
            thumList.push(thum);
        } 
   }

   return {
        init:function(ary){
            $(".productBox").append(productList);
            _createThumbList(ary);
        }
        ,signList:signList
   
   }
})();
