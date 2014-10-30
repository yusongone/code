var emit=require("events").EventEmitter;

var test=new emit();

test.on("what",function(data){
  console.log("fefefe",data.a);
});


test.emit("what",{"a":"aaa"});
