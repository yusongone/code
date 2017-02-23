var noble=require("noble");

var serviceUUIDs = []; // default: [] => all
var allowDuplicates = false; // default: false
var powerOn=false;
var stateChangeHandler=function(){
    powerOn=true;
}

var onDataHandlers=[];

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
  if(peripheral.uuid=="ffa3547f11764c47b65f54d1a518a280"){
    peripheral.connect(function(){
      console.log("connected");
      peripheral.discoverServices([],function(err,services){
        for(var i=0;i<services.length;i++){
          var service=services[i];
          console.log(service.uuid);
          if(service.uuid=="180d"){
            service.on('characteristicsDiscover', function(charaAry){
              for(var j=0;j<charaAry.length;j++){
                var chara=charaAry[j];
                if(chara.uuid=="2a37");
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
    console.log(data);
}

exports.scan=function(handler){
    onDataHandlers.push(handler);
    _startScan(function(){
        console.log("scaning");
        noble.startScanning(serviceUUIDs, allowDuplicates,function(err,d){
        }); // particular UUID's
    });
}

exports.scan();
/*
*
* */
