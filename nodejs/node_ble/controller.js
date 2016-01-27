var ws=require("./origin_websocket");
var ble=require("./bluetooth_ble");

    ws.connected(function(socket){
        socket.onData(function(data){
            console.log(data);
        });
        setInterval(function(){
        },1000)
    });

    ws.start(9900,function(err){
        console.error(err);
    });

    ble.scan(function(buf){
        var buf=new ArrayBuffer(3+buf.length);
        var u8i=new Uint8Array(buf);
        u8i[0]=0x;
        u8i[1]=33;
        u8i[2]=44;
        u8i[3]=55;

        socket.send(buf);
        //socket.send("what the fuck");
    })

