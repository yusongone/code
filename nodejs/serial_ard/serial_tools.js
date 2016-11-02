var Serial=require("serialport");
const readline = require("readline");
//var port="/dev/ttyAMA0";
//var port="/dev/cu.usbmodem1411";
var port="/dev/tty.usbserial-A9MH5RRR";
var comList=null;

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
        console.log(port);
        initSerial(port);
    });

});

function initSerial(port){

    var serialPort=new Serial(port,{
        baudrate:9600,
        dataBits: 8, 
        parity: 'none', 
        stopBits: 1, 
        flowControl: false 
    });

    serialPort.on('open', function(){
        console.log("Serial connected");
        requestSend();
    });

    serialPort.on('data', function(data){
        console.log("Recive: ",data);
    });


    function requestSend(){
        rl.resume();
        rl.question("输入: ",function(str){
            console.log(str);
            serialPort.write(str);
            requestSend();
        });
    }
}


