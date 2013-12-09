var db=require("../../db");
var fs=require("fs");
var Canvas=require("canvas");
    var Image=Canvas.Image;
var getPool=db.Common.getPool;
var poolMain=getPool("main");
var poolThumbnail=getPool("thumbnail");

//获取缩略图
var _getThumbnailImage=function(jsonReq,callback){
    poolThumbnail.acquire(function(err,database){
        jsonReq.database=database;
        jsonReq.queryObj={
            "metadata.size":jsonReq.size,
            "metadata.originalImageId":jsonReq.fileId,
            "metadata.type":jsonReq.imageType
        }
        db.Images.getImageInfo(jsonReq,function(err,imageInfo){
            if(err){
                poolThumbnail.release(database);
                return callback(err)
            };
            if(!(imageInfo&&imageInfo[0])){
                poolThumbnail.release(database);
                return _getOriginalImageAndCrop(jsonReq,function(err,buf){
                    callback(err,buf);
                }); 
            }
            var id=imageInfo[0]["_id"];
            jsonReq.fileId=id;
            //在缩略图数据库中获取图片
            db.Images.getImage(jsonReq,function(err,buf){
                poolThumbnail.release(database);
                if(err){return callback(err)};
                if(buf){
                    console.log("cache");
                    callback(err,buf);
                }else{
                    console.log("crop");
                    _getOriginalImageAndCrop(jsonReq,function(err,buf){
                        callback(err,buf);
                    }); 
                }
            });
        });
    });
};

//把缩略图插入本地数据库
var _insertThumbnailToDB=function(jsonReq,callback){
    poolThumbnail.acquire(function(err,database){
        jsonReq.database=database;
        jsonReq.attr={
            "metadata":{
                "originalImageId":jsonReq.fileId,
                "size":jsonReq.size,
                "type":jsonReq.imageType
            }
        }
        db.Images.uploadBuffer(jsonReq,function(err,result){
            poolThumbnail.release(database);
            callback(err,result);
        });
    });
}


//
var removeThumbnailByOriginId=function(jsonReq){
    poolThumbnail.acquire(function(err,database){
        jsonReq.database=null;
        jsonReq.database=database;
        jsonReq.queryObj={
            "metadata.originalImageId":jsonReq.fileId
        }
        db.Images.getImageInfo(jsonReq,function(err,imageInfo){
            var l=imageInfo.length;
            var z=0;
            for(var i=0;i<l;i++){
                jsonReq.fileId=imageInfo[i]["_id"];
                db.Images.deleteImage(jsonReq,function(err,result){
                    z++;
                    console.log("remove a thumbnail");
                    if(z==l){
                        poolThumbnail.release(database);
                        console.log("remove all thumb");
                    }
                });
            }
        });
    });
}




//获取原始图片
var _getOriginalImageAndCrop=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Images.getImage(jsonReq,function(err,buf){
            poolMain.release(database);
            if(err){return callback(err)};
            jsonReq.buf=buf;
            _crop(jsonReq,function(err,cropBuf){
                if(err){return callback(err)};
                callback(err,cropBuf);
                jsonReq.buf=cropBuf;
                _insertThumbnailToDB(jsonReq,function(err,doc){
                    console.log(err,"create a new Thu image");
                });
            });
        });
    });
}
//压缩图片
function _crop(jsonReq,callback){
    var buf=jsonReq.buf;
    var size=parseInt(jsonReq.size)||100;
    var img=new Image;
        img.src=buf;
    var w=img.width, 
        h=img.height;
    var smallH,smallW;
        if(jsonReq.imageType=="fill"){
            var canvas=new Canvas(size,size);
            var ctx=canvas.getContext("2d");
            if(w>h){
                smallH=size;
                smallW=(size/h)*w;
                ctx.drawImage(img,-(smallW-size)/2,0,smallW,smallH);
            }else{
                smallW=size;
                smallH=(size/w)*h;
                ctx.drawImage(img,0,-(smallH-size)/2,smallW,smallH);
            }
        }else{
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
        }
        canvas.toBuffer(callback);
}


function testFs(buf){
    var canvas=new Canvas(100,100);
    var img=new Image;
        img.src=buf;
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



exports.getThumbnailImage=_getThumbnailImage;
exports.removeThumbnailByOriginId=removeThumbnailByOriginId;
