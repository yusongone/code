function main(){
    MyDocument.init();

    var red=MyDocument.createDOM({x:100,y:100,width:50,height:50,color:"red"});

    red.click(function(myEvent){
        myEvent.shutup();
        console.log("red");
    });

    var blue=MyDocument.createDOM({x:130,y:130,width:50,height:50,color:"blue"});
    blue.click(function(myEvent){
        myEvent.shutup();
        console.log("blue");
    });

    var polygon=MyDocument.createDOM({x:100,y:100,points:[{"x":286,"y":240},{"x":275,"y":274},{"x":210,"y":299},{"x":209,"y":366},{"x":256,"y":433},{"x":318,"y":426},{"x":328,"y":386},{"x":316,"y":349},{"x":376,"y":325},{"x":415,"y":337},{"x":428,"y":404},{"x":403,"y":458},{"x":488,"y":522},{"x":592,"y":560},{"x":598,"y":472},{"x":532,"y":432},{"x":588,"y":337},{"x":672,"y":365},{"x":655,"y":258},{"x":546,"y":266},{"x":523,"y":310},{"x":462,"y":246},{"x":409,"y":196},{"x":286,"y":240}]});


    MyDocument.click(function(){
        console.log("document");
    });
}











var MyDocument=(function(){

    var _domList=[];
    var _canvas=null,
        _ctx=null;
    var docmentHandler=[];

    function _createRect(){
        _ctx.save();
        _ctx.fillStyle=this.color;
        _ctx.beginPath();
        _ctx.rect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
        _ctx.fill();
        _ctx.closePath();
        _ctx.restore();
    }

    function _createPolygon(){
        _ctx.save();
        _ctx.fillStyle=this.color;
        _ctx.beginPath();
        _ctx.rect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
        _ctx.fill();
        _ctx.closePath();
        _ctx.restore();

    }

    function _DOM(options){
        this.x=options.x;
        this.y=options.x;
        this.color=options.color;
        if(options.points){
            this.width=options.width;
            this.height=options.height;
            _createPolygon.call(this);
        }else{
            _createRect.call(this);
        }
        var self=this;
        var _handlers={
            _fire:function(action,argAry){
                if(_handlers[action]){
                    for(var i= 0,l=_handlers[action].length;i<l;i++){
                        _handlers[action][i].apply(self,argAry);
                    }
                }
            }
        };
        this._handlers=_handlers;
    }
    _DOM.prototype._fire=function(action,argAry){
        this._handlers._fire(action,argAry);
    }
    _DOM.prototype.on=function(action,handler){
        if(!this._handlers[action]){
            this._handlers[action]=[];
        }
        this._handlers[action].push(handler);
    }
    _DOM.prototype.click=function(handler){
        this.on("click",handler);
    }

    function _createDOM(x,y,w,h,color){
        var dom= new _DOM(x,y,w,h,color);
        _domList.push(dom);
        return dom;
    }
    function _checkOver(coord,Sprite){
        if(2*Math.abs(coord.x-Sprite.x)<Sprite.width&&2*Math.abs(coord.y-Sprite.y)<Sprite.height){
            return true;
        }else{
            return false;
        }
    };

    var ary=[];
    function _bindCanvasEvent(canvas){
        canvas.addEventListener("click",function(evt){
            var x=evt.offsetX,y=evt.offsetY;
            ary.push({x:x,y:y});
            console.log(JSON.stringify(ary));
            var MyEvent={_speak:true};
                MyEvent.shutup=function(){
                    this._speak=false;
                }
            for(var l = -1,i=_domList.length-1;i>l;i--){
                var _dom=_domList[i];
                if(_checkOver({x:x,y:y},_dom)){
                    _dom._fire("click",[MyEvent]);
                    if(MyEvent._speak==false){
                        return;
                    };
                }
            }
            for(var i= 0,l=docmentHandler.length;i<l;i++){
                docmentHandler[i].apply(canvas);
            };
        });
    }

    return {
        createDOM:_createDOM,
        init:function(){
            _canvas=document.getElementById("myCanvas");
            _ctx=_canvas.getContext("2d");
            _canvas.height=window.innerHeight;
            _canvas.width=window.innerWidth;
            _bindCanvasEvent(_canvas);
        },
        click:function(handler){
            docmentHandler.push(handler);
        }
    }
})();
