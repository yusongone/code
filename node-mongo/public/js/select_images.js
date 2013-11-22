$(document).ready(function(){
   ajax_get($("#cusInfoId").val()); 
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
            for(var i=0,l=data.length;i<l;i++){
                var id=data[i].fileId; 
                var img=$("<img/>",{"src":"/photo/"+cusInfoId+"/"+id+"?type=fill"});
                var thu=$("<li/>",{"class":"thu"});
                $(".imageList").append(thu.append(img));
            };
        }
    });
};
