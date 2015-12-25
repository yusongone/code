
var io=require("socket.io")(9800);

io.on("connection",function(socket){
  socket.on("te",function(dd){
    console.log(dd);
  });
  console.log("you have a connection ...");
});
