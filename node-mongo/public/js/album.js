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
                $(".page_title").text(name);
                $(".count label").text(count);
                for(var i=0;i<count;i++){
                    var json=ary[i];
                    var imgObj=new imageObj(json);
                }
                var ssData=_createSlideshowData(ary);
                page.ss=SlideShow.getPageSS({
                    images:ssData
                });
            }
        }
    });
};

function _createSlideshowData(ary){
    var tempAry=[];
    for(var i=0;i<ary.length;i++){
        var tempJson={};
        var tempObj=ary[i];
        var src="/album_photo/"+page.albumId+"/"+tempObj.id+"?size=600";
        tempJson.src=src;
        tempJson.max=600;
        tempJson.id=tempObj.id;
        tempJson.width=tempObj.width;
        tempJson.height=tempObj.height;
        tempAry.push(tempJson);
    }
    return tempAry;
}

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
                        upl.done(reqData);
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
        var imgObj=new imageObj({id:data.fileId});
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



var imageObj=(function(){
    var imgList=[];
    function image(json){
        this.index=imgList.push(this)-1;
        this.body=$("<li/>",{"class":"photo"});
        this.initUI(json); 
    }
    image.prototype.insertAnimate=function(){
        this.body.css({"width":"0px"}).animate({"width":"160px"},1500);
    };
    image.prototype.initUI=function(json){
        var albumId=this.albumId=page.albumId;
        var id=this.fileId=json.id;
        var imgBox=$("<div/>",{"class":"imgBox"});
            var img=$("<img/>",{"src":"/album_photo/"+albumId+"/"+id+"?type=fill"});
            var del=$("<div/>",{"class":"delete fa fa-trash-o"})
            var name=$("<div/>",{"class":"nameBox"});
                name.append(del);
            imgBox.append(img);
        this.body.append(imgBox,name);
        this.bindEvent({"del":del});
        $(".photoList").prepend(this.body);
    }
    image.prototype.bindEvent=function(json){
        var that=this;
        json.del.click(function(){
            ajax_deleteImage(that.albumId,that.fileId,function(){
                that.body.remove();
            });
        });

        this.body.click(function(){
            page.ss.show().to(that.index);
        });
    }
    return image;
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























