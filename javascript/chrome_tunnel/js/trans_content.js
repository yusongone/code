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

function trans(origin_text){
    var text;
    text=origin_text.replace(/,/g," , ");
    text=text.replace(/\./g," . ");
    text=text.replace(/\;/g," ; ");
    text=text.replace(/\'/g," ' ");
    text=text.replace(/\"/g,' " ');
    var ary = getClearWord(text);
    for(var i = 0; i < ary.length; i++){
      var a=ary[i];
      var Rex=new RegExp(" "+a+" ","g");
      text=text.replace(Rex," {"+a+"} ");
    }
      text=text.replace(/{/g,"<strong>");
      text=text.replace(/}/g,"</strong>");
    loading[0].innerHTML=text;
    loading.find("strong").click(function(){
      loading.find("strong").removeClass("big");
      $(this).addClass("big");
      var word=$(this).text();
alert(word);
    });
  }

function getClearWord(text){
    var basicAry=text.split(",");
    var ary=[];
    for(var i=0;i<basicAry.length;i++){
      var tempAry=basicAry[i].split(" ");
      for(var j=0;j<tempAry.length;j++){
        var space_32=String.fromCharCode(32);
        var space_160=String.fromCharCode(160);
        if(tempAry[j]&&tempAry[j]!="."&&tempAry[j]!=space_32&&(tempAry[j]!=space_160)){
          ary.push(tempAry[j]);
        }
      }
    }
    window.ary=ary;
    return ary;
}

chrome.extension.onMessage.addListener(function(request, sender, response) {
    if(request.action=="Trans"){
      trans(" "+request.q+" ");
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


