var t=require("./t.js");


t.discoverAll(function(yourThing){
console.log("fef");
console.log(yourThing);
});
t.discover(function(yourThing) {
  // you can be notified of disconnects 
  yourThing.on('disconnect', function() {
    console.log('we got disconnected! :( ');
  });
 
  // you'll need to call connect and set up 
  yourThing.connectAndSetUp(function(error) {
    console.log('were connected!');
  });
 
});

