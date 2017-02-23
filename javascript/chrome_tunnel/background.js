var staticData={
}
var Page=window.Page||{};
var cache={};
var nowTabId;

var hited=[];



function checkHit(originLink,requestLink){
    try{
        var ol=new URL(originLink.origin);
        var rl=new URL(requestLink);
        var sameProtocol=ol.protocol==rl.protocol;
        var sameHostName=ol.hostname==rl.hostname;
        var includePath=rl.pathname.indexOf(ol.pathname)==0;
        if(sameProtocol&&sameHostName&&includePath){
            return originLink.target+rl.pathname.substr(ol.pathname.length,rl.pathname.length-ol.pathname.length);
        }
    }catch(e){
        return null;
    }
    return null;
}

function requestCallback (details) {
    var groups=Page.Storage.getData().groups;
        for(var i in groups){
            var group=groups[i];
            if(group.checked&&group.links){
                for(j=0;j<groups[i].links.length;j++){
                    var link=groups[i].links[j];
                    var mergeLink=checkHit(link,details.url);
                    if(link.checked&&mergeLink){
                        Page.ChangezhengFive.checkLaunch({info:link.name,group:group});
                        return {redirectUrl: mergeLink};
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
        launch:function(data){
            chrome.tabs.sendMessage(nowTabId,{data:data},function(){
            });
        },
        checkLaunch:function(jsonObj){
            var self=this;
            if(!self.conquerTab[nowTabId]||self.conquerTab[nowTabId].status=="revolt"){
                self.conquerTab[nowTabId]={
                    status:"conquering" //unConquer, conquering, conquered
                };
                Q._cacheInfo(nowTabId,jsonObj);
                goConquer(nowTabId,function(){
                    self.conquerTab[nowTabId].status="conquered";
                    Q._readInfo(nowTabId,function(item){
                        self.launch(jsonObj);
                    });
                });
            }else{
                if(self.conquerTab[nowTabId].status=="conquering"){
                    Q._cacheInfo(nowTabId,jsonObj);
                }else if(self.conquerTab[nowTabId].status=="conquered"){
                    self.launch(jsonObj);
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


