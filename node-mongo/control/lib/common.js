var parse={
    "strToBase64":function(str){
        try{
            var buf=new Buffer(str);
            return buf.toString("base64");
        }catch(err){
            console.log("strToBase64 new buffer error");
            return false;
        }
    },
    "base64ToStr":function(str64){
        try{
            var buf=new Buffer(str64,"base64");
            return buf.toString();
        }catch(err){
            console.log("base64ToStr new buffer error");
            return false;
        }
    }
}

exports.parse=parse;
