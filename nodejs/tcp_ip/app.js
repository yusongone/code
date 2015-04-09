function server(){
  var net = require('net');  
    
  var HOST = '192.168.1.106';  
  var PORT = 4000;  
  console.log("192.168.100.106");
    
  // 创建一个TCP服务器实例，调用listen函数开始监听指定端口  
  // 传入net.createServer()的回调函数将作为”connection“事件的处理函数  
  // 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的  
  net.createServer(function(sock) {  
    
      // 我们获得一个连接 - 该连接自动关联一个socket对象  
      console.log('CONNECTED: ' +  
          sock.remoteAddress + ':' + sock.remotePort);  
    
      // 为这个socket实例添加一个"data"事件处理函数  
      sock.on('data', function(data) {  
          console.log('DATA ' + sock.remoteAddress + ': ' + data);  
          // 回发该数据，客户端将收到来自服务端的数据  
          sock.write('You said "' + data + '"');  
      });  
      setInterval(function(){
        sock.write("ff:abcd");
      },1000);
    
      // 为这个socket实例添加一个"close"事件处理函数  
      sock.on('close', function(data) {  
          console.log('CLOSED: ' +  
              sock.remoteAddress + ' ' + sock.remotePort);  
      });  
    
  }).listen(PORT, HOST);  
}
function client(){
  var net = require('net');  
    
  var HOST = '192.168.1.118';  
  var PORT = 6666;  
    
  var client = new net.Socket();  
  client.connect(PORT, HOST, function() {  
    
      console.log('CONNECTED TO: ' + HOST + ':' + PORT);  
      // 建立连接后立即向服务器发送数据，服务器将收到这些数据   
      client.write('I am Chuck Norris!');  
    
  });  
    
  // 为客户端添加“data”事件处理函数  
  // data是服务器发回的数据  
  client.on('data', function(data) {  
    
      console.log('DATA: ' + data);  
      client.write([0x00,0x01,0x02]);  
      // 完全关闭连接  
//      client.destroy();  
    
  });  
    
  // 为客户端添加“close”事件处理函数  
  client.on('close', function() {  
      console.log('Connection closed');  
  }); 
}
server();
//client();
