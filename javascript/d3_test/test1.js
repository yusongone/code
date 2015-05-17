function init(){
  var canvas=d3.select(".speedBox");
       var svg=canvas.append("svg");
           svg.attr("width","100%");
           svg.attr("height","500");


var line = d3.svg.line()
     .x(function(d,i) { return (i/0.05).toFixed(2); })
     .y(function(d,i) { return (300-d/3).toFixed(2); })
     .interpolate("basis");
 
     var lineSpeed=svg.append("path");
         lineSpeed.attr("d",line(array))
               .attr("stroke", "#000")
               .attr("stroke-width", 1)
               .attr("fill", "none");

     var lineSpeed2=svg.append("path");
         lineSpeed2.attr("d",line(array2))
               .attr("stroke", "#f00")
               .attr("stroke-width", 1)
               .attr("fill", "none");
}
