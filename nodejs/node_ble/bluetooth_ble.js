var noble=require("noble");

var serviceUUIDs = []; // default: [] => all
var allowDuplicates = false; // default: false
var powerOn=false;
var stateChangeHandler=function(){
    powerOn=true;
}

function _startScan(handler){
    if(powerOn){
        handler();
    }else{
        stateChangeHandler=handler;
    }
}

noble.on('stateChange', function(e){
    if(e=="poweredOn"){
        stateChangeHandler();
    }else{
        powerOn=false;
    }
});

//noble.state="poweredOn";

//find peripheral(BT device)
// -> connection peripheral(BT device)
// -> discover service (BT service)
// -> discover characteristics
// -> characteristics bind on data event
// -> turn on characteristics notify

noble.on('discover',function(peripheral){
  if(peripheral.advertisement.localName=="HMSoft"){
    peripheral.connect(function(){
      console.log("connected");
      
      peripheral.discoverServices([],function(err,services){
        console.log(services);
        for(var i=0;i<services.length;i++){
          var service=services[i];
              console.log("================a",service.uuid);
          if(service.uuid=="ffe0"){
            console.log(service);
            service.on('characteristicsDiscover', function(charaAry){
              console.log("--------------------------a",charaAry);

              for(var j=0;j<charaAry.length;j++){
                var chara=charaAry[j];
                chara.on("data",function(data,isNotification){
                  parse(data);
                });
                chara.notify(true,function(){})
              }
            });
            service.discoverCharacteristics();
          };
        }
      });
    });
  };
});



var headString;
var dataLength=-1;
var startData=0;
var subIndex=0;
var buf=[];

function parse(data){
  var dl=data.length;
  while(dl--){
    var tempByte=data[data.length-dl-1];
    if(startData>0){ 
        if(startData<30){
            buf[startData-1]=tempByte;
            startData++; 
        }else{
            console.log("--------------------------------------------"+new Date().toISOString().substr(11,8));
            console.log("CF=1 1.0",(buf[2]<<8)+(buf[3]<<0));
            console.log("CF=1 2.5",(buf[4]<<8)+(buf[5]<<0));
            console.log("CF=1 10",(buf[6]<<8)+(buf[7]<<0));

            console.log("DQ 1.0",(buf[8]<<8)+(buf[9]<<0));
            console.log("DQ 2.5",(buf[10]<<8)+(buf[11]<<0));
            console.log("DQ 10",(buf[12]<<8)+(buf[13]<<0));
            startData=0; 
        }
    }
    if(tempByte==0x42||tempByte==0x4d){
      headString+=String.fromCharCode(tempByte);
      if(headString=="BM"){
        startData=1;
      }
    }else{
      headString="";
    }
  }
}

exports.scan=function(){
    _startScan(function(){
        console.log("scaning");
        noble.startScanning(serviceUUIDs, allowDuplicates,function(err,d){
        }); // particular UUID's
    });
}

exports.scan();