var pTop;
$(document).ready(function(){
   ajax_get($("#cusInfoId").val()); 
    pTop=$(".content").position().top;
});
var ajax_get=function(cusInfoId){
    console.log(cusInfoId);
    $.ajax({
        "type":"post",
        "url":"/getSelectImages",
        "datatype":"json",
        "data":{"cusInfoId":cusInfoId},
        "success":function(json){
            if("sorry"==json.status){alert(json.message);return false;};
            var data=json.data;
            var c=["a","b","c","d"];
            for(var i=0,l=data.length;i<l;i++){
                var id=data[i].fileId; 
                var img=$("<img/>",{"src":"/photo/"+cusInfoId+"/"+id+"?size=300"});
                var thu=$("<li/>",{"class":"thu"});
                console.log(i%4);
                $("."+c[i%4]).append(thu.append(img));

                var z=$("<ul class='signList'><li>A</li><li>B</li></ul>");
                thu.hover(function(){
                    $(this).append(z);
                },function(){
                    //z.remove();
                });
            };
        }
    });
};

$(window).scroll(function(evt){
    if($(this).scrollTop()>pTop){
        console.log("ff",pTop);
        $(".productBox").css({"position":"fixed","top":0});
    }else{
        $(".productBox").css({"position":"absolute","top":0});
    };
});

