
const BREATHE = "breathe";
const ROTATE = "ROTATE"

class LED{
  constructor(){
    this.value={
      r:0,
      g:0,
      b:0
    }
    this.updateHandler=()=>{};
  }
  

  breathe(rgb){
    let power=0;
    let dir=1;
    let loopCount=0;
    let index=0;
    this.updateHandler=()=>{
      //power=(128-(255/2*Math.cos((index/255)*Math.PI*2)));

      const zz=128-(255/2*Math.cos((index/255)*Math.PI*2));

      const e=255-2*Math.abs(127-index);

      power=zz*e/255;
      if(index==255){
        this.stop();
      }
      index+=1;

      if(rgb.r){
        this.value.r=power*rgb.r;
      }
      if(rgb.g){
        this.value.g=power*rgb.g;
      }
      if(rgb.b){
        this.value.b=power*rgb.b;
      }
    }
  }
  stop(){
    this.updateHandler=()=>{};

  }

  update(){
    this.updateHandler();
  }
}


var factory=(function(){
  let LEDList=[];
  let DOMList=[];
  let colorCache=[];
  let count;
  let runHandler=()=>{}

  function sync(){
    LEDList.forEach((LED,index)=>{
      const r=parseInt(LED.value.r);
      const g=parseInt(LED.value.g);
      const b=parseInt(LED.value.b);
      DOMList[index].setAttribute("style",`background:rgb(${r},${g},${b})`);
    });
  }

  function getIndex(i){
    return parseInt(i%count);
  }

  function getBreathe(){
    let t=0;
    let index=0;
    return ()=>{
      t++;
      if(t>10){
        if(index>=count){index=0}
        LEDList[index].breathe({r:1,g:1,b:1});
        t=0;
        index++;
      }

      LEDList.forEach((led,index)=>{
        led.update();
      });

      sync();

    }
  }

  function loop(){
    requestAnimationFrame(()=>{
      runHandler();
      loop();
    });
  }

  function createDom(num){
    for(let i=0;i<num;i++){
      var t=document.createElement("div");
      t.setAttribute("class","led")
      document.getElementById("box").appendChild(t);
      DOMList.push(t);
    }
  }

  return {
    init:(num)=>{
      createDom(num);
      count=num;
      for(let i=0;i<num;i++){
        const t=new LED();
        LEDList.push(t);
      }
      loop();
    },
    run:(type)=>{
      switch(type){
        case BREATHE:
          runHandler=getBreathe();
        break;
        case ROTATE:
          runHandler=getRotate();
        break;
      }
    }
  }
})();

function testSine(obj){
  const ary=obj.t;
  const ary1=obj.f;

  const canvas=document.getElementById("canvas");
  const ctx=canvas.getContext("2d");

  ctx.moveTo(0,0);
  ctx.beginPath();
  ctx.strokeStyle="black";
  ary.forEach((item,index)=>{
    const t=255-(item);
    ctx.lineTo(index,t);
  });
  ctx.stroke();
  ctx.closePath();

  ctx.moveTo(0,0);
  ctx.beginPath();
  ctx.strokeStyle="red";
  ary1.forEach((item,index)=>{
    const t=355-item;
    ctx.lineTo(20+index/6,t);
  });
  ctx.stroke();
  ctx.closePath();

  function drawLine(){

  }
}

function createPointer(){
  const t=[];
  const f=[];
  for(var i=0;i<255;i++){
    const zz=128-(255/2*Math.cos((i/255)*Math.PI*2));
    const ee=128-(255/2*Math.sin((i/255)*Math.PI*2));
    const e=(255-2*Math.abs(127-i));
    //t.push(zz*e/255);
    //t.push(zz*e/255);
    //t.push(255/2*Math.atan((i/255)*Math.PI));
    //f.push(255-2*Math.abs(127-i));
    //f.push((zz+e)/2);
    //t.push(zz);
    //f.push(zz*e/255*e/255);
    //console.log(Math.cos((i/255)*Math.PI*2));
  }
  function getR(i){
    let t=[0,0,1,255,255,-1];
    i=i/360*6;
    var index=parseInt(i)%6;
    if(index<0){
      index=6+index;
    }
    var type=t[index];
    let temp;
    if(type==1){
      temp=255+i%255;
    }else if(type==-1){
      temp=255-Math.abs(i)%255;
    }else{
      temp=type;
    }
    return temp;
  }

  for(var i=-360;i<=360;i++){
    f.push(getR(i));
  }
  return {t,f};
}

function main(){
  const t=createPointer();


  testSine(t);
  
  factory.init(36);
  factory.run(BREATHE);

}
