console.log(new Date().getTime());

chrome.extension.onMessage.addListener(function(request, sender, response) {
    console.log(request,sender,response);
    satellite.info.innerText=
    console.warn("偷天换日;"+request.linkName+"命中!");

});


