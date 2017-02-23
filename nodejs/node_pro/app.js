var t=require("./t.js");



/*
t.discoverAll(function(yourThing){
    console.log("fef");
    console.log(yourThing);
});
*/
t.discover(function(yourThing) {

  // you can be notified of disconnects 
  yourThing.on('disconnect', function() {
    console.log('we got disconnected! :( ');
  });
 
  // you'll need to call connect and set up 
  yourThing.connectAndSetUp(function(error) {
    console.log('were connected!');
    yourThing.readDataCharacteristic("ffe0","ffe1",function(err,data){
      console.log(err,data);
    });
    yourThing.notifyCharacteristic("ffe0","ffe1",true,false,function(){
      console.log(0);
    });
  });


 
});

