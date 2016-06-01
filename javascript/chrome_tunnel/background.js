var staticData={
}
var page={};
var cache={};
var nowTabId;
var newLoading=false;

var cc=[];



function checkHit(originLink,requestLink){
    var ol=new URL(originLink);
    var rl=new URL(requestLink);
    if(ol.protocol==rl.protocol&&ol.hostname==rl.hostname&&ol.pathname==rl.pathname){
        return true;
    }
    return false;
}

function requestCallback (details) {
    console.log(details.url);

    var groups=Page.Storage.getData().groups;
        for(var i in groups){
            var group=groups[i];
            if(group.checked&&group.links){
                for(j=0;j<groups[i].links.length;j++){
                    var link=groups[i].links[j];
                    if(link.checked&&checkHit(link.origin,details.url)){
                        console.log("=================================",new Date().getTime());
                        cc.push(link.name);
                        return {redirectUrl: link.target};
                    };
                }
            }
        }
    return {cancel: false};
}

chrome.webRequest.onBeforeRequest.addListener(requestCallback,{urls:["<all_urls>"]},["blocking"]);

chrome.tabs.onUpdated.addListener(function(tabid,changeInfo,tab){
    if(changeInfo.status=="loading"){
        console.log("--------------------------------------",nowTabId);
        newLoading=true;

        getTrans(nowTabId,function(){
            chrome.tabs.sendMessage(nowTabId,{linkName:cc},function(){
                console.log(";asdlkfj;alsdkfj;alsdf",details.tabId,nowTabId);
            });
        });
    }else if(changeInfo.status=="complete"){

    }
});
chrome.tabs.onCreated.addListener(function(tab){
    console.log("created");
});
chrome.tabs.onActivated.addListener(function(tab){
    nowTabId=tab.tabId;
});
chrome.webRequest.onCompleted.addListener(function(details){
},{urls:["<all_urls>"]},["responseHeaders"]);

/*



/*
chrome.webNavigation.onTabReplaced.addListener(function(details){
    console.log(",,,,,,,,,,,,,,,,"+details.tabId);
});
chrome.webNavigation.onCreatedNavigationTarget.addListener(function(details){
    console.log("+++++++++++++++++++++++"+details.tabId);

});
chrome.webNavigation.onCommitted.addListener(function(details){
    console.log("..................."+details.tabId);
});
chrome.webNavigation.onBeforeNavigate.addListener(function(details){
    //console.clear();
    console.log("--------------------"+details.tabId);
    cache={tabId:details.tabId};
});
chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
    console.log("===================="+details.tabId);
});
chrome.webNavigation.onCompleted.addListener(function(details) {
    console.log("*********************"+details.tabId);
});


*/

chrome.contextMenus.create({
    "id":"chrome_tunnel",
    "title":"偷天换日",
    "contexts":["all"],
    "onclick":function(info, tab){
        return;
    }
}, function(err){
    console.log(err);
});

function getTrans(tab,callback){
    chrome.tabs.insertCSS(nowTabId,{file:"/css/content.css"});
    chrome.tabs.executeScript(nowTabId, {file: "/js/page_content.js"},function(){
        callback();
    });
}


