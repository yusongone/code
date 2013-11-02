console.log("abc");

var Common=(function(){
    var checkType=(function(){
        function _isNum(s)
        {
            if(s!=null){
                var r,re;
                re = /\d*/i; //\d表示数字,*表示匹配多个数字
                r = s.match(re);
                return (r==s)?true:false;
            }
            return false;
        }
        return {
            "isNum":_isNum
        }
    })();
    return {
    }
})();
