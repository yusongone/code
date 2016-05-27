;(function(factory){
    "use"
    if(typeof(define)=="function"){
        define(factory);
    }else{
        window.Schart=window.Schart||{};
        factory(Schart);
    }
})(function(obj){
    !obj?obj={}:"";

    var DefsFactory={

        getLinearColor:function(svgContent){
            /*
             <defs>
             <linearGradient id="lineChart--gradientBackgroundArea" x1="0" x2="0" y1="0" y2="4">
             <stop class="lineChart--gradientBackgroundArea--top" offset="0%"></stop>
             <stop class="lineChart--gradientBackgroundArea--bottom" offset="100%"></stop>
             </linearGradient>
             </defs>
             */
            var defs = svgContent.append('svg:defs');
            var l=defs.append("linearGradient");
            l.attr("id","linearColor")
            l.attr("class","linear_color")
                .attr("x1",0)
                .attr("y1",0)
                .attr("x2",0)
                .attr("y2",1);
            var stop1=l.append("stop");
            stop1.attr("style","stop-color:rgb(119,202,202);stop-opacity: 0.1;");
            stop1.attr("offset","0%");
            var stop2=l.append("stop");
            stop2.attr("style","stop-color:rgb(119,202,202);stop-opacity: 0.5;");
            stop2.attr("offset","100%");
        }
    }

    var _ChartObj=(function(){

        function Chart(options){
            this._parentDom=options.parentDom;
            this.width=options.width;
            this.height=options.height;
            this.dataFilter=options.filter;
            this.range=options.range;

            this.svg=d3.select(this._parentDom).append("svg");
            this.svg.attr("width",this.width);
            this.svg.attr("height",this.height);

            this.viewOffset=options.viewOffset||[0,0];


            this.viewArea=this.svg.append("g");
            this.viewArea.attr('transform',"translate("+this.viewOffset[0]+","+this.viewOffset[1]+")");
        };
        Chart.prototype.getFilterData=function(data){
            var temp=[];
            for(var i = 0; i<data.length; i++){
                temp.push( this.dataFilter(data[i]));
            }
            return temp;
        };
        Chart.prototype.test=function(child){
        };

        Chart.extends=function(child){
            var temp=function(){};
            temp.prototype=Chart.prototype;
            temp.constructor=child.constructor;
            child.prototype=new temp();
        };

        return Chart;
    })();

    obj.BarChart=(function(){

        function _draw(){
            var self=this;
            var rects=this.svg.selectAll("rect").data(this._AryData).enter().append("rect");

                rects.attr("width",function(d,index){
                    return self.Scale(d);
                });
                rects.attr("height",function(d,index){
                    return (self.height/self._AryData.length);
                });
                rects.attr("x",function(d,index){
                    return 0;
                });
                rects.attr("y",function(d,index){
                    return index*(self.height/self._AryData.length);
                });
                rects.attr("fill","#87EFFF");
                rects.attr("stroke","#ddd");
                rects.attr("stroke-width","1px");
                rects.datum(self._AryData);
                rects.each(function(d,i){
                    var self=this;
                    (function(index){
                        d3.select(self).on("mouseover",function(a,b){
                            console.log(a[index]);
                        });
                    })(i);
                });

            this.rects=rects;
        }

        function _animateUpdate(data){
            //this.datum(data);
            var self=this;
            this.rects.transition().duration(1000).attrTween("width",function(ary,index){

                var fun=d3.interpolateArray(ary,data);
                function comm(t){
                    return fun(t)[index];
                }

                return function(t){
                    return self.Scale(comm(t));
                }

            }).each("end",function(ary,index){
                if(index==ary.length-1){
                    self.rects.datum(data);
                }
            });
        }


        function _barChart(options){
            _ChartObj.call(this,options);
            this._AryData=this.getFilterData(options.data);
            this.initScale();
            _draw.call(this);
        }
        _ChartObj.extends(_barChart);
        _barChart.prototype.initScale=function(){
            var aryRange=d3.extent(this._AryData,function(d,index){
                return d;
            });
            this.Scale=d3.scale.linear();
            this.Scale.domain(this.range||[0,aryRange[1]]);
            this.Scale.range([0,this.width]);
        }

        _barChart.prototype.updateData=function(data){
            _animateUpdate.call(this,data);
        }

        return {
            VChart:null,
            HChart:_barChart
        };
    })();

    obj.LineChart=(function(){

        function _drawRuler(){
            var leftCreator=this.viewArea.append("g");
            var lRulerSoul=d3.svg.axis().scale(this.VScale).orient("left");
                lRulerSoul.tickFormat(function(a,b,c){
                    return (a/100)+"百";
                });
                lRulerSoul.innerTickSize(10);
                lRulerSoul.ticks(this.leftRuler.ticks);

                leftCreator.call(lRulerSoul);
                leftCreator.attr("transform", "translate("+this.leftRuler.size+",0)");
                leftCreator.attr("fill-width","1px");
                leftCreator.attr("stroke","none");
                leftCreator.attr("fill","#999");
                leftCreator.select(".domain").attr("style","display:none;");
                leftCreator.selectAll("line").attr("style","display:none;");

            var bottomCreator=this.viewArea.append("g");
            var bRulerSoul=d3.svg.axis().scale(this.HScale).orient("bottom");
                bRulerSoul.tickFormat(function(a,b,c){
                    return a+"个";
                });
                bRulerSoul.innerTickSize(10);
                bRulerSoul.ticks(this.bottomRuler.ticks);
                bottomCreator.attr("transform", "translate("+this.leftRuler.size+"," +(this.finalheight)+ ")");
                bottomCreator.attr("fill-width","1px");
                bottomCreator.attr("stroke","none");
                bottomCreator.attr("fill","#999");
                bottomCreator.call(bRulerSoul);
                bottomCreator.select(".domain").attr("style","display:none;");
                bottomCreator.selectAll("line").attr("style","display:none;");
        }

        function _drawBackLine(){
            var self=this;
            var lineBox=this.viewArea.append("g");

            var h=this.height-this.bottomRuler.size-this.viewOffset[1];
            var count=this.leftRuler.ticks;
            var step=h/count;
            var tempAry=[];
            for(var i=0;i<count;i++){
                tempAry.push( [ {x:0,y:i} , {x:this.domainH[1],y:i} ] );
            }
            var VScale=this.VScale;
            var HScale=this.HScale;

            var lineSoul= d3.svg.line();
                lineSoul.x(function(item,index){
                    var t=HScale(item.x);
                    return t;
                });
                lineSoul.y(function(item,index){
                    return item.y*step;
                });

            var allLine=lineBox.selectAll("path").data(tempAry).enter().append("path");
                allLine.attr("transform","translate("+this.leftRuler.size+",0)");
                allLine.attr("d",lineSoul);
                allLine.attr("stroke-width","1px");
                allLine.attr("stroke","#ddd");
                allLine.attr("fill","none");
        }

        function _drawTip(data){
            var self=this;
            if(!this.tipBox){
                var tipBox=this.viewArea.append("g");
                tipBox.attr("transform","translate("+this.leftRuler.size+",0)");
                this.tipBox=tipBox;
            }else{
                var tipBox=this.tipBox;
            }

            tipBox.attr("transform",function(d){
                var x=self.HScale(d.x)+20;
                var y=self.VScale(d.y)+5;
                if(x>self.finalWidth-(size+50)){
                    x-=(size+20);
                }
                return "translate("+x+","+y+")";//计算每个弧形的中心点（几何中心）
            });


            var bg=tipBox.append("rect");
                bg.attr({
                    fill:"#fff",
                    width:120,
                    height:200
                });
            var info=tipBox.append("text");
            info.datum(data);
            info.text(data.y);
            var size=data.y.toString().length*14;
            info.style("font-size",12);
            info.attr("fill","#000");
            info.attr("text-anchor","left");//or middle
            return info;
        }

        function _drawCircle(){
            var tempTip=null;
            var self=this;
            var VScale=this.VScale;
            var HScale=this.HScale;
            var circleBox=this.viewArea.append("g");
            circleBox.attr("transform","translate("+this.leftRuler.size+",0)");
            var circles=circleBox.selectAll("circle").data(this._AryData).enter().append("circle");
                circles.attr("r",5);
                circles.attr("stroke-width","3px");
                circles.attr("stroke","rgb(57,113,231)");
                circles.attr("fill","#fff");
                circles.attr("cx",function(item,index){
                    return HScale(item.x);
                });
                circles.attr("cy",function(item,index){
                    return VScale(item.y);
                });
                circles.on("mouseover",function(item,index){
                    var tempD=d3.select(this);
                        tempD.attr("fill","rgb(57,113,231)");
                    tempTip=_drawTip.call(self,item[index]);
                });
                circles.on("mouseout",function(item,index){
                    d3.select(tempTip[0][0]).remove();
                    var tempD=d3.select(this);
                    tempD.attr("fill","#fff");
                });
            this.circles=circles;
            this.circles.datum(self._AryData);
        }

        function _draw(){
            var self=this;
                _drawBackLine.call(this)
                _drawRuler.call(this)

            var waveSoul= d3.svg.line();
            var lineBox=this.viewArea.append("g");
            var VScale=this.VScale,
                HScale=this.HScale;

                waveSoul.interpolate( 'linear' );
                waveSoul.x(function(item,index){
                    return HScale(item.x);
                });
                waveSoul.y(function(item,index){
                    return VScale(item.y);
                });


                var area = d3.svg.area();
                area.interpolate( 'linear' );
                area.x( function(item,index ){
                    return HScale(item.x);
                });
                area.y0(VScale(0));
                area.y1(function(item ) {
                    return VScale(item.y);
                });

            var wave=lineBox.append("path");
                wave.datum(this._AryData);
                wave.attr("stroke-width","2px");
                wave.attr("stroke","rgb(57,113,231)");
                wave.attr("fill","none");
                wave.attr("transform","translate("+this.leftRuler.size+",0)");
                wave.attr("d",waveSoul);
                wave.__Soul=waveSoul;

            var bg=lineBox.append("path");
                bg.datum(this._AryData);
                bg.attr("stroke","none");
                bg.attr("fill","red");
                bg.attr("transform","translate("+this.leftRuler.size+",0)");
                bg.attr("d",area);
                bg.attr("fill","url(#linearColor)");
                bg.__Soul=area;

            _drawCircle.call(this)
            this.wave=wave;
            this.bg=bg;
        };

        function _animateUpdate(data){
            //this.datum(data);
            var self=this;
            var soul=this.wave.__Soul;
            this.wave.transition().duration(1000).attr("d",soul(data))
            /*
            this.wave.transition().duration(1000).attrTween("d",function(ary,index){
                var fun=d3.interpolateArray(ary,data);
                function comm(t){
                    return fun(t);
                }
                return function(t){
                    return soul(comm(t));
                }
            }).each("end",function(ary,index){
                self.wave.datum(data);
            });
            */

            var bgSoul=this.bg.__Soul;
            this.bg.transition().duration(1000).attrTween("d",function(ary,index){
                var fun=d3.interpolateArray(ary,data);
                function comm(t){
                    return fun(t);
                }
                return function(t){
                    return bgSoul(comm(t));
                }
            }).each("end",function(ary,index){
                self.bg.datum(data);
            });



            this.circles.transition().duration(1000).attrTween("cy",function(ary,index){
                var fun=d3.interpolateArray(ary,data);
                function comm(t){
                    var y=fun(t)[index]?fun(t)[index].y:0;
                    return y;
                }
                return function(t){
                    return self.VScale(comm(t));
                }
            }).each("end",function(ary,index){
                if(self._AryData.length==index+1){
                    self.circles.datum(data);
                }
            });

        }

        function _LineChart(options){
            _ChartObj.call(this,options);
            DefsFactory.getLinearColor(this.svg);
            this.leftRuler={size:50,ticks:5};//default
            for(var i in options.leftRuler){
                this.leftRuler[i]=options.leftRuler[i];
            }
            this.bottomRuler={size:50,ticks:5};//default
            for(var i in options.leftRuler){
                this.bottomRuler[i]=options.bottomRuler[i];
            }
            this._AryData=this.getFilterData(options.data);
            this.initScale();
            _draw.call(this);
        }
        _ChartObj.extends(_LineChart);
        _LineChart.prototype.initScale=function(){
            this.finalWidth=this.width-this.leftRuler.size-this.viewOffset[0]-20,
            this.finalheight=this.height-this.bottomRuler.size-this.viewOffset[1];

            var domainV=d3.extent(this._AryData,function(item,index){
                return item.y;
            });
            this.VScale=d3.scale.linear();
            this.VScale.domain(this.range||[0,domainV[1]]);
            this.VScale.range([this.finalheight,0]);

            var domainH=d3.extent(this._AryData,function(item,index){
                return item.x;
            });
            this.domainH=domainH;

            this.HScale=d3.scale.linear();
            this.HScale.domain([0,domainH[1]]);
            this.HScale.range([0,this.finalWidth]);
        }
        _LineChart.prototype.updateData=function(data){
            this._AryData=this.getFilterData(data)
            _animateUpdate.call(this,this._AryData);
        }

        return _LineChart;
    })();

    return obj;
});


