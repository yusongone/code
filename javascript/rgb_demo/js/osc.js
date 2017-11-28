

function main(){
  const box=document.getElementById("box");
  const canvas=document.getElementById("canvas");
  const ctx=canvas.getContext("2d");
  const ary=[];
  const testLine=[];

  for(let i=0;i<=360;i++){
    const t=Math.cos(i/360*Math.PI*2);
    console.log(t,i,Math.acos(t)*180/Math.PI);
    testLine.push(t);
  }

  window.addEventListener("devicemotion", function(event){

    //var acc = event.acceleration;
    var acc = event.accelerationIncludingGravity;
    var rotationRate = event.rotationRate;

    /*
    rotationRate.alpha;
    rotationRate.beta;
    rotationRate.gamma;
    */

    updateAry({
      x:acc.x,
      y:acc.y,
      z:acc.z
    });
  }, true);

  function updateAry(obj){
    ary.unshift(obj);
    ary.length>200&&ary.pop();
    //box.innerText=ary.map((item)=>{return item.x;}).join(",\n");
  }

  function doIt(){
    draw(); 
    requestAnimationFrame(doIt)
  }

  doIt();

  function draw(){
    const scale=10;
    ctx.clearRect(0,0,400,480);

    ctx.moveTo(0,0);
    ctx.beginPath();
    ctx.strokeStyle="red";
    ary.forEach((item,index)=>{
      const t=100+item.x*scale;
      ctx.lineTo(index,t);
    });
    ctx.stroke();
    ctx.closePath();

    ctx.moveTo(0,0);
    ctx.beginPath();
    ctx.strokeStyle="green";
    ary.forEach((item,index)=>{
      const t=100+item.y*scale;
      ctx.lineTo(index,t);
    });
    ctx.stroke();
    ctx.closePath();

    ctx.moveTo(0,0);
    ctx.beginPath();
    ctx.strokeStyle="blue";
    ary.forEach((item,index)=>{
      const t=100+item.z*scale;
      ctx.lineTo(index,t);
    });
    ctx.stroke();
    ctx.closePath();

    ctx.moveTo(0,0);
    ctx.beginPath();
    ctx.strokeStyle="blue";
    testLine.forEach((item,index)=>{
      const t=100+item*100;
      ctx.lineTo(index,t);
    });
    ctx.stroke();
    ctx.closePath();

  }

}

