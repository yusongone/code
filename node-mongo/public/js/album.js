var page={};
$(document).ready(function(){
        page.albumId=$("#albumId").val();
        UP.init();
        bindFileUpload();
        page.ajax_getPhotosFromAlbum();
});

page.ajax_getPhotosFromAlbum=function(){
    $.ajax({
        "type":"post",
        "url":"/getPhotosFromAlbum",
        "data":{"albumId":page.albumId},
        "dataType":"json",
        "success":function(data){
            if(data.status=="ok"){
                var ary=data.data.photos||[];
                var name=data.data.name;
                var count=ary.length;
                var a=$("<a/>",{href:"/album_list"});
                    a.append("<i class='fa fa-arrow-left'></i>");
                $(".page_title").html(a).append("",name);
                $(".count label").text(count);
                for(var i=0;i<count;i++){
                    var json=ary[i];
                    var imgObj=imageFactory.createImg(json);
                }
            }
        }
    });
};


function bindFileUpload(){
//测试
    $('#upload').fileupload({
        autoUpload: true,//是否自动上传
        url:"/uploadPhotoToAlbum",//上传地址
        acceptFileTypes: /(\.|\/)(gif|jpeg|png)$/i,
        dataType: 'json',
        formData:{"albumId":page.albumId},
        done: function (e, data) {//设置文件上传完毕事件的回调函数
        },
        fail:function(e,data){
            var upl=data.context.data("object");
                upl.fail(data);
        },
        add:function(e,data){
            data.context=UP.createAupload({name:data.files[0].name,"data":data});
            UP.open(data);
            data.submit();
            data.jqXHR.done(function(reqData){
                if(reqData.status=="ok"){
                    var upl=data.context.data("object");
                        upl.done(reqData.data);
                }
            });
        },
        progress: function (e, data) {//设置上传进度事件的回调函数
            var upl=data.context.data("object");
            var val=parseInt(data.loaded/data.total*100,10);
            upl.setValue(val);
        },
        progressall: function (e, data) {//设置上传进度事件的回调函数
            var progress = parseInt(data.loaded / data.total * 100, 10);
        }
    });
}


var UP=(function(){
        var div;
    function _init(){
        div=$("<div/>",{"class":"uploadList"});
        div.dialog({
            autoOpen:false,
            resizable: true,
            modal: true,
            buttons: {
                "清空": function() {
                    $('#upload').fileupload("clear");
                }
            },
            "close":function(){
                div.html("");
            },
            "beforeclose":function(){
                
            }
        });
    }

    var uploadLi=function(){
        this.body=$("<p/>");
        this.body.data("object",this);
    }
    uploadLi.prototype.createUI=function(json){
        var p=this.body;
        var that=this;
        that.data=json.data;
        var name=$("<div/>",{"class":"proName","text":json.name});
        this.progress=$("<div/>",{});
        this.btnCancel=$("<div/>",{"text":"取消","class":"cancel"});
        this.resubmit=$("<div/>",{"text":"重试","class":"resubmit"});
        p.append(this.progress.append(name,this.btnCancel,this.resubmit));
        this.progress.progressbar({value:3});
        this.progress.addClass("progress");
        div.append(p);
        this.btnCancel.click(function(){
            json.data.abort();
            that.cancel();
        });
        this.resubmit.click(function(){
            $(this).hide();
            that.data.submit();
        });
    }
    uploadLi.prototype.fail=function(callback){
        this.progress.addClass("fail");
        this.resubmit.show();
    }
    uploadLi.prototype.cancel=function(val){
        this.progress.addClass("cancel");
    }
    uploadLi.prototype.done=function(data){
        this.progress.addClass("done");
        this.btnCancel.hide();
        var imgObj=imageFactory.createImg({id:data.fileId,width:data.img.width,height:data.img.height});
            imgObj.insertAnimate();
    }
    uploadLi.prototype.setValue=function(val){
        this.progress.progressbar({value:val});
    }

   return {
        init:_init,
        open:function(data){
            div.dialog("open");
        },
        createAupload:function(json){
            var ul=new uploadLi();
                ul.createUI(json);
                return ul.body;
        }
    } 
})();

page.setImageCount=function(count){
    $(".toolBar .count label").text(count);
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
        page.setImageCount(imgList.length);
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
        this.id=json.id;
        this.initUI(json); 
    }
    image.prototype.insertAnimate=function(){
        this.body.css({"width":"0px"}).animate({"width":"160px"},1500);
    };
    image.prototype.initUI=function(json){
        var that=this;
        var imgBox=$("<div/>",{"class":"imgBox"});
            var img=$("<img/>",{"src":"/album_photo/"+page.albumId+"/"+that.id+"?type=fill"});
            var del=$("<i/>",{"class":"delete fa fa-trash-o"});
            var download=$("<i/>",{"class":"download fa fa-download"});
            var name=$("<div/>",{"class":"nameBox"});
                name.append(del,download);
            imgBox.append(img);
        this.body.append(imgBox,name);
        this.bindEvent({"del":del,"imgBox":imgBox,"download":download});
        $(".photoList").prepend(this.body);
    }
    image.prototype.bindEvent=function(json){
        var that=this;
        json.del.click(function(){
            ajax_deleteImage(page.albumId,that.id,function(){
                that.body.remove();
                _removeMe.call(that); 
            });
        });
        json.imgBox.click(function(){
            var index=_getMeIndex.call(that);
            console.log("myIndex",index);
            page.ss.show().to(index);
        });
        json.download.click(function(){
            window.location="/album_photo/download/"+page.albumId+"/"+that.id+"/liantu"; 
            return false;
        });
    }
    return {
        createImg:function(json){
            var imgObj=new image(json);
                imgList.push(imgObj);
                page.setImageCount(imgList.length);
                return imgObj;
        }
    }
})();

var ajax_deleteImage=function(albumId,fileId,callback){
   $.ajax({
        "type":"post",
        "url":"/deleteOnePhotoFromAlbum",
        "data":{albumId:albumId,fileId:fileId},
        "dataType":"json",
        "success":function(data){
            callback();
        }
   }); 
}























