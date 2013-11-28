var pTop;
$(document).ready(function(){
    showSelectList.init();
   ajax_get($("#cusInfoId").val()); 
    ajax_getCusProducts($("#cusInfoId").val());
    pTop=$(".content").position().top;
    $("#createList").click(function(){
        ProductThumbList.createSelectPhoto();
//    showSelectList.
    });
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
                var overBox=$("<div/>",{"class":"overBox"});
                $("."+c[i%4]).append(thu.append(img,overBox));
                thu.data("id",id);
                thu.data("filename",data[i].filename);
                thu.hover(function(){
                    var pThumb=ProductThumbList.getPThumb($(this)); 
                    $(this).append(pThumb);
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
    var charAry=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","O","R","S","T","U","V","W","X","Y","Z"];
    var thumList=[];
    var productList=$("<div/>",{"class":"productList"});
    var signList=$("<ul/>",{"class":"signList"})
    function Thum(json){
        this.id=json._id;
        this.data=json;
        this.name=this.data.name;
        this.list=[];
        this.body=$("<li/>",{"class":"productLi","title":this.data.name});
        this.initUI();
        this.createSign();
    } 
   Thum.prototype.initUI=function(){
       console.log(this.data.imgCount);
       var name=$("<div/>",{"class":"textOver name","text":this.name});
       var sign=$("<div/>",{"class":"sign","text":charAry[this.data.index]});
       this.count=$("<div/>",{"class":"count","text":0+"/"+this.data.imgCount});
       var img=$("<img/>",{"class":"headImage","src":"/public_image/"+this.data.imgPath+"?size=100&type=fill"})
       this.body.append(img,name,this.count,sign);
       productList.append(this.body);
   }
   Thum.prototype.subThu=function(thu){
       var list=this.list;
       var length=list.length;
       for(var i=0;i<length;i++){
           console.log(list[i],thu.data("id"));
           if(list[i]==thu.data("id")){
                list.splice(i,1);
           } 
       }
        this.count.text(this.list.length+"/"+this.data.imgCount)
   }
   Thum.prototype.addThu=function(thu){
       var that=this;
       this.list.push(thu.data("id"));
        this.count.text(this.list.length+"/"+this.data.imgCount)
        var text=charAry[this.data.index];
        var overSign=$("<div/>",{"class":"over "+text,"text":text})
        var close=$("<div/>",{"class":"close fa fa-times"})
        thu.find(".overBox").append(overSign.append(close));

        close.click(function(){
           that.subThu(thu); 
           overSign.remove();
            check(thu);
        });
   }
   Thum.prototype.createSign=function(){
       var that=this;
       var text=charAry[this.data.index];
        this.sign=$("<li/>",{"class":"sign","text":text});
        this.sign.data("text",text);
        signList.append(this.sign);
        this.sign.click(function(){
            if($(this).data("enable")){return false;};
            var thu=signList.data("thum");
                that.addThu(thu);
                check(thu);
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
    function check(thu){
            signList.find(".sign").each(function(){
                var text=$(this).data("text");
                console.log(thu.find("."+text).length);
                if(thu.find("."+text).length>0){
                    $(this).css({background:"red"});
                    $(this).data("enable",1);
                }else{
                    $(this).data("enable",0);
                    $(this).css({background:"blue"});
                };
            });
    }
   return {
        init:function(ary){
            $(".productBox").append(productList);
            _createThumbList(ary);
        }
        ,getPThumb:function(thu){
            check(thu);
            return signList.data("thum",thu);
        }
        ,createSelectPhoto:function(){
            var obj={};
            for(var i=0;i<thumList.length;i++){
                var list=thumList[i].list;
                var productId=thumList[i].id;
                obj[productId]=list;
            };
            showSelectList.parseData(obj);
            var c=JSON.stringify(obj)
            ajax_upload({"objStr":c});
        }
   }
})();
var ajax_upload=function(data){
    $.ajax({
        "url":"ajax_uploadSelectPhotoList",
        "type":"post",
        "data":data,
        "success":function(data){
            console.log(data);
        }
    });
}
var showSelectList=(function(){
        var d;
    function initDialog(){
        d=$("<div/>",{});
            d.dialog({
                autoOpen:false
            });
    }
    function createUI(data){
        for(var i in data){
            var z=$("<div/>");
            var headline=$("<div/>",{"text":i})
            var ul=$("<ul/>",{});
            for(var j=0;j<data[i].length;j++){
                var li=$("<li/>",{"text":data[i][j]});
                ul.append(li);
            }
            d.append(z,headline,ul);
        }
    }

    return {
        init:function(){
            initDialog();
        },
        parseData:function(data){
            createUI(data);
            d.dialog("open");
        }
    }
})();

