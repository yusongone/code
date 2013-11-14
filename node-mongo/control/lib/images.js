var db=require("../../db");
var fs=require("fs");
var Canvas=require("canvas");
    var Image=Canvas.Image;

//获取图片
var _getImage=function(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        if(err){return callback(err);}
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if("creator"==result||"binder"==result){
                //get database
                //检查图片是否存在此Customer 库中；
                db.ImageLibs.checkImageInCustomer(jsonReq,function(err,result){
                    if(err){return callback(err);}
                    //null 此图片不存在此图片库中
                    if(result==null){return callback("no image")};
                    console.log(jsonReq.size);
                    if(jsonReq.size=="origin"){
                        db.Images.getImage(jsonReq,function(err,buf){
                            database.close();
                            callback(err,buf);
                        });
                        return;
                    }
                    /*
                    */
                    _getThumbnailImage(jsonReq,function(err,buf){
                        if(err){return callback(err)};
                        if(buf){
                            console.log("cache");
                            callback(err,buf);
                        }else{
                            console.log("crop");
                            getOriginalImage(jsonReq,function(err,buf){
                                callback(err,buf);
                            }); 
                        }
                    });
                });
            }else{
                callback("no permission");
            }
        });
    });
};
//获取缩略图
var _getThumbnailImage=function(jsonReq,callback){
    db.Common.getThumbnailDatabase(function(err,database){
        jsonReq.database=database;
        jsonReq.queryObj={
            "metadata.size":jsonReq.size,
            "metadata.originalImageId":jsonReq.fileId
        }
        db.Images.getImageInfo(jsonReq,function(err,imageInfo){
            if(err){return callback(err)};
            if(!imageInfo){return callback(err,null);}
            var id=imageInfo["_id"];
            jsonReq.fileId=id;
            //在缩略图数据库中获取图片
            db.Images.getImage(jsonReq,function(err,buf){
                database.close();
                if(err){return callback(err)};
                callback(err,buf);
            });
        });
    })
};
//把缩略图插入本地数据库
var _insertThumbnailToDB=function(jsonReq,callback){
    db.Common.getThumbnailDatabase(function(err,database){
        jsonReq.database=database;
        jsonReq.attr={
            "content_type":"image/png",
            "metadata":{
                "originalImageId":jsonReq.fileId,
                "size":jsonReq.size,
            },
            "chunkSize":jsonReq.buf.length
        }
        db.Images.uploadBuffer(jsonReq,function(err,result){
            console.log(jsonReq.attr,err,result);
            database.close();
            callback(err,result);
        });
    });
}
//获取原始图片
var getOriginalImage=function(jsonReq,callback){
    db.Common.getAuthenticationDatabase(function(err,database){
        jsonReq.database=database;
        db.Images.getImage(jsonReq,function(err,buf){
            database.close();
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

/*
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
*/


//exports.createThumbnail=createThumbnail;
//exports.getThumbnailImage=getThumbnailImage;
exports.getImage=_getImage;
