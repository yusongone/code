var ws=require("./origin_websocket");
var ble=require("./bluetooth_ble");

    ws.connected(function(socket){
        socket.onData(function(data){
            console.log(data);
        });
    });

    ws.start(9900,function(err){
        console.error(err);
    });

    ble.scan(function(_buf){
        var length=_buf.length+5+1;
        var buf=new ArrayBuffer(length);
        var u8i=new Uint8Array(buf);
        u8i[0]=36;
        u8i[1]=77;
        u8i[2]=62;
        u8i[3]=_buf.length;
        u8i[4]=10;
        for(var i=0;i<_buf.length;i++){
            u8i[i+5]=_buf[i];
        }
        u8i[length-1]=getSum(u8i);
        ws.broadcast(u8i);
        //socket.send("what the fuck");
    });

function getSum(buf){
    if(buf[3]==0){
        return buf[4];
    }else{
        var z=buf[5];
        for(var i=6;i<buf.length-1;i++){
            z=z^(buf[i]&0xff);
        }
        return z;
    }
}
