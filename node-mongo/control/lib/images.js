var db=require("../../db");
var fs=require("fs");
var Canvas=require("canvas");
    var Image=Canvas.Image;

var createThumbnail=function(buf){
    db.Common.getAuthenticationDatabase(function(err,database){
        var jsonReq={};
            jsonReq.database=database;
            //jsonReq.cusInfoId="527fcc612413c7cf24000001";
            jsonReq.cusInfoId="527e8d558de43a4726000001";
            //jsonReq.fileId="52802c98f5cd56e32c000001";
            jsonReq.fileId="52838419d5c66f3f0e00000b";
        db.Images.getImage(jsonReq,function(err,buf){
            console.log(err,buf);
            //testFs(buf);
            crop({buf:buf,size:100},"a");
        }); 
    });
}
//获取缩略图
var getThumbnailImage=function(jsonReq,callback){
    db.Common.getThumbnailDatabase(function(err,database){
        jsonReq.database=database;
        jsonReq.queryObj={
            originalId:jsonReq.fileId
        }
        db.Images.getImageByQuery(jsonReq,function(err,imageInfo){
            if(err){return callback(err)};
            var id=imageInfo["_id"];
            jsonReq.fileId=id;
            db.Images.getImage(jsonReq,function(err,buf){
                if(err){return callback(err)};
                callback(err,buf);
            });
        });
    })
};
//获取原始图片
var getOriginalImage=function(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        db.Images.getImage(jsonReq,function(err,buf){
            if(err){return callback(err)};
            jsonReq.buf=buf;
            _crop(jsonReq,function(err,cropBuf){
                    
            });
        });
    });

}
//压缩图片
function crop(jsonReq,callback){
    var buf=jsonReq.buf;
    var size=jsonReq.size;
    var img=new Image;
        img.src=buf;
    var w=img.width, 
        h=img.height;
    if(w>h){
        smallW=size;
        smallH=(size/w)*h;
    }else{
        smallH=size;
        smallW=(size/h)*w;
    }
    var canvas=new Canvas(smallW,smallH);
    var ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0,smallW,smallH);
        canvas.toBuffer(callback);
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
    var out = fs.createWriteStream(__dirname + '/zcropt1.png');
    var stream = canvas.createPNGStream({
              bufsize : 2048,
              quality : 10
            });
        stream.pipe(out);
}



exports.createThumbnail=createThumbnail;
exports.getThumbnailImage=getThumbnailImage;

createThumbnail();
