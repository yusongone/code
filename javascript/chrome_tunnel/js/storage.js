var Page=window.Page||{};
Page.Storage=(function(){
    var changeHandlers=[];
    function updateLocalStorage(){
        var str=JSON.stringify(_storage);
        localStorage.Data=str;
        fireChange();
    }
    if(!localStorage.Data){
        localStorage.Data=JSON.stringify({
            groups:{}
        });
    }
    var _storage=JSON.parse(localStorage.Data);

    function fireChange(){
        for(var i=0;i<changeHandlers.length;i++){
            changeHandlers[i](_storage);
        }
    }

    return {
        addGroup(jsonData,callback){
            if(!_storage.groups[jsonData.name]){
                _storage.groups[jsonData.name]={
                    checked:true,
                    name:jsonData.name,
                    desc:jsonData.desc,
                    links:[]
                };
                callback({err:false});
            }else{
                callback({err:true,errMsg:"分组已经存在!"});
            }
            updateLocalStorage();
        },
        addLink(json,callback){
            json.link.checked=true;
            _storage.groups[json.group].links.push(json.link);
            updateLocalStorage();
            callback({err:false});
        },
        setGroupChecked(json,callback){
            _storage.groups[json.group.name].checked=json.checked;
            console.log(_storage);
            updateLocalStorage();
            //callback({err:false});
        },
        updateLinkData(json,callback){
            var group=_storage.groups[json.group.name];
            for(var i=0;i<group.links.length;i++){
                if(group.links[i].name==json.link.name){
                    for(var j in json.data){
                        group.links[i][j]=json.data[j]
                        console.log(group.links[i]);
                    }
                }
            }
            updateLocalStorage();
            //callback({err:false});
        },
        onChange(handler){
            changeHandlers.push(handler);
        },
        getData(){
            _storage=JSON.parse(localStorage.Data);
            window._storage= _storage;
            return _storage;
        }
    }
})();
