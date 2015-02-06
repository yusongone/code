function getCode(code){
  var buffer=new Buffer(code.length);
  for(var i=0;i<code.length;i++){
    var ascii=code[i].charCodeAt(0);
    buffer.writeInt8(ascii,i);
  }
  return buffer;
}
//console.log(getCode("$M>"));
var buffer=getCode("$M>");
for(var i=0;i<buffer.length;i++){
  var z=buffer.readInt8(i).toString(10);
  var d=String.fromCharCode(z);
  console.log(d);
}

//var d={{ROCKER:[100,20,50]}}
//var d=$M>178


