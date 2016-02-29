var debug_div
var powered=false;

function main(){
    debug_div=document.getElementById("debug_div");

    chrome.bluetooth.getAdapterState(function(adapter){
        powered=adapter.powered;
        if(!powered){
            debug_div.innerHTML="please turn on bluetooth";

        }
        console.log(powered);
    });

    chrome.bluetooth.onAdapterStateChanged.addListener(function (adapter) {
        if (adapter.powered != powered) {
            powered = adapter.powered;
            if (powered) {
                debug_div.innerHTML="Adapter radio is on";
            } else {
                debug_div.innerHTML="Adapter radio is off";
            }
        }
    });

    chrome.bluetooth.onDeviceChanged.addListener(function(device) {
        console.log("fefe",device.address);
    });

    chrome.bluetooth.onDeviceAdded.addListener(function(device) {
        console.log(device);
    });
};

