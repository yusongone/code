var db=require("../../db");
var fs=require("fs");
var Canvas=require("canvas");
    var Image=Canvas.Image;

var createThumbnail=function(buf){
    db.Common.getAuthenticationDatabase(function(err,database){
        var jsonReq={};
            jsonReq.database=database;
            jsonReq.cusInfoId="527fcc612413c7cf24000001";
            jsonReq.userId="";
            jsonReq.fileId="52802c98f5cd56e32c000001";
        db.Images.getImage(jsonReq,function(err,buf){
            testFs(buf);
        }); 
    });
}

function testFs(buf){
    var canvas=new Canvas(100,100);
    var img=new Image;
        img.src=buf;
        console.log(img);
    var ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0,50,50);
}
function save1(canvas,callback){
    var fs = require('fs')
        , out = fs.createWriteStream(__dirname + '/text.png')
        , stream = canvas.pngStream();

    stream.on('data', function(chunk){
          out.write(chunk);
    });

    stream.on('end', function(){
        callback("saved png");
    });
}

function save2(canvas){
    var out = fs.createWriteStream(__dirname + '/cropt1.png');
    var stream = canvas.createJPEGStream({
              bufsize : 2048,
              quality : 80
            });
        stream.pipe(out);
}




exports.createThumbnail=createThumbnail;

createThumbnail();
