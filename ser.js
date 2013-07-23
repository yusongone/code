var SerialPort  = require('serialport').SerialPort;
var portName = '/dev/rfcomm0';
var sp = new SerialPort(); // instantiate the serial port.
console.log("ef");
sp.open(portName, { // portName is instatiated to be COM3, replace as necessary
   baudRate: 9600, // this is synced to what was set for the Arduino Code
   dataBits: 8, // this is the default for Arduino serial communication
   parity: 'none', // this is the default for Arduino serial communication
   stopBits: 1, // this is the default for Arduino serial communication
   flowControl: false // this is the default for Arduino serial communication
});
