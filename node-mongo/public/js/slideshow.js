var SlideShow=window.slideShow||(function(){
    function _extend(sub,sup){
        function temp(){}; 
        temp.prototype=sup.prototype;
        temp.constructor=sub;
        sub.prototype=new temp();
    }


    var basic=(function(){
        function slideshow(){
            
        } 
        slideshow.prototype.init=function(){
        
        }
        return slideshow;
    })();

    var pageSS=(function(){
        function _createPage(index){
            var images=this.images[index];
            var imgBox=$("<div/>",{"class":"imgBox"});      
            var src=images.src||"";
            var max=images.max||600;
            var oriHeight=images.height;
            var oriWidth=images.width;
            if(oriHeight>oriWidth){
                w=(max/oriHeight)*oriWidth;
                h=max;
            }else{
                h=(max/oriWidth)*oriHeight;
                w=max;
            }
            var img=$("<img/>",{"src":src});

            imgBox.css({
                "width":w+"px",
                "height":h+"px",
                "margin-left":(-w/2)+"px",
                "margin-top":(-h/2)+"px"
            });
            imgBox.append(img);
            return imgBox;
        }

        function slideshow(){
            this.images=[]; 
            this.showStatus=0;
            this.active=null;
            this.body=$("<div/>",{"class":"pageSS"});
            this.initUI(); 
        }
        _extend(slideshow,basic);
        slideshow.prototype.initUI=function(){
            var that=this;
            var close=$("<div/>",{"class":"fa fa-close-o close"});
            this.content=$("<div/>",{"class":"slideCon"});
            this.body.append(this.content,close);

            close.click(function(){
                that.hide();
            });
        }
        slideshow.prototype.to=function(index){
            var images=_createPage.call(this,index);
            this.content.html("").append(images); 
        }
        slideshow.prototype.hide=function(index){
                this.body.hide();
                $("body").removeClass("slideBody");
        }
        slideshow.prototype.show=function(index){
            if(this.showStatus){
                this.body.show();
                $("body").addClass("slideBody");
                return this;
            }
            var that=this;
            this.showStatus=1;
            $("body").addClass("slideBody").append(this.body); 
            return this;
        }
        return slideshow;
    })();






    return {
        getPageSS:function(json){
            var ss=new pageSS();
                ss.images=json.images;
                return ss;
        }
    }
})();
