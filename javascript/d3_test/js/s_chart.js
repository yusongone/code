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
            stop1.attr("style","stop-color:rgb(119,202,202);stop-opacity: 0.01;");
            stop1.attr("offset","0%");
            var stop2=l.append("stop");
            stop2.attr("style","stop-color:rgb(119,202,202);stop-opacity: 0.05;");
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
            var rulerSoul=d3.svg.axis().scale(this.VScale).orient("left");
                leftCreator.call(rulerSoul);
                leftCreator.attr("transform", "translate("+this.leftRulerSize+",0)");
                leftCreator.attr("stroke-width","1px");
                leftCreator.attr("stroke","#666");
                leftCreator.attr("fill","none");

            var bottomCreator=this.viewArea.append("g");
            var rulerSoul=d3.svg.axis().scale(this.HScale).orient("bottom");
            bottomCreator.call(rulerSoul);
            bottomCreator.attr("transform", "translate("+this.leftRulerSize+"," +(this.height-this.bottomRulerSize-this.viewOffset[1])+ ")");
            bottomCreator.attr("stroke-width","1px");
            bottomCreator.attr("stroke","#666");
            bottomCreator.attr("fill","none");
        }

        function _draw(){
            var self=this;
                _drawRuler.call(this)

            var waveSoul= d3.svg.line();
            var lineBox=this.viewArea.append("g");
            var VScale=this.VScale,
                HScale=this.HScale;

                waveSoul.interpolate( 'linear' );
                waveSoul.x(function(item,index){
                    return HScale(item.x);
                    //return index*(self.width-self.leftRulerSize-self.viewOffset[0])/self._AryData.length;
                });
                waveSoul.y(function(item,index){
                    return VScale(item.y);
                });


                var area = d3.svg.area();
                area.interpolate( 'linear' );
                area.x( function(item,index ){
                    return HScale(item.x);
                    //return index*(self.width-self.leftRulerSize-self.viewOffset[0])/self._AryData.length;
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
                wave.attr("transform","translate("+this.leftRulerSize+",0)");
                wave.attr("d",waveSoul);
                wave.__Soul=waveSoul;

            var bg=lineBox.append("path");
                bg.datum(this._AryData);
                bg.attr("stroke","none");
                bg.attr("fill","red");
                bg.attr("transform","translate("+this.leftRulerSize+",0)");
                bg.attr("d",area);
                bg.attr("fill","url(#linearColor)");
                bg.__Soul=area;

            this.wave=wave;
            this.bg=bg;
        };

        function _animateUpdate(data){
            //this.datum(data);
            var self=this;
            var soul=this.wave.__Soul;
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
        }

        function _LineChart(options){
            _ChartObj.call(this,options);
            DefsFactory.getLinearColor(this.svg);
            this.leftRulerSize=options.leftRulerSize||50;
            this.bottomRulerSize=options.bottomRulerSize||20;
            this._AryData=this.getFilterData(options.data);
            this.initScale();
            _draw.call(this);
        }
        _ChartObj.extends(_LineChart);
        _LineChart.prototype.initScale=function(){
            var aryRange=d3.extent(this._AryData,function(d,index){
                return d;
            });
            this.VScale=d3.scale.linear();
            this.VScale.domain(this.range||[aryRange[1],0]);
            this.VScale.range([(this.height-this.bottomRulerSize-this.viewOffset[1]),0]);

            var domainH=d3.extent(this._AryData,function(item,index){
                return item.x;
            });

            this.HScale=d3.scale.linear();
            this.HScale.domain([0,domainH[1]]);
            //this.HScale.range([0,(this.width-this.leftRulerSize-this.viewOffset[0])]);
            this.HScale.range([0,(this.width-this.leftRulerSize-this.viewOffset[0]-20)]);
        }
        _LineChart.prototype.updateData=function(data){
            _animateUpdate.call(this,data);
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
        leftRulerSize:50,
        bottomRulerSize:30,
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
        bchart.updateData(tempAry);
        var tempAry=lineChart.getFilterData(temp);
        lineChart.updateData(tempAry);
    },3000);
}



