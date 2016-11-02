var staticData={
}
var Page=window.Page||{};
var cache={};
var nowTabId;

var hited=[];



function checkHit(originLink,requestLink){
    try{
        var ol=new URL(originLink);
        var rl=new URL(requestLink);
        if(ol.protocol==rl.protocol&&ol.hostname==rl.hostname&&ol.pathname==rl.pathname){
            return true;
        }
    }catch(e){
        return false;
    }
    return false;
}

function requestCallback (details) {
    var groups=Page.Storage.getData().groups;
        for(var i in groups){
            var group=groups[i];
            if(group.checked&&group.links){
                for(j=0;j<groups[i].links.length;j++){
                    var link=groups[i].links[j];
                    if(link.checked&&checkHit(link.origin,details.url)){
                        console.log("hit",new Date().getTime());
                        Page.ChangezhengFive.checkLaunch(link.name);
                        return {redirectUrl: link.target};
                    };
                }
            }
        }
    return {cancel: false};
}

chrome.webRequest.onBeforeRequest.addListener(requestCallback,{urls:["<all_urls>"]},["blocking"]);

function checkHitPool(){
    if(hited.length>0){
        var tempAry=hited.concat([]);
        hited=[];
    }
}


//长征
(function(){
    var Q={
        _cacheInfo:function(tabId,info){
            if(!Q[tabId]){Q[tabId]=[]};
            Q[tabId].push(info);
        },
        _readInfo:function(tabId,handler){
            var tempInfo=Q[tabId].concat([]);
            var length=Q[tabId].length;
            for(var i=0;i<length;i++){
                var info=Q[tabId].shift(0);
                handler(info);
            };
        }
    };

    Page.ChangezhengFive={
        conquerTab:{},
        launch:function(info){
            chrome.tabs.sendMessage(nowTabId,{links:info},function(){
            });
        },
        checkLaunch:function(info){
            var self=this;
            if(!self.conquerTab[nowTabId]||self.conquerTab[nowTabId].status=="revolt"){
                self.conquerTab[nowTabId]={
                    status:"conquering" //unConquer, conquering, conquered
                };
                Q._cacheInfo(nowTabId,info);
                goConquer(nowTabId,function(){
                    self.conquerTab[nowTabId].status="conquered";
                    Q._readInfo(nowTabId,function(item){
                        self.launch(item);
                    });
                });
            }else{
                if(self.conquerTab[nowTabId].status=="conquering"){
                    Q._cacheInfo(nowTabId,info);
                }else if(self.conquerTab[nowTabId].status=="conquered"){
                    self.launch(info);
                }
            }
        }
    }
})();

chrome.tabs.onUpdated.addListener(function(tabid,changeInfo,tab){
    if(changeInfo.status=="loading"){
        if(Page.ChangezhengFive.conquerTab[tabid]){
            Page.ChangezhengFive.conquerTab[tabid].status="revolt";
        };
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

function goConquer(tab,callback){
    chrome.tabs.insertCSS(nowTabId,{file:"/css/content.css"});
    chrome.tabs.executeScript(nowTabId, {file: "/js/page_content.js"},function(){
        callback();
    });
}


