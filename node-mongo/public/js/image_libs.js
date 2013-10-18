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
    }
    lib.prototype.initUI=function(json){
        var li=$("<li/>",{"class":"lib","text":json.name}); 
        this.body=li;
    }
    return lib;
})();



