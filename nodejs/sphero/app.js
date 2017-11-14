
var sphero = require("sphero"),
    //bb8 = sphero("C8:69:CD:9A:07:1B"); // change BLE address accordingly 
    //bb8 = sphero("dd:2f:c9:fd:c0:67"); // change BLE address accordingly 
    //bb8 = sphero("DD:2F:C9:FD:C0:67"); // change BLE address accordingly 
    bb8 = sphero("7a"); // change BLE address accordingly 
	bb8.ping(function(err, data) {
		  console.log("--",err || "data: " + data);
	});
bb8.getBluetoothInfo(function(err, data) {
  if (err) {
    console.log("error: ", err);
  } else {
    console.log("data:");
    console.log("  name:", data.name);
    console.log("  btAddress:", data.btAddress);
    console.log("  separator:", data.separator);
    console.log("  colors:", data.colors);
  }
});
 
bb8.connect(function() {
  // roll BB-8 in a random direction, changing direction every second 
   console.log("fe");
  setInterval(function() {
    var direction = Math.floor(Math.random() * 360);
    bb8.roll(150, direction);
  }, 1000);
}).then(function(){
	console.log("---------");
});
