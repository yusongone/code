var d=[49.93,50.42,46.60,46.97,51.69,45.58,47.80,43.22,49.21,47.18,46.59,45.71,48.36,49.54,47.21,55.25,50.89,52.53,57.35,54.92,54.16,48.90,50.51,50.08,49.28,54.24,54.43,49.25,51.82,50.77,    49.40,50.54,50.13,52.63,47.57,51.81,51.15,50.12,48.43,48.49,48.28,49.78,46.62,48.11,46.80,46.49,50.02,47.31,47.77,50.04,49.24,50.33,53.86,50.48,46.83,50.23,47.10,45.36,47.43,52.16,    50.78,46.25,46.59,48.10,41.59,50.51,51.85,53.60,54.16];
var d=[{a:100},{a:30},{a:80}];
function init(){
  var chartUI=d3.select(".chart");
  var selection=chartUI.selectAll();
  var dd=selection.data(d);
  var c=dd.enter();
  var d3_dom=c.append("div");
      d3_dom.attr("transform","translate(100,100)");
      d3_dom.style("width",function(d){return d.a+"px";});
      d3_dom.on("click",function(){
        var trans=d3.select(this).transition();
        trans.text("begin");
        trans.style("width","1000px").duration(1000);
      });
      selection.sort(function(){return 1});
console.dir(selection);

}
function inita(){
/*
var chartUI=d3.select(".chart");
var allDiv=chartUI.selectAll("div");
window.allDiv=allDiv;
    allDiv.data(d);
  .enter().append("div").transition().style("background",function(d,i){return "rgba("+i*50+",1,1,1)";}).duration(1000).delay(function(d, i) {console.log(d); return i * 100; })
    .style("width", function(d) {console.log("fe"); return d * 2 + "px"; })
    .text(function(d) { return d; });
*/
}
