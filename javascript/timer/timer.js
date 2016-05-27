(function(factory){
    if(typeof(define)=="function"){
        define(factory);
    }else{
        window.Timer=window.Timer||{};
        factory(Timer);
    }
})(function(timerObj){
    if(!timerObj){
        timerObj={};
    }
    var _timerLists=[],
        _loopStatus=false,
        _oldTime=null;


    function trigger(t){
        this._triggerHandler(t);
    }

    function _loop(){
        _loopStatus=true;
        requestAnimationFrame(function(t){
            !_oldTime?_oldTime=t:"";
            if(t-_oldTime>100){
                for(var i=0;i<_timerLists.length;i++){
                    trigger.call(_timerLists[i],t);
                }
                _oldTime=t;
            }
            _loop();
        })
    }

    function T(options){
        this.handlers=[];
        this.endHandlers=[];

        var tempAry=options.totalTime.split(":");
        var H=tempAry[0];
        var M=tempAry[1];
        var S=tempAry[2];
        this.totalTime=H*60*60*1000+M*60*1000+S*1000;
        this.wait=true;

    }

    T.prototype._triggerHandler=function(payTime,handler){
        if(payTime>this.totalTime){
            if(!this.wait){
                return;
            }
            this.wait=false;
            for(var i=0;i<this.endHandlers.length;i++){
                this.endHandlers[i]();
            }
            return;
        }
        for(var i=0;i<this.handlers.length;i++){
            var remainTime=this.totalTime-payTime+1000;
            var d=new Date(remainTime-8*60*60*1000);
            var ms=d.getMilliseconds().toString().substr(0,1);
            this.handlers[i](d.toTimeString().substr(0,8)+":"+ms,d);
        }
    }

    T.prototype.onFrame=function(handler){
        this.handlers.push(handler);
    }
    T.prototype.onEnd=function(handler){
        this.endHandlers.push(handler);
    }


    timerObj.createTimer=function(options){
        var tempTimer=new T(options);
        _timerLists.push(tempTimer);
        if(_timerLists.length>0&&!_loopStatus){
            _loop();
        }
        return tempTimer;
    };
    return timerObj;

});