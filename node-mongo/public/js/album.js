var page={};
$(document).ready(function(){
        UP.init();
        bindFileUpload();
        page.ajax_getPhotosFromAlbum();
});

page.ajax_getPhotosFromAlbum=function(){
    $.ajax({
        "type":"post",
        "url":"/getPhotosFromAlbum",
        "data":{"albumId":$("#albumId").val()},
        "dataType":"json",
        "success":function(data){
            if(data.status=="ok"){
                var ary=data.data.photos;
                var name=data.data.name;
                var count=ary.length;
                $(".toolBar .albumName").text(name);
                $(".toolBar .num").text(count);
                for(var i=0;i<count;i++){
                    var json=ary[i];
                        json.albumId=$("#albumId").val();
                    var imgObj=new imageObj(ary[i]);
                        $(".photoList").append(imgObj.initUI(ary[i]));
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
        formData:{"albumId":$("#albumId").val()},
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            var upl=data.context.data("object");
                upl.done();
                upl.done(function(){
                    alert("bcd");
                });
        },
        fail:function(e,data){
            var upl=data.context.data("object");
        },
        add:function(e,data){
            data.context=UP.createAupload({name:data.files[0].name,"data":data});
            UP.open();
            data.submit();
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
                "Delete all items": function() {
                    $('#addCustomer').fileupload('clear');
                },
                Cancel: function() {
                $( this ).dialog( "close" );
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
        var name=$("<div/>",{"class":"proName","text":json.name});
        this.progress=$("<div/>",{});
        var submit=$("<div/>",{"text":"取消","class":"cancel"});
        p.append(this.progress.append(name,submit));
        this.progress.progressbar({value:0});
        this.progress.addClass("progress");
        div.append(p);
        submit.click(function(){
            json.data.abort();
            that.cancel();
        });
    }
    uploadLi.prototype.fail=function(callback){
        this.progress.find("div").eq(-1).css("background","red");
    }
    uploadLi.prototype.cancel=function(val){
        this.progress.find("div").eq(-1).css("background","yellow");
    }
    uploadLi.prototype.done=function(callback){
        this.progress.find("div").eq(-1).css("background","green");
        this.progress.find("div").eq(-1).click(function(){
            callback();
        });
    }
    uploadLi.prototype.setValue=function(val){
        console.log("efefe");
        this.progress.progressbar({value:val});
    }

   return {
        init:_init,
        open:function(){
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
    function image(){
    
    }
    image.prototype.initUI=function(json){
        var albumId=this.albumId=json.albumId;
        var id=this.fileId=json.id;
        var thu=$("<li/>",{"class":"photo"});
        var imgBox=$("<div/>",{"class":"imgBox"});
            var img=$("<img/>",{"src":"/album_photo/"+albumId+"/"+id+"?type=fill"});
            var del=$("<div/>",{"class":"delete fa fa-trash-o"})
            var date=$("<div/>",{"class":"count"})
            imgBox.append(img,del,date);
        thu.append(imgBox);
        this.thu=thu;
        this.bindEvent({"del":del});
        return thu;
    }
    image.prototype.bindEvent=function(json){
        var that=this;
        json.del.click(function(){
            ajax_deleteImage(that.albumId,that.fileId,function(){
                that.thu.remove();
            });
        });
    }


    return image;
})();

var ajax_deleteImage=function(albumId,fileId,callback){
   $.ajax({
        "type":"post",
        "url":"/deletePhotoFromAlbum",
        "data":{albumId:albumId,fileId:fileId},
        "dataType":"json",
        "success":function(data){
            callback();
        }
   }); 
}