//--
function init(){

    function _temp_getRandom(){
        var temp=[];
        for(var i=0;i<15;i++){
            var item=Math.floor(Math.random()*1000);
            var date=i*10;
            temp.push({item:item,index:i,date:date});
        }
        return temp;
    }

    var aAry=_temp_getRandom();
    var bAry=_temp_getRandom();

    var zeroAry=[];
        zeroAry.length=15;
        zeroAry.fill({item:0});
    zeroAry=_temp_getRandom();

    var bchart=new Schart.BarChart.HChart({
        parentDom:document.getElementById("speedBox"),
        data:zeroAry,
        range:[0,1000],
        width:600,
        height:300,
        orientation:"H",
        filter:function(aAry,index){
            return aAry.item;
        }
    });


    var lineChart=new Schart.LineChart({
        parentDom:document.getElementById("speedBox"),
        data:zeroAry,
        viewOffset:[10,30],
        leftRuler:{
            size:50,
            count:5
        },
        bottomRuler:{
            size:50
        },
        range:[0,1000],
        width:600,
        height:300,
        filter:function(aAry,index){
            var temp={y:aAry.item,x:aAry.date};
            return temp;
        }
    });

    setInterval(function(){
        var temp=_temp_getRandom();
        var tempAry=bchart.getFilterData(temp);
        //bchart.updateData(tempAry);
        lineChart.updateData(temp);
    },3000);
}



