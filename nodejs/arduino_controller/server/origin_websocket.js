var sha1=require("sha1");
var crypto=require("crypto");
function server(){
  var net = require('net');  
    
  var HOST = 'localhost';
  var PORT = 9800;

  // 创建一个TCP服务器实例，调用listen函数开始监听指定端口  
  // 传入net.createServer()的回调函数将作为”connection“事件的处理函数  
  // 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的
  net.createServer(function(sock) {
    
      // 我们获得一个连接 - 该连接自动关联一个socket对象  
      console.log('CONNECTED: ' +  sock.remoteAddress + ':' + sock.remotePort);

      //var key="dGhlIHNhbXBsZSBub25jZQ==";//s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

      // 为这个socket实例添加一个"data"事件处理函数
      sock.on('data', function(data) {
          var Header=parseHeader(data.toString());
          var key=Header["Sec-WebSocket-Key"];
          if(!key){
              parseFrameHead(data);
              return;
          }
          var magicStr="258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
          var accept=crypto.createHash("sha1").update(key+magicStr).digest("base64");

          var resStr="HTTP/1.1 101 Switching Protocols\r\n" +
                  "Upgrade: websocket\r\n"+
                  "Connection: Upgrade\r\n"+
                  "Sec-WebSocket-Accept: "+accept+" \r\n\r\n";

          //console.log('ddddddddddddd' + sock.remoteAddress + '************* ' + data + "eeeeeeeeeeeeeeeee");

          // 回发该数据，客户端将收到来自服务端的数据  
          sock.write(resStr);
          setTimeout(function(){
              send();
          },3000)
      });


      // 为这个socket实例添加一个"close"事件处理函数  
      sock.on('close', function(data) {  
          console.log('CLOSED: ' +  sock.remoteAddress + ' ' + sock.remotePort);
      });




      function send(message) {
          //message = String(message);
          //var length = Buffer.byteLength(message);
          var length=2;

//  数据的起始位置，如果数据长度16位也无法描述，则用64位，即8字节，如果16位能描述则用2字节，否则用第二个字节描述
          var index = 2 + (length > 65535 ? 8 : (length > 125 ? 2 : 0));
//  定义buffer，长度为描述字节长度 + message长度
          var buffer = new Buffer(index + length);
//  第一个字节，fin位为1，opcode为1
          //buffer[0] = 129;
          buffer[0] = 130;//0b10000010;
//	因为是由服务端发至客户端，所以无需masked掩码
          if (length > 65535) {
              buffer[1] = 127;
//	  长度超过65535的则由8个字节表示，因为4个字节能表达的长度为4294967295，已经完全够用，因此直接将前面4个字节置0
              buffer.writeUInt32BE(0, 2);
              buffer.writeUInt32BE(length, 6);
          } else if (length > 125) {
              buffer[1] = 126;
//	  长度超过125的话就由2个字节表示
              buffer.writeUInt16BE(length, 2);
          } else {
              buffer[1] = length;
          }
//	写入正文
          //buffer.write(message, index);
          buffer[index]=196;
          //buffer.writeUInt8(129,index);
          buffer[index+1]=10;
          sock.write(buffer);
      }
  }).listen(PORT, HOST);
}

function parseFrameHead(data){
    var fin=data[0]>>7;
    var opcode=data[0]&15;//15 0b00001111;
    var haveMASK=data[1]>>7;
    var payloadlen=data[1]&127;
    var MASKAry=new Uint8Array(4)
    console.log(fin,opcode,haveMASK,payloadlen);
    if(payloadlen<126){
        for(var i=0;i<MASKAry.length;i++){
            MASKAry[i]=data[i+2];
        }
    }
    var transData=new Uint8Array(payloadlen)
    for(var i=0;i<transData.length;i++){
        transData[i]=data[i+6];
    }

    var clearData=new Uint8Array(payloadlen);
    for(var i=0;i<clearData.length;i++){
        clearData[i]=transData[i]^MASKAry[i%4];
    }

    console.log(clearData);
}

function parseHeader(data){
    var tempAry=data.split("\r\n");
    var tempJson={};
    for(var i=0;i<tempAry.length;i++){
        var key=tempAry[i].split(": ")[0],
            value=tempAry[i].split(": ")[1];
        tempJson[key]=value;
    }
    return tempJson;
}

server();

