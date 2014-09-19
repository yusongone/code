var NYT={};
    NYT.isChina=function(s){  //判断字符是否是中文字符 
        var patrn= /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi; 
        if (!patrn.exec(s)) 
            { 
                return false; 
            }else{ 
                return true; 
            } 
    } 
