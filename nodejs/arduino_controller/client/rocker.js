(function(factory){
    if(typeof(define)==="function"){
        define(factory);
    }else{
        window.R=window.R||{};
        factory(window.R);
    }

})(function(_rocker){
    !_rocker?_rocker={}:"";


    var GlobalLoop=(function(){
        var _handlers=[];
        var _running=false;

        function _loop(){
            for(var i=0;i<_handlers.length;i++){
                _handlers[i]();
            };
            requestAnimationFrame(_loop);
        }

        return {
            run:function(){
                if(!_running){
                    _loop();
                   _running=true;
                }
            },
            bindFrame:function(handler){
                _handlers.push(handler);
            }
        }
    })();

    var OSC=(function(){
        var canvas,ctx;
        var lines=[];
        var WIDTH=300,
            HEIGHT=500;
        var MAX_WIDTH=WIDTH;

        function _createCanvas(){
            canvas=document.createElement("canvas");
            canvas.width=WIDTH;
            canvas.height=HEIGHT;
            ctx=canvas.getContext("2d");
            var page=document.getElementsByClassName("page")[0];
            page.appendChild(canvas);
        }
        var update=false;


        function Line(option){
            this.option=option;
            this.points=[];
        }
        Line.prototype.update=function(value){
            this.points.length>MAX_WIDTH?this.points.shift():"";
            this.points.push(value);
            update=true;
        }
        Line.prototype.draw=function(ctx){
            ctx.save();
            ctx.beginPath()
            ctx.strokeStyle=this.option.color;
            for(var i=0;i<this.points.length;i++){
                i==0?ctx.moveTo(i,this.points[i]):ctx.lineTo(i,this.points[i]);
            }
            ctx.stroke();
            ctx.restore();
        }


        function _refresh(){
            if(!update){
                return;
            }
            update=false;
            ctx.clearRect(0,0,WIDTH,HEIGHT);
            for(var i=0;i<lines.length;i++){
                var l=lines[i]
                l.draw(ctx);
            }
        }


        return {
            init:function(){
                _createCanvas();
                GlobalLoop.bindFrame(_refresh)
                GlobalLoop.run();
            },
            getLine:function(option){
                var line=new Line(option);
                lines.push(line);
                return line;
            },
            refresh:_refresh
        }
    })();

    var DeviceSensor=(function(){
        var _handlers=[];
        var KX=new Kalman();
        var KY=new Kalman();
        var option={
            accAngle:{
                x:0,
                y:0
            },
            kalmanAngle:{
                x:0,
                y:0
            }
        };
        function Kalman(n){
            var C_0=1.0,
                Q_angle=0.001,
                Q_gyro=0.003,
                R_angle=0.5,
                q_bias=0.0,
                angle_err=0.0,
                PCt_0=0.0,
                PCt_1=0.0,
                E=0.0,
                K_0=0.0,
                K_1=0.0,
                t_0=0.0,
                t_1=0.0,
                angle=0.0,
                angle_dot=0.0,
                P=[[1.0,0.0],[0.0,1.0]];
            Pdot=[0.0,0.0,0.0,0.0];

            this.getAngle=function(angle_m, gyro_m,dt){
                angle+=(gyro_m-q_bias) * dt;
                angle_err = angle_m - angle;
                Pdot[0] = Q_angle - P[0][1] - P[1][0];
                Pdot[1] = -P[1][1];
                Pdot[2] = -P[1][1];
                Pdot[3] = Q_gyro;
                P[0][0] += Pdot[0] * dt;
                P[0][1] += Pdot[1] * dt;
                P[1][0] += Pdot[2] * dt;
                P[1][1] += Pdot[3] * dt;
                PCt_0 = C_0 * P[0][0];
                PCt_1 = C_0 * P[1][0];
                E = R_angle + C_0 * PCt_0;
                K_0 = PCt_0 / E;
                K_1 = PCt_1 / E;
                t_0 = PCt_0;
                t_1 = C_0 * P[0][1];
                P[0][0] -= K_0 * t_0;
                P[0][1] -= K_0 * t_1;
                P[1][0] -= K_1 * t_0;
                P[1][1] -= K_1 * t_1;
                angle += K_0 * angle_err;
                q_bias += K_1 * angle_err;
                angle_dot = gyro_m-q_bias;
                return angle;
            };
        };

        function _getACCAngle(x,y,z,dir){
            var nowY=Math.sqrt(x*x+z*z);
            var nowX=Math.sqrt(y*y+z*z);
            option.accAngle.x=dir*Math.atan(x/nowX)*57.2957786;
            option.accAngle.y=-dir*Math.atan(y/nowY)*57.2957786;
        }

        var func={
            android:function(event){
                option.acc = event.acceleration;
                option.accGravity = event.accelerationIncludingGravity;
                option.rotationRate = event.rotationRate;
                _getACCAngle(option.accGravity.x,option.accGravity.y,option.accGravity.z,-1);
                option.kalmanAngle.x=KX.getAngle(option.accAngle.x,option.rotationRate.beta*57.2957786,event.interval/this.t);
                option.kalmanAngle.y=KY.getAngle(option.accAngle.y,option.rotationRate.alpha*57.2957786,event.interval/this.t);
            },
            ios:function(event){
                option.acc = event.acceleration;
                option.accGravity = event.accelerationIncludingGravity;
                option.rotationRate = event.rotationRate;
                _getACCAngle(option.accGravity.x,option.accGravity.y,option.accGravity.z,1);
                option.kalmanAngle.x=KX.getAngle(option.accAngle.x,option.rotationRate.beta,event.interval);
                option.kalmanAngle.y=KY.getAngle(option.accAngle.y,option.rotationRate.alpha,event.interval);
            },
            doIt:function(event){
                var t=event.interval/0.01666666;
                this.t=t;
                if(t>900){
                    this.doIt=this.android;
                }else{
                    this.doIt=this.ios;
                }
            }
        };


        function _init(){
            window.addEventListener("devicemotion", function(event){
                event.preventDefault();
                func.doIt(event);
                _trigger(option);
            }, false);

            function _trigger(_option){
                for(var i=0;i<_handlers.length;i++){
                    _handlers[i](_option);
                }
            }
        }

        return {
            init:_init,
            onChange:function(handler){
                _handlers.push(handler);
            }
        }
    })();

    var RockerUI=(function(){

        function _draw(){
        }



        function _getScale(_canvas){
            return {
                x:_canvas.width/_canvas.clientWidth,
                y:_canvas.height/_canvas.clientHeight
            }
        }

        function _bindEvent(){
            var self=this;

            function foo(){};
            foo.prototype.start=function(event){
                this.handler=handler;
            }
            foo.prototype.handler=function(){};
            foo.prototype.end=function(){
                delete this.handler;
            }
            var f=new foo();

            var _Event={};

            function handler(event){
                _Event.x=event.offsetX*self.scale.x;
                _Event.y=event.offsetY*self.scale.y;
                for(var i=0;i<self._handlers.length;i++){
                    self._handlers[i](_Event);
                }
            }
            this.canvas.addEventListener("mousedown",function(event){
                event.preventDefault();
                event.stopPropagation();
                f.start(event);
            },false);
            this.canvas.addEventListener("mousemove",function(event){
                event.preventDefault();
                event.stopPropagation();
                f.handler(event);
            },false);
            this.canvas.addEventListener("mouseup",function(event){
                f.end(event);
            },false);

            var touchE={};
            this.canvas.addEventListener("touchstart",function(event){
                event.preventDefault();
                event.stopPropagation();
                touchE.offsetX=event.touches[0].pageX;
                touchE.offsetY=event.touches[0].pageY;
                f.start(touchE);
            },false);

            this.canvas.addEventListener("touchmove",function(event){
                event.preventDefault();
                event.stopPropagation();
                touchE.offsetX=event.touches[0].pageX;
                touchE.offsetY=event.touches[0].pageY;
                f.handler(touchE);
            },false);
            this.canvas.addEventListener("touchend",function(event){
                event.preventDefault();
                event.stopPropagation();
                touchE.offsetX=event.touches[0].pageX;
                touchE.offsetY=event.touches[0].pageY;
                f.end(touchE);
            },false);

        }

        function _bindUpdateHandler(){
            var self=this;
            var width=this.canvas.width;
            var height=this.canvas.height;
            var ctx=this.ctx;
            this.onChange(function(evt){
                self.finger.x=evt.x;
                self.finger.y=evt.y;
            });

            GlobalLoop.bindFrame(function(){
                ctx.clearRect(0,0,width,height);
                ctx.beginPath();
                ctx.rect(0,self.finger.y-15,100,30)
                ctx.stroke();
            });
            GlobalLoop.run();
        }

        function Rocker(options){
            this.canvas=document.createElement("canvas");
            this.canvas.width=300;
            this.canvas.height=500;
            this.canvas.style.width="100%";
            this.canvas.style.height="100%";
            //this.canvas.style.background="red";

            this.ctx=this.canvas.getContext("2d");
            this._handlers=[];
            this.finger={};
            options.parentDOM.appendChild(this.canvas);
            this.scale=_getScale(this.canvas);
            _bindUpdateHandler.call(this);
            _bindEvent.call(this);
        }

        Rocker.prototype.onChange=function(handler){
            this._handlers.push(handler);
        }

        return {
            getRocker:function(option){
                return new Rocker(option);
            }
        }

    })();


    _rocker.init=function(option){
        DeviceSensor.init();
        RockerUI.getRocker(option);
    };
    //_rocker.onChange=DeviceSensor.onChange;
    _rocker.onChange=function(handler){
        var _update=false;
        var temp={
            Angler:{
                x:0,
                y:0
            }
        };
        var bind={
            update:function(){
                _update=true;
            },
            handler:function(evt){
                temp.Angler=evt.kalmanAngle;
                this.handler=this.update;
            },
        };
        DeviceSensor.onChange(function(evt){
            bind.handler(evt);
        });

        GlobalLoop.bindFrame(function(){
            if(_update){
                handler(temp);
            }
        });
        GlobalLoop.run();
    }

    _rocker.showTest=function(){
        OSC.init();
        var line1=OSC.getLine({color:"red"});
        var line2=OSC.getLine({color:"blue"});
        var line3=OSC.getLine({color:"black"});
        DeviceSensor.onChange(function(evt){

            line1.update(100+evt.accAngle.x);
            line2.update(200+evt.kalmanAngle.x);
            /*

             line2.update(200+evt.rotationRate.beta*1.6);
             line2.update(200+evt.accAngle.y);
             line3.update(300+evt.kalmanAngle.x);

             line1.update(100+evt.rotationRate.alpha*100/1.6);
             line3.update(300+evt.rotationRate.gamma*5);
             line3.update(300+evt.kalmanAngle.z*5);
             */
        });
    }

    _rocker.getRocker=function(options){
        return new Rocker(options);
    }


    return _rocker;


});