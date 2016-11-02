var callback;
var serial=require("serialport").SerialPort;
//var port="/dev/ttyAMA0";
//var port="/dev/cu.usbmodem1411";
var port="/dev/tty.usbserial-A9MH5RRR";

var serialPort=new serial(port,{
	baudrate:9600,
	dataBits: 8, 
	parity: 'none', 
	stopBits: 1, 
	flowControl: false 
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
            console.log("CF=1 1.0",(buf[2]<<8)+(buf[3]<<0));
            console.log("CF=1 2.5",(buf[4]<<8)+(buf[5]<<0));
            console.log("CF=1 10",(buf[6]<<8)+(buf[7]<<0));

            console.log("DQ 1.0",(buf[8]<<8)+(buf[9]<<0));
            console.log("DQ 2.5",(buf[10]<<8)+(buf[11]<<0));
            console.log("DQ 10",(buf[12]<<8)+(buf[13]<<0));
        }
    }
    if(tempByte==0x42||tempByte==0x4d){
      headString+=String.fromCharCode(tempByte);
console.log(headString);
      if(headString=="BM"){
        startData=1;
      }
    }else{
      headString="";
    }
  }
}

serialPort.on('data', function(data) {
    parse(data);
});

exports.init=function(callback){
	serialPort.open(function () {
		callback();
	});
}
