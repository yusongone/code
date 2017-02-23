var NobleDevice = require('noble-device');
 
/*
 *
var YOUR_THING_SERVICE_UUID = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var YOUR_THING_NOTIFY_CHAR  = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var YOUR_THING_READ_CHAR    = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var YOUR_THING_WRITE_CHAR   = 'xxxxxxxxxxxxxxxxxxxxxxxx';

*/
//var YOUR_THING_SERVICE_UUID="0000ffe1-0000-1000-8000-00805f9b34fb";
 
// then create your thing with the object pattern 
var YourThing = function(peripheral) {
  // call nobles super constructor 
  NobleDevice.call(this, peripheral);
 
  // setup or do anything else your module needs here 
};

YourThing.prototype.receive = function(callback) {
    this.readDataCharacteristic(YOUR_THING_SERVICE_UUID, YOUR_THING_READ_CHAR, callback);
};
 
// tell Noble about the service uuid(s) your peripheral advertises (optional) 
//YourThing.SCAN_UUIDS = [YOUR_THING_SERVICE_UUID];
 
// and/or specify method to check peripheral (optional) 
YourThing.is = function(peripheral) {
  return (peripheral.advertisement.localName === 'HMSoft');
};

 
// inherit noble device 
NobleDevice.Util.inherits(YourThing, NobleDevice);
 
// you can mixin other existing service classes here too, 
// noble device provides battery and device information, 
// add the ones your device provides 
NobleDevice.Util.mixin(YourThing, NobleDevice.BatteryService);
NobleDevice.Util.mixin(YourThing, NobleDevice.DeviceInformationService);
 
// export your device 
module.exports = YourThing;
