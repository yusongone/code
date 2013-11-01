var page={};
$(document).ready(function(){
    page.bindEvent();
    page.ajax_getCusList();
});

page.bindEvent=function(){
    $("#add").click(function(){
        //page.ajax_addCustomer($("#customer_name").val());
        page.ajax_searchUser($("#customer_name").val());
    });
};

page.ajax_addCustomer=function(username){
    $.ajax({
        "type":"post",
        "url":"/ajax_addCustomer",
        "dataType":"json",
        "data":{"cusUsername":username},
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

page.ajax_searchUser=function(username){
    $.ajax({
        "type":"post",
        "url":"/ajax_searchUser",
        "dataType":"json",
        "data":{"keyword":username},
        "success":function(result){
            if("ok"==result.status){
                alert("create ok");
            }else{
            }
        },
        "error":function(){
        
        }
    });
}
page.ajax_getCusList=function(){
    $.ajax({
        "type":"post",
        "url":"/ajax_getCustomer",
        "dataType":"json",
        "success":function(data){
            if(data.length>0){
                var Lib=page.Lib
                for(var i=0;i<data.length;i++){
                    var lib=new Lib(data[i]);
                    $(".list").append(lib.body);
                } 
            }
        },
        "error":function(){
        
        }
    });
};

page.Lib=(function(){
    function lib(json){
        this.initUI(json);
        this.createBar(json);
    }
    lib.prototype.initUI=function(json){
        var li=$("<li/>",{}); 
            var name=$("<div/>",{"class":"td name","text":json.username});
            var cus=$("<div/>",{"class":"td tel","text":"--"});
            var date=$("<div/>",{"class":"td other","text":"--"});
            var play=$("<div/>",{"class":"td play"});
            li.append(name,cus,date,play);
        this.body=li;
        this.playBox=play;
    }
    lib.prototype.createBar=function(json){
        var bar=page.LibBar;
            this.bar=new bar(this.playBox,json);
    }
    return lib;
})();
page.LibBar=(function(){
    function bar(tage,libJson){
        this.initUI(tage,libJson);
        this.id=libJson.id;
    };
    bar.prototype.initUI=function(tage,libJson){
        var share=$("<a/>",{"text":"公开"});
        var remove=$("<a/>",{"text":"删除"});
        var setModle=$("<a/>",{"text":"添加模板"});
        var setImage=$("<a/>",{"href":"/b/manage_image/"+libJson.id,"target":"_blank","text":"管理图片"});
            tage.append(share,remove,setModle,setImage);
            this.bindEvent(share);
    };
    bar.prototype.bindEvent=function(share){
        var that=this;
            share.click(function(){
                alert(that.id);
            
            });
    };
    return bar;
})();

