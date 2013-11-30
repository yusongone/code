var page={};
$(document).ready(function(){

});

page.addAlbum=function(){
    var json={};
        json.name="abc";
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
            console.log(data); 
        }
    });
}

page.ajax_removeAlbum=function(){
    var json={};
        json.albumId="5299f160753df7b33c000003";
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
