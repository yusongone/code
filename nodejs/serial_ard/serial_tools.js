var Serial=require("serialport");
const readline = require("readline");
//var port="/dev/ttyAMA0";
//var port="/dev/cu.usbmodem1411";
var port="/dev/tty.usbserial-A9MH5RRR";
var comList=null;
const sim800 = require("./sim800_protocol");

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

    var reciveString="";
    var prevChart="";

    serialPort.on('data', function(resStr){
        for(var i=0;i<resStr.length;i++){
            const tempChart=resStr[i];

            reciveString+=String.fromCharCode(tempChart);
            console.log(reciveString);
            if(prevChart==0x0d&&tempChart==0x0a){
                const beginIndex=reciveString.indexOf("+");
                const endIndex=reciveString.indexOf("\r\n");
                console.log("Recive:----------");
                console.log(reciveString);
                reciveString="";
            }
            prevChart=tempChart;
        }
    });


    const serial=serialPort;
    function requestSend(){
        rl.question(">",function(str){
            if(str=="send msg"){
                console.log("sm");
                gsm_message_sending("abcdefg","18633638095")
            }else if(str=="a"){
                serial.write("AT+CMGF=1");
                serial.write('\r\n');

            }else if(str=="b"){
                serial.write("AT+CMGS=\"");
                serial.write("18633638095");
                serial.write('"')
                serial.write('\r\n');

            }else if(str=="c"){
                serial.write("http://www.makejs.com/");
                serial.write(Buffer([0x1A]));
                serial.write('\r\n');

            }
            //serialPort.write(str+"\r\n");
            requestSend();
        });
    }
    function gsm_message_sending( message, phone_no) {
        const serial=serialPort;
        serial.write("AT+CMGF=1");
        serial.write('\r\n');
        serial.write("+CMGS=\"");
        serial.write(phone_no);
        serial.write('"')
        serial.write('\r\n');
        serial.write(message);
        serial.write(Buffer([0x1A]));
        serial.write('\r\n');
    }
}


