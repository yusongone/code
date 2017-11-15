
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
      power=(128-(255/2*Math.cos((index/255)*Math.PI*2)));
      if(index==255){
        this.stop();
      }
      index+=0.5;

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
      if(t>40){
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

  function getRotate(){
    return ()=>{

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
  ary.forEach((item,index)=>{
    ctx.lineTo(index,200+item);
  });
  ctx.stroke();

  ctx.moveTo(0,0);
  ary1.forEach((item,index)=>{
    ctx.lineTo(index,200+item);
  });
  ctx.stroke();

  function drawLine(){

  }
}

function createPointer(){
  const t=[];
  const f=[];
  for(var i=0;i<255;i++){
    t.push(128-(255/2*Math.cos((i/255)*Math.PI*2)));
    //t.push(255/2*Math.atan((i/255)*Math.PI));
    f.push(255-2*Math.abs(127-i));
  }
  console.log(t);
  return {t,f};
}

function main(){
  const t=createPointer();
  testSine(t);
  
  //factory.init(36);
  //factory.run(BREATHE);

}
