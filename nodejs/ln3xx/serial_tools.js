var Serial=require("serialport");
const readline = require("readline");
var comList=null;
const LN3= require("./ln3_protocol").LN3;

const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

Serial.list(function(err,item){
    
    console.log("serialport com list:");
    comList=item;

    item.forEach(function(i,index){
        console.log(index+" : "+i.comName);
    });

    rl.question("Please enter com number > ",function(number){
        const port=comList[number].comName;
        initSerial(port);
    });

});

function initSerial(port){

    var serialPort=new Serial(port,{
        baudrate:115200,
        dataBits: 8, 
        parity: 'none', 
        stopBits: 1, 
        flowControl: false 
    });

    serialPort.on('open', function(){
        console.log("Serial connected");
        LN3.init(serialPort);
        requestSend();
    });

    var reciveString="";

    serialPort.on('data', function(resStr){
    });


    const serial=serialPort;
    function requestSend(){
        rl.question(">",function(str){
            if(str=="getModuleAddress"){
                LN3.getModuleAddress();
            }else if(str=="l"){
                LN3.test();
            }else if(str=="get route"){
                LN3.getRouteInfo();
            }else if(str=="open led"){
                LN3.openLed();
            }
            requestSend();
        });
    }
}


