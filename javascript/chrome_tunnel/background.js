var staticData={
}
var page={};
var newPage=false;
var cache=[];



chrome.browserAction.onClicked.addListener(function(){
});

function requestCallback (details) {
    newPage=false;

    var url = details.url;
    if(newPage){
        cache=[];
    }
    cache.push(url);


    return {cancel: false};

    for (var i = 0, len = ReResMap.length; i < len; i++) {
        var reg = new RegExp(ReResMap[i].req, 'gi');
        if (ReResMap[i].checked && ReResMap[i].res && reg.test(url)) {
            if (!/^file:\/\//.test(ReResMap[i].res)) {

                return {redirectUrl: url.replace(reg, ReResMap[i].res)};
            } else {

                return {redirectUrl: getLocalFileUrl(url.replace(reg, ReResMap[i].res))};
            }
        }
    }
    return true;
}


/*
chrome.webRequest.onCompleted.addListener(function(details){

},{urls:["<all_urls>"]},["responseHeaders"]);
*/

chrome.webRequest.onBeforeRequest.addListener(requestCallback,{urls:["<all_urls>"]},["blocking"]);


chrome.tabs.onActiveChanged.addListener(function(){
    console.log("abc");
    cache=[];
})

chrome.contextMenus.create({
    "id":"chrome_tunnel",
    "title":"偷天换日",
    "contexts":["all"],
    "onclick":function(info, tab){
        chrome.tabs.insertCSS(tab.id,{file:"/css/content.css"});
        return;
    }
}, function(err){
    console.log(err);
});


