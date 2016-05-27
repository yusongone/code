//$("body").attr("background","red");
var loading=$("<span/>",{"class":"spider_loading","text":"Loading..."});
var content=$("<div/>",{"class":"spider_content"});
  $(".spider_transBox").remove();
  var div=$("<div/>",{"class":"spider_transBox"}); 
   div.append(loading,content);
   $("body").append(div);
   div.animate({"top":"0"},200);
   $(document).click(function(){
    $(".spider_transBox").remove();
   });
  $(".spider_transBox").click(function(){
    return false;
  });
chrome.extension.onMessage.addListener(function(request, sender, response) {
    loading.remove();
    var data=request.data;
    if(data&&!data.status){
      createTransUI(data);
    }else if(data&&data.message=="login time out"){
      content.append("请在打开页面中登陆");
    }
});


function createTransUI(data){
  var query=$("<div/>",{"class":"spider_query","text":data.query})
  if(data.basic&&data.basic.explains){
    var explains=data.basic.explains;
    var url=$("<ul/>",{"class":"spider_explains"});
    for(var i=0;i<explains.length;i++){
      var li=$("<li/>",{"text":explains[i]});
      url.append(li);
    }
    content.append(query,url);
  }
  if(data.web){
    var web=$("<div/>",{"class":"spider_web"});
    for(var i=0;i<data.web.length;i++){
      var kv=data.web[i];
        var webTitle=$("<div/>",{"class":"spider_web_title","text":kv.key})
        var objUrl=$("<ul/>",{"class":"spider_web_child"});
        for(var j=0;j<kv.value.length;j++){
            var objLi=$("<li/>",{"text":kv.value[j]});
            objUrl.append(objLi);
        }
        web.append(webTitle,objUrl);
    }
    content.append(web);
  }
}


