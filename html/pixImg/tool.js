var page={
  row:8,
  col:20
};

$(document).ready(function(){
  createPix();
  var str=getData();
  rawToPix(str);
});


function tg(tag){
  var d=tag.attr("active");
  if(d=="1"){
    tag.removeClass("active");
    tag.attr("active","0");
  }else{
    tag.addClass("active");
    tag.attr("active","1");
  }
}


function createPix(){
  for(var i=0;i<page.col;i++){
    var col=$("<div/>",{"class":"col"});
    for(var j=0;j<page.row;j++){
      var pix=$("<div/>",{"class":"pix"});
      col.append(pix);
      pix.click(function(){
        tg($(this));
        createRaw();
      });
    }
    $("#pixBox").append(col);
  }
}

function getData(){
  var str=localStorage.getItem("Hex");
  console.log(str);
  return str;
}

function createRaw(){
  var Hex="";
  var Bin="";
  $(".page .col").each(function(){
    var col=$(this);
    var str="";
    col.find(".pix").each(function(){
      var status=$(this).attr("active");
      if(status==1){
        str+="1";
      }else{
        str+="0";
      }
    });
    var intNum=parseInt(str,2);
    var f="0x"+intNum.toString(16);
    Bin+=str+",";
    Hex+=f+",";
  });
  localStorage.setItem("Hex",Hex);
  $("#data").val(Hex);
}

function rawToPix(str){
  var tempAry=str.split(","); 
    tempAry.length=20;
    for(var i=0;i<tempAry.length;i++){
      var raw=parseInt(tempAry[i],16).toString(2);
      var subLength=8-raw.length;
      var s="";
      if(subLength>0){
        for(var j=0;j<subLength;j++){
          s+="0";
        }
      }
      binToPix(i,s+raw);
    }
    createRaw();
}

function binToPix(index,str){
  for(var i=0;i<8;i++){
    if("1"==str[i]){
      $(".page .col").eq(index).find(".pix").eq(i).addClass("active").attr("active",1); 
    }else{
      $(".page .col").eq(index).find(".pix").eq(i).removeClass("active").attr("active",0); 
    }
  }
}

