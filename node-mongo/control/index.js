var db=require("../db/client");
var parse=require("./lib/common").parse;

var imageLibs={
    getImageLibs:function(username,callback){
        db.ImageLibs.getImageLibs(username,function(json){
            var da=json.data;
            var tempAry=[];
            for(var i=0,l=da.length;i<l;i++){
                var z={
                    "name":da[i].name,
                    "id":parse.strToBase64(da[i]._id.toString())
                }
                tempAry.push(z);
            }
            callback({"status":"ok","data":tempAry});
        }); 
    },
    createImageLibs:function(json,callback){
        db.ImageLibs.createImageLibs(json,callback); 
    }
    ,uploadImage:function(json,callback){
        json.strId=parse.base64ToStr(json.libId);
        console.log("cc",json.strId);
        db.ImageLibs.uploadImage(json,function(data){
            callback(data);
        });
    }
    ,getImage:function(id,callback){
       // var strId=parse.base64ToStr(json.fileId);
        db.ImageLibs.getImage(id,function(data){
            callback(data);
        });
    }
    ,getImagesByLibId:function(id,callback){
        var strId=parse.base64ToStr(id);
        db.ImageLibs.getDatasByLibId(strId,function(item){
            console.log(item);
            callback(item.images);
        });
    }
}
exports.ImageLibs=imageLibs;
