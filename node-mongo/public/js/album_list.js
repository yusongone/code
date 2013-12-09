var page={};
$(document).ready(function(){
    page.ajax_getAlbumList();
    page.initAddAlbumBox.init();
    page.bindEvent();
});
page.bindEvent=function(){
    $("#addAlbum").click(function(){
        page.initAddAlbumBox.open();  
    });
};
page.addAlbum=function(json){
    $.ajax({
        type:"post",
        url:"/createAlbum",
        data:json,
        dataType:"json",
        success:function(data){
            console.log(data); 
        }
    });
}


page.ajax_getAlbumList=function(){
    $.ajax({
        type:"post",
        url:"/getAlbumList",
        dataType:"json",
        success:function(data){
            if(data.status=="ok"){
                var ary=data.data;
                for(var i=0;i<ary.length;i++){
                    new page.album(ary[i]);
                }
            }
        }
    });
}

page.ajax_removeAlbum=function(json){
    $.ajax({
        type:"post",
        url:"/removeAlbum",
        data:json,
        dataType:"json",
        success:function(data){
            console.log(data); 
        }
    });
}

page.ajax_changeAlbum=function(){
    var json={};
        json.albumId="5299f388167c2ace3c000001";
        json.name="test";
    $.ajax({
        type:"post",
        url:"/changeAlbum",
        data:json,
        dataType:"json",
        success:function(data){
            console.log(data); 
        }
    });
}


//
page.album=(function(){

    function album(json){
        this.body=$("<li/>",{"class":"album"});
        $(".albumList").append(this.body);
        this.initUI(json);
    }
    album.prototype.initUI=function(json){
        var htmlStr="<a href='/album/"+json._id+"'>"+
            "<div class='imgBox'>"+
                "<img src='/album_photo/"+json._id+"/"+json.img+"?type=fill'>"+
            "</div>"+
            "<div class='name textOver'>"+(json.name||"--")+"</div>"+
            "<div class='count'>"+(json.count||"0")+"</div>"+
            "<div class='date'>"+(json.createDate||"--")+"</div>"+
            "<div class='remove fa fa-remove'></div>";
            "</a>"
        this.body.append(htmlStr);

        this.body.find(".remove").click(function(){
            var jsonReq={};
                jsonReq.albumId=json._id;
                if(confirm("确定要删除相册内所有照片？")){
                    page.ajax_removeAlbum(jsonReq);
                }
            return false;
        
        });
    }
    return album;
})();

page.initAddAlbumBox=(function(){
    var div=$("<div/>",{});
    var htmlStr="<div class='toolbox'>"+
                "<label>名称</label>"+
                "<input class='text' id='name'/>"+
                "<div class='btnBlue add'>添加</div>"+
                "</div>";
        div.append(htmlStr);

        div.find(".add").click(function(){
            var jsonReq={};
                jsonReq.name=div.find("#name").val();
            page.addAlbum(jsonReq);
        });

    return {
        init:function(){
            div.dialog({
                modal: true,
                width:350,
                autoOpen:false
            });
        }
        ,open:function(){
            div.dialog("open");
        }
    }
})();

















