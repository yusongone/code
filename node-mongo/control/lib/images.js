var db=require("../../db");
var fs=require("fs");
var Canvas=require("canvas");
    var Image=Canvas.Image;
var getPool=db.Common.getPool;
var poolMain=getPool("main");
var poolThumbnail=getPool("thumbnail");




var _deleteImage=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            if("creator"==result){
                db.ImageLibs.checkImageInCustomer(jsonReq,function(err,result){
                    if(err){ poolMain.release(database); return callback(err); }
                    if(null!=result){
                        db.Images.deleteImage(jsonReq,function(err,result){
                            if(err){ poolMain.release(database); return callback(err); }
                            db.ImageLibs.removeImageFromImagelibs(jsonReq,function(err,result){
                                if(err){ poolMain.release(database); return callback(err); }
                                    callback(err,result); 

                            
                            });
                        }); 
                    }else{
                        poolMain.release(database);
                        callback("no image");    
                    }
                });
            }else{
                callback("no permission");
            }

        });
    });

}



//获取图片
var _getImage=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        if(err){return callback(err);}
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,UserTitle){
            if(err){
                poolMain.release(database);
                return callback(err)
            };
            if("creator"==UserTitle||"binder"==UserTitle){
                //get database
                //检查图片是否存在此Customer 库中；
                db.ImageLibs.checkImageInCustomer(jsonReq,function(err,result){
                    if(err){
                        poolMain.release(database);
                        return callback(err);}
                    //null 此图片不存在此图片库中
                    if(result==null){
                        poolMain.release(database);
                        return callback("no image")
                    };
                    if(jsonReq.size=="origin"){
                        console.log(UserTitle);
                        if("creator"==UserTitle){
                            db.Images.getImage(jsonReq,function(err,buf){
                                poolMain.release(database);
                                callback(err,buf);
                            });
                        }else{
                            callback("you are not this image creator");
                        }
                        return;
                    }
                    poolMain.release(database);
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
            if(!imageInfo){
                poolThumbnail.release(database);
                return callback(err,null);
            }
            var id=imageInfo["_id"];
            jsonReq.fileId=id;
            //在缩略图数据库中获取图片
            db.Images.getImage(jsonReq,function(err,buf){
                poolThumbnail.release(database);
                if(err){return callback(err)};
                callback(err,buf);
            });
        });
    })
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
//获取原始图片
var getOriginalImage=function(jsonReq,callback){
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



exports.getImage=_getImage;
exports.deleteImage=_deleteImage;
