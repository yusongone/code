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
            var load=$("<i/>",{"src":src,"class":"fa fa-spinner fa-spin"});
            var img=$("<img/>",{"src":src});
                imgBox.append(load);
                img.load(function(){
                    load.remove();
                    imgBox.append(img);
                });

            imgBox.css({
                "width":w+"px",
                "height":h+"px",
                "margin-left":(-w/2)+"px",
                "margin-top":(-h/2)+"px"
            });
            return imgBox;
        }

        function slideshow(){
            this.images=[]; 
            this.showStatus=0;
            this.activeIndex=null;
            this.activeImgDOM=null;
            this.body=$("<div/>",{"class":"pageSS"});
            this.initUI(); 
        }
        _extend(slideshow,basic);
        slideshow.prototype.initUI=function(){
            var that=this;
            var close=$("<div/>",{"class":"fa fa-times-circle close"});
            this.content=$("<div/>",{"class":"slideCon"});
                var left=$("<i/>",{"class":"fa fa-chevron-left"});
            var prev=$("<div/>",{"class":"prev"}).append(left);
                var right=$("<i/>",{"class":"fa fa-chevron-right"});
            var next=$("<div/>",{"class":"next"}).append(right);;
            this.body.append(this.content,close,prev,next);
            
            close.click(function(){
                that.hide();
                that.content.html("");
            });

            prev.click(function(){
                that.to(++that.activeIndex); 
            });

            next.click(function(){
                that.to(--that.activeIndex); 
            });
            this.prev=prev;
            this.next=next;
        }
        slideshow.prototype.checkBtn=function(){
            var that=this;
                if(that.activeIndex>that.images.length-2){
                    that.prev.hide();
                }else{
                    that.prev.show();
                }
                if(that.activeIndex<1){
                    that.next.hide();
                }else{
                    that.next.show();
                }
         }
        slideshow.prototype.to=function(index){
            var that=this;
            this.activeIndex=index;
            var imagesDOM=_createPage.call(this,index);
            if(this.activeImgDOM){
            this.activeImgDOM.animate({"opacity":0},200,function(){
                that.content.html("").append(imagesDOM); 
            });
            }else{
                that.content.html("").append(imagesDOM); 
            }
            this.activeImgDOM=imagesDOM
            that.checkBtn();
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
