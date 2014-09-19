(function(context,factory){
    if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else {
    var template = {};
    factory(template);
    context.Template= template; // <script>
  }

})(window,function(Template){
    Template.newsLetter={};
    Template.newsLetter.byline={
        "zh_byline": "<h6 style='font-size: 12px; font-weight: normal; color: #999; margin: 4px 0 0; padding: 0;'><span style='font-size: 11px; text-transform: uppercase;'>{{byline}}</span></h6>",
        "en_byline": "<h6 style='font-size: 12px; font-weight: normal; color: #999; margin: 4px 0 0; padding: 0;'>{{byline}}</h6>"
    };
    Template.newsLetter.thumbnail= "<div style='width:75px;height:75px;float:right;margin-left:10px;'><img src='{{thumbnail.url}}' /></div>";
    Template.newsLetter.articleLi="<tr><td style='border-bottom: 1px solid #eee; padding: 15px 0 18px;'>"+
                        "<h5 style='font-weight: normal; font-size: 12px; color: #666; margin: 0 0 2px; text-transform: uppercase;'>{{kicker}}</h5>{{&DOM_thumbnail}}"+
                        "<h3 style='font-family: Georgia, Helvetica, Arial,Heiti SC, sans-serif; font-size: 18px; margin: 0; padding: 0;'><a href='{{host}}{{web_url}}' title='{{sf_headline}}' target='_blank'>{{sf_headline}}</a></h3>"+
                        "{{&DOM_byline}}"+
                        "<p style='font-size: 14px; line-height: 20px; margin: 4px 0 0; color: #333;'>{{summary}}</p>"+
                    "</td></tr>";




    
});
