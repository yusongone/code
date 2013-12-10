var page={};
var pTop;
$(document).ready(function(){
    pTop=$(".content").position().top;
    page.cusInfoId=$("#cusInfoId").val();
    showSelectList.init();
    ajax_get(); 
    ajax_getCusProducts();

    $("#createList").click(function(){
        ProductThumbList.createSelectPhoto();
    });
});
var ajax_get=function(){
    $.ajax({
        "type":"post",
        "url":"/getCustomerImages",
        "datatype":"json",
        "data":{"cusInfoId":page.cusInfoId},
        "success":function(json){
            if("sorry"==json.status){alert(json.message);return false;};
            var data=json.data;
            for(var i=0,l=data.length;i<l;i++){
                    var json=data[i];
                    var imgObj=imageFactory.createImg(json);
                /*
                var id=data[i].fileId; 
                var img=$("<img/>",{"src":"/photo/"+cusInfoId+"/"+id+"?size=300"});
                var thu=$("<li/>",{"class":"thu"});
                var overBox=$("<div/>",{"class":"overBox"});
                thu.data("id",id);
                thu.data("filename",data[i].filename);
                */
            };
        }
    });
};


var imageFactory=(function(){
    var imgList=[];
    var slideshowData=[];

                page.ss=SlideShow.getPageSS({
                    images:slideshowData
                });

    function _addSlideshowData(json){
            var tempObj=json;
            var tempJson={};
            var src="/album_photo/"+page.albumId+"/"+tempObj.id+"?size=800";
            tempJson.src=src;
            tempJson.max=800;
            tempJson.id=tempObj.id;
            tempJson.width=tempObj.width;
            tempJson.height=tempObj.height;
            slideshowData.push(tempJson);
    }
    
    function _removeMe(){
        var that=this;
        var index=_getMeIndex.call(that);
        imgList.splice(index,1);
        slideshowData.splice(index,1);
    }
    function _getMeIndex(){
        var that=this;
        for(var i=0;i<imgList.length;i++){
            if(imgList[i]==that){
                return i;
            }
        }
    }

    function image(json){
        this.body=$("<li/>",{"class":"photo"});
        _addSlideshowData(json);
        this.id=json.fileId;
        this.initUI(json); 
    }
    image.prototype.insertAnimate=function(){
        this.body.css({"width":"0px"}).animate({"width":"160px"},1500);
    };
    image.prototype.initUI=function(json){
        var that=this;
        var imgBox=$("<div/>",{"class":"imgBox"});
            var img=$("<img/>",{"src":"/photo/"+page.cusInfoId+"/"+that.id+"?size=300"});
            var name=$("<div/>",{"class":"nameBox"});
                name.append();
            imgBox.append(img);
        this.body.append(imgBox,name);
        this.bindEvent({"imgBox":imgBox});
    }
    image.prototype.bindEvent=function(json){
        var that=this;
        json.imgBox.click(function(){
            var index=_getMeIndex.call(that);
            console.log("myIndex",index);
            page.ss.show().to(index);
        });
                this.body.hover(function(){
                    var pThumb=ProductThumbList.getPThumb($(this)); 
                    $(this).find(".nameBox").append(pThumb);
                },function(){
                    //z.remove();
                });
    }
    return {
        createImg:function(json){
            var imgObj=new image(json);
                imgList.push(imgObj);
                var c=["a","b","c","d"];
                var index=imgList.length%4;
                    console.log(index);
                $("."+c[index]).append(imgObj.body);
                return imgObj;
        }
    }
})();


var ajax_getCusProducts=function(){
    $.ajax({
        "type":"post",
        "url":"/ajax_getProductsFromCustomer",
        "dataType":"json",
        "data":{
            "cusInfoId":page.cusInfoId
        },
        "success":function(data){
            if(data.status=="ok"&&data.data){
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
    var productList=$("<ul/>",{"class":"productList"});
    var overFlowDiv=$("<div/>",{"class":"overFlowDiv"});
        overFlowDiv.append(productList);
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
       var img=$("<img/>",{"class":"headImage","src":"/public_image/"+this.data.imgPath+""})
       this.body.append(img,sign,this.count,name);
       productList.append(this.body);
   }
   Thum.prototype.subThu=function(thu){
       var list=this.list;
       var length=list.length;
       for(var i=0;i<length;i++){
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
        this.sign=$("<li/>",{"class":"btnBlue sign","text":text});
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
                    $(this).addClass("disable");
                    $(this).data("enable",1);
                }else{
                    $(this).data("enable",0);
                    $(this).removeClass("disable");
                };
            });
    }
   return {
        init:function(ary){
            var prev=$("<div/>",{"class":"prev"});
                prev.append("<i class='fa fa-arrow-left'></i>");
            var next=$("<div/>",{"class":"next"});
                next.append("<i class='fa fa-arrow-right'></i>");
            $(".productBox").append(prev,overFlowDiv,next);
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

