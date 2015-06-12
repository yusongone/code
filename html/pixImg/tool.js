var page={
  row:8,
  col:84,
  keyDown:false
};

$(document).ready(function(){

  $(document).keydown(function(event){
    if(17==event.keyCode){
      page.keyDown=true;
    }
  });

  $(document).keyup(function(event){
    if(17==event.keyCode){
      page.keyDown=false;
    }
  });

  $("#clean").click(function(){
    $(".pix").removeClass("active").attr("active",0);
    localStorage.clear();
  });

  var r=new R(1,$("#pixBox"));
  var r=new R(2,$("#pixBox"));
  var r=new R(3,$("#pixBox"));
  var r=new R(4,$("#pixBox"));
  var r=new R(5,$("#pixBox"));
  var r=new R(6,$("#pixBox"));

});



function R(id,tag){
 this.data;  
 this.id=id;
 this.body=$("<div/>",{class:"R"});
 this.rawBox=$("<textarea/>",{})
  $("#rowBoxList").append(this.rawBox);
var str=localStorage.getItem("Hex"+id);
  tag.append(this.body);
  this.renderPix();
 this.rawToPix(str);

  var that=this;
  this.rawBox.blur(function(){
    var str=$(this).val();
    that.rawToPix(str);
  });
}

R.prototype.tg= function(tag){
  var d=tag.attr("active");
  if(d=="1"){
    tag.removeClass("active");
    tag.attr("active","0");
  }else{
    tag.addClass("active");
    tag.attr("active","1");
  }
}
R.prototype.createRaw=function(){
  var Hex="";
  var Bin="";
  this.body.find(".col").each(function(){
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
    str=reSortBin(str);
    console.log(str);
    var intNum=parseInt(str,2);
    var f="0x"+intNum.toString(16);
    Bin+=str+",";
    Hex+=f+",";
  });
  localStorage.setItem("Hex"+this.id,Hex);
  this.rawBox.val(Hex);
}
function reSortBin(str){
  return str.split("").reverse().join("");
}

R.prototype.renderPix=function(tag){
  var that=this;
  for(var i=0;i<page.col;i++){
    var col=$("<div/>",{"class":"col"});
    for(var j=0;j<page.row;j++){
      var pix=$("<div/>",{"class":"pix"});
      col.append(pix);
      pix.click(function(){
        that.tg($(this));
        that.createRaw();
        return;
      });
      pix.mouseout(function(){
        if(!page.keyDown){
          return;
        }
        that.tg($(this));
        that.createRaw();
        return;
      });
    }
    this.body.append(col);
  }
}

R.prototype.rawToPix=function(rawStr){
  if(!rawStr){
    return;
  }
  var tempAry=rawStr.split(","); 
    tempAry.length=page.col;
    for(var i=0;i<tempAry.length;i++){
      var raw=parseInt(tempAry[i],16).toString(2);
      var subLength=8-raw.length;
      var s="";
      if(subLength>0){
        for(var j=0;j<subLength;j++){
          s+="0";
        }
      }
      var str=s+raw;
      str=reSortBin(str);
      this.binToPix(i,str);
    }
}

R.prototype.binToPix=function(index,str){
  for(var i=0;i<8;i++){
    if("1"==str[i]){
      this.body.find(".col").eq(index).find(".pix").eq(i).addClass("active").attr("active",1); 
    }else{
      this.body.find(".col").eq(index).find(".pix").eq(i).removeClass("active").attr("active",0); 
    }
  }
}

