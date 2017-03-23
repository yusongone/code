var staticData={
};
var Page=window.Page||{};
var nowTabId;




var requestWatcher=(function(){
    var requests={};
    var redirectRuquest={};

    function SelfRequest(id){
        this.id=id;
        this.url=null;
    }

    setInterval(function(){
        var d=new Date().getTime();
        for(var i in requests){
            var time=requests[i].time;
            if(d-time>30000){
                delete requests[i];
            }
        }
    },30000);

    return {
        see(details,mergeLink,link){
            const id=details.requestId;
            requests[id]=new SelfRequest(id);
            requests[id].targetLink=mergeLink;
        },
        addReferer(details){
            for(var id in requests) {
                if (requests[id].targetLink == details.url) {
                    if (requests[id]) {
                        var referer = null;
                        details.requestHeaders.forEach(function (item) {
                            if (item.name == "Referer") {
                                referer = item.value;
                            }
                        });
                        requests[id].referer = referer;
                    }
                }
            }
        },
        addResponeseHeader(details){
            console.log(details.url);
            var origin=false,credentials=false;
            for(var id in requests){
                if(requests[id].targetLink==details.url){
                    details.responseHeaders.forEach(function(item){
                        if(item.name=="Access-Control-Allow-Origin"){
                            var u=new URL(requests[id].referer);
                            item.value=u.origin;
                            origin=true;
                        }else if(item.name=="Access-Control-Allow-Credentials"){
                            item.value="true";
                            credentials=true;
                        };
                    });
                    if(!credentials){
                        details.responseHeaders.push({"name":"Access-Control-Allow-Credentials","value":"true"});
                    }
                    //details.responseHeaders.push({"name":"Access-Control-Allow-Headers","value":"*, X-Requested-With, Content-Type"});
                    delete requests[id];
                }
            }
            return {responseHeaders:details.responseHeaders};
        }
    }
})();

function activeLinkFilter(callback){
    var groups=Page.Storage.getData().groups;
    for(var i in groups) {
        var group = groups[i];
        if (group.checked && group.links) {
            group.links.forEach(function(link){
                if(link.checked) {
                    callback(link, group);
                }
            });
        }
    }
};

function checkHitAndMergeLink(originLink,requestLink){
    if(originLink.type){ //强制比对
        if(requestLink==originLink.origin){
            return originLink.target;
        }
    }else{
        try{
            var ol=new URL(originLink.origin);
            var rl=new URL(requestLink);
            var sameProtocol=ol.protocol==rl.protocol;
            var sameHostName=ol.hostname==rl.hostname;
            var includePath=rl.pathname.indexOf(ol.pathname)==0;
            if(sameProtocol&&sameHostName&&includePath){
                var url=originLink.target+rl.pathname.substr(ol.pathname.length,rl.pathname.length-ol.pathname.length)+rl.search;
                return url;
            }
        }catch(e){
            return null;
        }
    }
    return null;
}

const A={};
function add(id,key){
    if(!A[id]){
        A[id]=[];
    }
    A[id].push(key);
}

//发起请求前 1
chrome.webRequest.onBeforeRequest.addListener(function(details){
    add(details.requestId,"OBR");
    let mergeLink=null;
    var redirectUrl;
      activeLinkFilter(function(checkedLink,group){
        mergeLink=checkHitAndMergeLink(checkedLink,details.url);
        if(mergeLink){//命中匹配项
            Page.ChangezhengFive.checkLaunch({info:checkedLink.name,group:group});//通知浏览器命中
            requestWatcher.see(details,mergeLink);
            redirectUrl={redirectUrl: mergeLink};
        }
    });
    if(redirectUrl){
        return redirectUrl;
    }
    return {cancel: false}
},{urls:["<all_urls>"]},["blocking"]);


//发起Header前 2
chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
    add(details.requestId,"OBSH"+":"+details.url);

    requestWatcher.addReferer(details);

},{urls:["<all_urls>"]},["requestHeaders"]);

//接收Header前 3
chrome.webRequest.onHeadersReceived.addListener(function(details){
    add(details.requestId,"OHR");
    return requestWatcher.addResponeseHeader(details);

},{urls:["<all_urls>"]},["responseHeaders","blocking"]);

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
                        self.launch(item);
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
    chrome.tabs.getSelected(null,function(tab) {
        staticData.pageUrl=tab.url;
    });
});

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


