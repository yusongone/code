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
$(window).scroll(function(evt){
    if($(this).scrollTop()>pTop){
        $(".productBox").css({"position":"fixed","top":0});
    }else{
        $(".productBox").css({"position":"absolute","top":0});
    };
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

var ajax_upload=function(data){
    $.ajax({
        "url":"ajax_uploadSelectPhotoList",
        "type":"post",
        "data":data,
        "success":function(data){
        }
    });
}

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
        this.body.data("id",json.fileId);
        _addSlideshowData(json);
        this.id=json.fileId;
        this.productList={};
        this.initUI(json); 
    }
    image.prototype.addOverDiv=function(text){
        var overSign=$("<div/>",{"class":"over "+text,"text":text})
        var close=$("<div/>",{"class":"close fa fa-times"})
        this.body.append(overSign.append(close));
        //this.productList[obj.text]=overSign;

        close.click(function(){
           that.subThu(thu); 
           overSign.remove();
            check(thu);
        });
    };
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
            page.ss.show().to(index);
        });

        this.body.hover(function(){
            var pThumb=ThumbBar.getThumbTool(that); 
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
                $("."+c[index]).append(imgObj.body);
                return imgObj;
        }
    }
})();








var ThumbBar=(function(){
    var signList=$("<ul/>",{"class":"signList"})
    var hoverImage;

    function selectBtn(thum){
        this.body=$("<li/>",{"class":"btnBlue sign","text":thum.text});
        this.ThumbShow=thum;
        signList.append(this.body);
        this.bindEvent();
    }
    selectBtn.prototype.bindEvent=function(){
        var that=this;
        this.body.click(function(){
            console.log($(this).data("enable"),"fefe");
            if($(this).data("enable")){return false;};
            that.ThumbShow.addThu(hoverImage);
           // hoverImage.addProduct(that.ThumbShow);
            check(hoverImage);
        });
    }

    function check(thu){
            signList.find(".sign").each(function(){
                var text=thu.text;
                console.log(thu.body.find(".A").length);
                if(thu.body.find("."+text).length>0){
                    $(this).addClass("disable");
                    $(this).data("enable",1);
                }else{
                    $(this).data("enable",0);
                    $(this).removeClass("disable");
                };
            });
    }

    return {
       createSign:function(thum){
           var that=this;
           new selectBtn(thum);
       }
        ,getThumbTool:function(thu){
            //check(thu);
            hoverImage=thu;
            return signList;
        }
    }
})();

var ProductThumbList=(function(){
    var charAry=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","O","R","S","T","U","V","W","X","Y","Z"];
    var thumList=[];
    var productList=$("<ul/>",{"class":"productList"});
    var overFlowDiv=$("<div/>",{"class":"overFlowDiv"});
        overFlowDiv.append(productList);

    function Thum(json){
        this.id=json._id;
        this.data=json;
        this.name=this.data.name;
        this.list=[];
        this.body=$("<li/>",{"class":"productLi","title":this.data.name});
        this.text=charAry[this.data.index];
        this.initUI();
    } 
   Thum.prototype.initUI=function(){
       var name=$("<div/>",{"class":"textOver name","text":this.name});
       var sign=$("<div/>",{"class":"sign","text":this.text});
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
   Thum.prototype.addThu=function(imgObj){
       var that=this;
       this.list.push(imgObj.id);
        this.count.text(this.list.length+"/"+this.data.imgCount)
        var text=charAry[this.data.index];
        imgObj.addOverDiv(this.text);
   }
    
   function _createThumbList(ary){
        for(var i=0;i<ary.length;i++){
            var json=ary[i];
                json.index=i;
            var thum=new Thum(json);
            thumList.push(thum);
            ThumbBar.createSign(thum);
        } 
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

