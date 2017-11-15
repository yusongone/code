// Start Length Port[from] Port[to] A[0] A[1] Data1 Data2
const REQUEST_BUFFER_BASE_LENGTH=2+4+1;

var _serialport=null;
const LN3ProtocolMap={
                   _:["address","data","port"],
    getModuleAddress:[[0x00,0x00],[0x01],0x21],
    openLED:[[0x00,0x00],[0xff],0x20],
    getInfo:[[0x00,0x00],[0x01],0x21],
    getRouteInfo:[[0x00,0x00],[0x02],0x33]
}

const ProtocolParse=(function(){
    const protocol={
        51:{//0x33


        }

    }

    return {
        parse:function(jsonObj){

        }
    }
}())


function fillRequestBuffer(targetAddress,dataBuffer,targetPort){
    const packageBufferLength=REQUEST_BUFFER_BASE_LENGTH+dataBuffer.length;
    const packageBuffer=new Buffer(packageBufferLength);
    packageBuffer[0]=0xFE;
    packageBuffer[1]=4+dataBuffer.length;

    packageBuffer[2]=0x80;//from port
    packageBuffer[3]=targetPort!=undefined?targetPort:0x80;//target port

    packageBuffer[4]=targetAddress[0];//address l
    packageBuffer[5]=targetAddress[1];//address s

    for(var b=0;b<dataBuffer.length;b++){
        packageBuffer[6+b]=dataBuffer[b];
    }
    packageBuffer[6+dataBuffer.length]=0xFF;

    var needTransCount=0;
    for(var i=1;i<packageBuffer.length-1;i++){
        if(packageBuffer[i]==0xFF||packageBuffer[i]==0xFE){
            needTransCount++;
        }
    }
    const requestBufferLength=packageBufferLength+needTransCount;
    const requestBuffer=new Buffer(requestBufferLength);

    var transCount=0;
    for(var i=0;i<packageBufferLength;i++){
        var temp=packageBuffer[i];
        if(i!=0&&i!=(packageBufferLength-1)){
            if(temp==0xFE){
                requestBuffer[i+transCount]=0xFE;
                transCount++;
                requestBuffer[i+transCount]=0xFC
            }else if(temp==0xFF){
                requestBuffer[i+transCount]=0xFE;
                transCount++;
                requestBuffer[i+transCount]=0xFD
            }else{
                requestBuffer[i+transCount]=temp;
            }
        }else{
            requestBuffer[i+transCount]=temp;
        }
    }
    return requestBuffer;
}


function getResponseBuffer(){

}


const bufferQueue=(function(){
    var prevChart=null;
    var bus=null;
    function Bus(){
        this.buf=new Buffer(64);
        this.buf.fill(0);
        this.pointer=0;
        this.buf[0]=0xFE;
    }
    Bus.prototype.write=function(chart){
        this.buf[++this.pointer]=chart;
    }
    Bus.prototype.replaceLast=function(chart){
        this.buf[this.pointer]=chart
    };
    Bus.prototype.launch=function(chart){
        this.write(chart);
        console.log(this.buf);
        const finalDataLength=this.buf[1]-4;
        const response={
            dataLength:finalDataLength,
            fromPort:this.buf[2],
            targetPort:this.buf[3],
            addressPort:[this.buf[4],this.buf[5]],
            dataBuffer:new Buffer(finalDataLength)
        }
        for(var i=0;i<response.dataLength;i++){
            response.dataBuffer[i]=this.buf[i+6]
        }
        console.log(response);
    }

    return {
        getBus:function(){
            const bus=new Bus();
            return bus;
        },
        parse:function(Buffer){
            for(var i=0;i<Buffer.length;i++){
                var newChart=Buffer[i];
                if(prevChart==0xFE&&newChart!=0xFC&&newChart!=0xFD){
                    console.log(1,newChart);
                    bus=bufferQueue.getBus();
                    bus.write(newChart);
                }else if(newChart==0xFD&&prevChart==0xFE){
                    console.log(2,newChart);
                    if(bus!=null){
                        bus.replaceLast(0xFF);
                    }
                }else if(newChart==0xFC&&prevChart==0xFE){
                    console.log(3,newChart);
                    if(bus!=null){
                        bus.replaceLast(0xFE);
                    }
                }else if(newChart==0xFF){
                    console.log(4,newChart);
                    bus.launch(0xFF);
                    bus=null;
                }else{
                    console.log(5,newChart);
                    if(bus!=null){
                        bus.write(newChart);
                    }
                }
                prevChart=newChart;
            }
        }
    }
})();

const LN3={
    test:function(){
        //bufferQueue.parse([0xfe,0x05,0xfe,0xfc,0x0d,0xfe,0xcd,0xff]);
        //bufferQueue.parse([0xfe,      0x05,0xfe,0xfd,0xfe,     0xfc,0xf9,0xcd,0xff]);

        //openLED:[[0x00,0x00],[0xff],0x20],
        const rBuffer=fillRequestBuffer([0xff,0xff],[0xff],[0x20]);
        _serialport.write(rBuffer);
    },
    init:function(serialport){
        _serialport=serialport;


        serialport.on("data",function(Buffer){
            bufferQueue.parse(Buffer);
        });

    },
    getModuleAddress:function(){
        const ary=LN3ProtocolMap.getModuleAddress;
        const rBuffer=fillRequestBuffer(ary[0],ary[1],ary[2]);
        _serialport.write(rBuffer);
    },
    openLed:function(){
        const ary=LN3ProtocolMap.openLED;
        //const ary=LN3ProtocolMap.getInfo;
        const rBuffer=fillRequestBuffer(ary[0],ary[1],ary[2]);
        _serialport.write(rBuffer);
    },
    getRouteInfo:function(){
        const ary=LN3ProtocolMap.getRouteInfo;
        const rBuffer=fillRequestBuffer(ary[0],ary[1],ary[2]);
        _serialport.write(rBuffer);
    }
}




exports.LN3=LN3;