var http=require("http");
http.createServer(function(req,res,next){
  console.log(req.files);
  res.write("fed");
  res.end();
}).listen(8800);
