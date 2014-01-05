/*
 *control lib customer.js
 * */

var db=require("../../db");
var parse=db.Common.parse;
var Type=db.Common.Type;
var getPool=db.Common.getPool;
var poolMain=getPool("main");
var Thumbnail=require("./thumbnail");

var _applyStudio=function(){

}


exports.applyStudio=_applyStudio;
