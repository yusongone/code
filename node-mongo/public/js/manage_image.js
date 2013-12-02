
var pageSpace;
$(document).ready(function(){
        //pageSpace._btn_fileUp=$("#fileUp");
       // pageSpace.bindEvent();
        ajax_get($("#cusInfo_id").attr("value"));
        UP.init();


//测试
    $('#addCustomer').fileupload({
        autoUpload: true,//是否自动上传
        url:"/uploadImageToImagesLib",//上传地址
        acceptFileTypes: /(\.|\/)(gif|jpeg|png)$/i,
        dataType: 'json',
        formData:{"cusInfoId":$("#cusInfo_id").attr("value"),"filename":"na"},
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            var upl=data.context.data("object");
                upl.done();
        },
        fail:function(e,data){
            var upl=data.context.data("object");
                console.log("fail");
                upl.fail();
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
});


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
    uploadLi.prototype.fail=function(val){
        this.progress.find("div").eq(-1).css("background","red");
    }
    uploadLi.prototype.cancel=function(val){
        this.progress.find("div").eq(-1).css("background","yellow");
    }
    uploadLi.prototype.done=function(val){
        this.progress.find("div").eq(-1).css("background","green");
    }
    uploadLi.prototype.setValue=function(val){
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



var ajax_get=function(cusInfoId){
    $.ajax({
        "type":"post",
        "url":"/getCustomerImages",
        "datatype":"json",
        "data":{"cusInfoId":cusInfoId},
        "success":function(json){
            if("sorry"==json.status){alert(json.message);return false;};
            var data=json.data;
            for(var i=0,l=data.length;i<l;i++){
                var imgObj=new imageObj();
                    var thu=imgObj.initUI({
                        cusInfoId:cusInfoId,
                        id:data[i].fileId
                    });
                $(".imageList").append(thu);
            };
        }
    });
};

var ajax_deleteImage=function(cusInfoId,fileId,callback){
    $.ajax({
        "type":"post",
        "url":"/deletePhoto",
        "datatype":"json",
        "data":{"cusInfoId":cusInfoId,fileId:fileId},
        "success":function(json){
            if("sorry"==json.status){alert(json.message);return false;};
            callback();
        }
    });

};

var imageObj=(function(){
    function image(){
    
    }
    image.prototype.initUI=function(json){
        var cusInfoId=this.cusInfoId=json.cusInfoId;
        var id=this.fileId=json.id;
        var thu=$("<li/>",{"class":"thu"});
        var imgBox=$("<p/>",{"class":"imgBox"});
            var img=$("<img/>",{"src":"/photo/"+cusInfoId+"/"+id+"?type=fill"});
            var del=$("<div/>",{"class":"delete fa fa-trash-o"})
            imgBox.append(img,del);
        thu.append(imgBox);
        this.thu=thu;
        this.bindEvent({"del":del});
        return thu;
    }
    image.prototype.bindEvent=function(json){
        var that=this;
        json.del.click(function(){
            alert(that.fileId);
            ajax_deleteImage(that.cusInfoId,that.fileId,function(){
                that.thu.remove();
            });
        });
    
    }




    return image;
})();



