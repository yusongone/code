var page={};
$(document).ready(function(){
    page.bindEvent();
    page.ajax_getImageLibs();
    return false;
    page.ajax_createImageLibs({
        "name":"tefad"
    });
});



page.bindEvent=function(){
}

page.ajax_createImageLibs=function(json){
    $.ajax({
        "type":"post",
        "url":"/ajax_createImageLibs",
        "dataType":"json",
        "data":{"libname":json.name},
        "success":function(result){
            if("ok"==result.status){
                alert("create ok");
            }else{
            }
        },
        "error":function(){
        
        }
    });
};
page.ajax_getImageLibs=function(json){
    $.ajax({
        "type":"post",
        "url":"/ajax_getImageLibs",
        "dataType":"json",
        "data":{},
        "success":function(result){
            if("ok"==result.status){
                createList(result.data);
            }else{

            }
        },
        "error":function(){
        
        }
    });
    function createList(data){
        var Lib=page.Lib
            console.log(data.length);
        for(var i=0;i<data.length;i++){
            var lib=new Lib(data[i]);
            $(".libsBox").append(lib.body);
        } 
    }
}

page.Lib=(function(){
    function lib(json){
        this.initUI(json);
        this.createBar(json);
    }
    lib.prototype.initUI=function(json){
        var li=$("<li/>",{"class":"lib","text":json.name}); 
        this.body=li;
    }
    lib.prototype.createBar=function(json){
        var bar=page.LibBar;
            this.bar=new bar(this.body,json);
    }
    return lib;
})();
page.LibBar=(function(){
    function bar(tage,libJson){
        this.initUI(tage,libJson);
    }
    bar.prototype.initUI=function(tage,libJson){
        var div=$("<div/>",{"class":"bar"});
        var share=$("<a/>",{"class":"btnSmall publish","text":"公开"});
        var remove=$("<a/>",{"class":"btnSmall remove","text":"删除"});
        var setModle=$("<a/>",{"href":"/uploadImage?id="+libJson.id,"class":"btnSmall setModle","text":"添加模板"});
        var setImage=$("<a/>",{"class":"btnSmall upImage","text":"上传图片"});
            tage.append(div.append(share,remove,setModle,setImage));
            
    }
    return bar;
})();



