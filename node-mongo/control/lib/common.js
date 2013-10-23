var parse={
    "strToBase64":function(str){
        var buf=new Buffer(str);
        return buf.toString("base64");
    },
    "base64ToStr":function(str64){
        var buf=new Buffer(str64,"base64");
        return buf.toString();
    }
}

exports.parse=parse;
