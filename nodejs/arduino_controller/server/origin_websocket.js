var sha1=require("sha1");
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


      // 为这个socket实例添加一个"data"事件处理函数
      sock.on('data', function(data) {
          var Header=parseHeader(data.toString());
          console.log(Header["Sec-WebSocket-Key"]);
          var accept=sha1(Header["Sec-WebSocket-Key"]+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
          var resStr="HTTP/1.1 101 Switching Protocols\r\n" +
                  "Upgrade: websocket\r\n"+
                  "Connection: Upgrade\r\n"+
                  "Sec-WebSocket-Extensions:permessage-deflate\r\n"+
                  "Sec-WebSocket-Accept: "+accept+"\r\n\r\n";

          console.log('ddddddddddddd' + sock.remoteAddress + '************* ' + data + "eeeeeeeeeeeeeeeee");

          // 回发该数据，客户端将收到来自服务端的数据  
          sock.write(resStr);
      });


      // 为这个socket实例添加一个"close"事件处理函数  
      sock.on('close', function(data) {  
          console.log('CLOSED: ' +  sock.remoteAddress + ' ' + sock.remotePort);
      });  
    
  }).listen(PORT, HOST);  
}

function parseHeader(data){
    var tempAry=data.split("\r\n");
    var tempJson={};
    for(var i=0;i<tempAry.length;i++){
        var key=tempAry[i].split(":")[0],
            value=tempAry[i].split(":")[1];
        tempJson[key]=value;
    }
    return tempJson;
}
server();
