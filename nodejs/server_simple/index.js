var http=require("http");


http.createServer(function(req,res,next){
console.log(req.session);
	switch(req.url){
		case "/":
			res.write("abc");
			res.end();
		break;
		case "/test":
			res.write("test");
			res.end();
		break;
		default:
			res.write("default");
			res.end();
		break;
	}
}).listen(4004);
