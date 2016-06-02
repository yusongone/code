console.log("偷天换日正在为您代理...");
chrome.extension.onMessage.addListener(function(request, sender, response) {
    console.warn("偷天换日命中 : "+request.links+"!");
});


