var ejs=require("ejs");
var fs=require("fs");
var ctrl=require("../../control");
var config=require("../../config.json");

function checkLogind(req,res,type,path){
    if(req.session.username){
        return true;
    }else{
        if("get"==type){
            var path=path?"?path="+path:"";
            res.redirect("/login"+path);
        }else{
            res.send({"status":"sorry","message":"用户登录已经超时，请重新登录！"});
            return false;
        }
    }
}

function checkStudio(req,res,type){
    if(req.session.studioId){
        return true;
    }else{
        if("get"==type){
            res.redirect("/applystudio");
        }else{
            res.send({"status":"sorry","message":"您还未申请工作室，请先申请。"});
            return false;
        }
    }
}

exports.checkLogind=checkLogind;
exports.checkStudio=checkStudio;
exports.ejs=ejs;
exports.fs=fs;
exports.ctrl=ctrl;
exports.config=config;
