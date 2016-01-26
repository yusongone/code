var ws=require("./origin_websocket");
var ble=require("./bluetooth_ble");

    ws.connected(function(socket){
        socket.onData(function(data){
            console.log(data);
        });
        setInterval(function(){
            var buf=new ArrayBuffer(4);
            var u8i=new Uint8Array(buf);
                u8i[0]=22;
                u8i[1]=33;
                u8i[2]=44;
                u8i[3]=55;

            socket.send(u8i);
            socket.send("what the fuck");
        },1000)
    });

    ws.start(9900,function(err){
        console.error(err);
    });

