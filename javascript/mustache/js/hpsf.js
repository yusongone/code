var page={};
require.config({
    baseUrl:"/js/", 
    paths:{
            "mustache":"/js/mustache"
            ,"NYT":"/js/common"
            ,"template":"/template/common"
          },
    shim:{
//      'webtrends':['jquery','commonnew'],
         }
});
requirejs(["jquery","NYT","mustache","template"], function($,NYT,Mustache,Template) {
    window.Mustache=Mustache;
    $(document).ready(function(){
        page.getPageData();
    });
});

page.getPageData=function(){
   $.ajax({
        url:"/data/section.json",         
        type:"get",
        dataType:"json",
        success:function(data){
            createArticle(data.article_list);
        }
    }); 
};
function createArticle(articleList){
   for(var i=0;i<articleList.length;i++){
        var temp=articleList[i];
        var key=NYT.isChina(temp.byline)?"en_byline":"zh_byline";
            console.log(key);
            temp.DOM_byline=Mustache.render(Template.newsLetter.byline[key],temp);
            temp.thumbnail?temp.DOM_thumbnail=Mustache.render(Template.newsLetter.thumbnail,temp):"";
            temp.host="http://cn.nytimes.com"
           var out=Mustache.render(Template.newsLetter.articleLi,temp);
            if(i>2){
                $("#articleList2").append(out);
            }else{
                $("#articleList1").append(out);
            }
    } 
}

