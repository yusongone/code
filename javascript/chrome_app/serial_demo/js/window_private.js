var debug_div;
var device_list;
var powered=false;

function main(){
    debug_div=document.getElementById("debug_div");
    device_list=document.getElementById("device_list")

    chrome.bluetooth.getAdapterState(function(adapter){
        powered=adapter.powered;
        if (chrome.runtime.lastError){
            console.log("adapter error",chrome.runtime.lastError.message);
        }
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

    var pool={
        _addDeviceHandler:null,
        _fitUUIDDeviceHandler:null,
        _filterUUID:null,
        devices:{},
        updateDevice:function(device){
            if(!this.devices[device.address]){
                this.devices[device.address]=device;
                _addDeviceHandler(device);
                console.log(device);
                if(!device.uuids){
                    return;
                }
                for(var i=0;i<device.uuids.length;i++){
                    if(device.uuids[i]==_filterUUID){
                        _fitUUIDDeviceHandler(device);
                    }
                    return;
                }
            }
        },
        onAddDevice:function(addDeviceHandler){
            _addDeviceHandler=addDeviceHandler;
        },
        onfilterDeviceUUID:function(uuid,handler){
            _filterUUID=uuid;
            _fitUUIDDeviceHandler=handler;
        }
    };

    pool.onfilterDeviceUUID("0000180d-0000-1000-8000-00805f9b34fb",function(device){
        //FFA3547F-1176-4C47-B65F-54D1A518A280
        console.log("find it",device);
        connectToBLE(device);
        getService(device.address);
        setTimeout(function(){
            chrome.bluetooth.stopDiscovery(function() {
            });
        },10000);
    });

    pool.onAddDevice(function(device){
        var li=document.createElement("li");
            li.innerText=device.name;
            device_list.appendChild(li);
    });



    chrome.bluetooth.onDeviceChanged.addListener(function(device) {
        pool.updateDevice(device);
    });

// Now begin the discovery process.
    chrome.bluetooth.startDiscovery(function() {
        // Stop discovery after 30 seconds.
    });

    chrome.bluetooth.getDevices(function(d){
        for(var i =0;i< d.length;i++){
            console.log(d[i].name);
            if(d[i].uuids&& d[i].uuids[0]=="0000180d-0000-1000-8000-00805f9b34fb"){
                connectToBLE(d[i]);
            }
        }
    });

};


function connectToBLE(device){
    var address=device.address;
    console.log(address);
    chrome.bluetoothLowEnergy.connect(address,function () {
        if (chrome.runtime.lastError) {
            console.log('Failed to connect: ' + chrome.runtime.lastError.message);
            return;
        };
        console.log("zzzddd");
        getService(device.address);
    });
}

function getService(deviceAddress){
    chrome.bluetoothLowEnergy.getServices(deviceAddress, function(services) {
        console.log("9999999",services);
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            return;
        }
        for (var i = 0; i < services.length; i++) {
            if (services[i].uuid == HEART_RATE_SERVICE_UUID) {
                heartRateService = services[i];
                break;
            }
        };
    });
}

