chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('window.html', {
        id:"001",
        frame: 'chrome',
        'outerBounds': {
          'width': 400,
          'height': 500
        }
    },function(createdWindow){
        createdWindow.contentWindow.addEventListener('load', function () {
            createdWindow.contentWindow.main(new Date().getTime());
        });
        createdWindow.onClosed.addListener(function () {
            chrome.bluetooth.stopDiscovery(function() {});
        });
    });
});



