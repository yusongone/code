var SerialPort = require("serialport").SerialPort
var serialPort;

var Port=(function(){
//var port = "/dev/tty.song-DevB";
//var port = "/dev/tty.usbmodem1421";
//var port = "/dev/tty.usbmodem1411";
//var port = "/dev/tty.usbserial-A7026DQB";
    var port="/dev/tty.Song001-DevB";


    return {
        init:function(){
            serialPort = new SerialPort(port, {
                baudrate:115200
                // baudrate:9600
            });

            serialPort.open(function () {
                serialPort.on('data', function(data) {
                    console.log(data);
                    Parser.parse(data);
                });
                //proto.pull("version");
                //send();



                setTimeout(function(){

                    var option={};
                    option.Yaw=1500;
                    setInterval(function(){
                        option.RoLL=1500;
                        option.Pitch=1500;
                        option.Yaw+=6;
                        option.Yaw >2000?option.Yaw= 2000:"";

                        option.Thr=1000;
                        option.A1=1000;
                        option.A2=1000;
                        option.A3=1000;
                        option.A4=1000;

                        proto.push("rc",option);
                    },20);

                },4000);
            });
        }
    }
})();

Port.init();



var proto=(function(){
    var buf=new Buffer(22);
    buf.fill(0);

    function getSum(buffer) {
        var data = Array.prototype.slice.call(buffer, 3);
        if(data[0] === 0) {
            // out message
            return data[1];
        } else {
            // in message
            var clearBuf=data .slice(0, data.length-1);
            return clearBuf.reduce(function(tot, cur) {
                    var temp=tot^cur;
                    return temp;
                }, 0);
        }
    };

    return {
        pull:function(command){
            var header=[0x24,0x4D,0x3C];
            buf.writeUInt8(header[0],0);
            buf.writeUInt8(header[1],1);
            buf.writeUInt8(header[2],2);
            switch(command){
                case "version":
                    buf.writeUInt8(0,3);
                    buf.writeUInt8(100,4);
                    buf.writeUInt8(getSum(buf),5);
                    break;
                case "attitude":
                    buf.writeUInt8(0,3);
                    buf.writeUInt8(108,4);
                    buf.writeUInt8(getSum(buf),5);
                    break;

            }
            serialPort.write(buf,function(err,res){
                console.log(res);
            });
        },
        push:function(command,option){
            var header=[0x24,0x4D,0x3C];
            buf.writeUInt8(header[0],0);
            buf.writeUInt8(header[1],1);
            buf.writeUInt8(header[2],2);
            switch(command) {
                case "rc":
                    //ROLL/PITCH/YAW/THROTTLE/AUX1/AUX2/AUX3AUX4
                    buf.writeUInt8(16,3);
                    console.log(option.Yaw,option.Thr);
                    buf.writeUInt8(200,4);
                    buf.writeUInt8(option.RoLL&0xff,5);
                    buf.writeUInt8(option.RoLL>>8,6);
                    buf.writeUInt8(option.Pitch&0xff,7);
                    buf.writeUInt8(option.Pitch>>8,8);
                    buf.writeUInt8(option.Yaw&0xff,9);
                    buf.writeUInt8(option.Yaw>>8,10);
                    buf.writeUInt8(option.Thr&0xff,11);
                    buf.writeUInt8(option.Thr>>8,12);
                    buf.writeUInt8(option.A1&0xff,13);
                    buf.writeUInt8(option.A1>>8,14);
                    buf.writeUInt8(option.A2&0xff,15);
                    buf.writeUInt8(option.A2>>8,16);
                    buf.writeUInt8(option.A3&0xff,17);
                    buf.writeUInt8(option.A3>>8,18);
                    buf.writeUInt8(option.A4&0xff,19);
                    buf.writeUInt8(option.A4>>8,20);
                    buf.writeUInt8(getSum(buf),21);
                    console.log(buf);
                    //[36,77,60,16,-56,-36,5,-36,5,-62,7,-24,3,-24,3,-24,3-24,3,-10]
                    //[36,77,60,16,199,219,5,219,5,-62,7,-24,3,-24,3,-24,3-24,3,-10]
                    Parser.parse(buf);
                    break;
            }

        }
    }
})();





function switchCMD(buf){
  var dataLength=buf[0];
  var msId=buf[1];
    console.log(msId,dataLength);
  switch(msId){
      case 100:
          console.log("version",(buf[2]&0xff)<<0);
          console.log("MULTITYPE",(buf[3]&0xff)<<0);
          console.log("MSP_VERSION",(buf[4]&0xff)<<0);
          break;
      case 108:
      //<Buffer 24 4d 3e 06 6c 2e ff f1 ff 00 00 b5>
          console.log("angx",(buf[2]&0xff)<<0|buf[3]<<8);
          break;
    case 205:
      console.log("a",(buf[2]&0xff)<<0|(buf[3]&0xff)<<8);
      console.log("b",(buf[4]&0xff)<<0|(buf[5]&0xff)<<8|(buf[6]&0xff)<<16);
      console.log("c",(buf[7]&0xff)<<0|(buf[8]&0xff)<<8);
      console.log("d",(buf[9]&0xff)<<0|(buf[10]&0xff)<<8);
      console.log("e",(buf[11]&0xff)<<0);
      break;
  }
}



var Parser=(function(){
    var headString="";
    var buf=new Buffer(100);
    var datalength=0;
    var subIndex=0;
    var tartData=0;
    var startData=0;

    function checkSum(buf){
        var c=buf[0];//datalength;
        for(var i=1;i<=subIndex-2;i++){
            c=(c^(buf[i]&0xff));
        };
        if(c==buf[subIndex-1]){
            return true;
        }
        return false;
    }

    function _parse(data){
        var bytes=data;
        for(var i=0;i<bytes.length;i++){
            var tempByte=bytes[i];
            if(startData==1){//get dataLength;
                buf.fill(0);
                buf[subIndex++]=tempByte;
                dataLength=tempByte;
                startData++;
            }else if(startData==2){//get msgId
                buf[subIndex++]=tempByte;
                startData++;
            }else if(startData>2){
                if(dataLength==0){
                    buf[subIndex++]=tempByte;
                    if(checkSum(buf)){
                        switchCMD(buf);
                    };
                    startData=0;
                    subIndex=0;
                }else{
                    buf[subIndex++]=tempByte;
                    dataLength--;
                }
            }else if(tempByte==36||tempByte==77||tempByte==62||tempByte==60){
                headString+= String.fromCharCode(tempByte);
                if(headString=="$M>"||headString=="$M<"){
                    startData=1;
                    headString="";
                }
            }else{
                headString="";
            }
        }
    }
    return{
        parse:_parse

    }

})();



var Test=(function(){
    var buf1=new Buffer([0x24,0x4d,0x3e,0x07]);
    var buf2=new Buffer([0x64,0xe6,0x03,0x00,0x00,0x00,0x00,0x00,0x86]);

    Parser.parse(buf1);
    Parser.parse(buf2);
});


