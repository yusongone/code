(function(factory){
    if(typeof(define)==="function"){
        define(factory());
    }else{
        window.DropMenu=window.DropMenu||{};
        factory(window.DropMenu);
    }
})(function(_obj){
    !_obj?_obj={}:"";

    function _contains(root, el) {
        if (root.compareDocumentPosition)
            return root === el || !!(root.compareDocumentPosition(el) & 16);
        if (root.contains && el.nodeType === 1){
            return root.contains(el) && root !== el;
        }
        while ((el = el.parentNode))
            if (el === root) return true;
        return false;
    }

    function _renderUI(option){
        var self=this;
        var _parentDOM=this._parentDOM;
        var _menuBox=document.createElement("div");
            _menuBox.setAttribute("class","drop_menu "+(option.class||""));
        _menuBox.setAttribute("tabindex",0);
        _parentDOM.appendChild(_menuBox);

        var titleDOM=document.createElement("div");
            titleDOM.innerHTML=option.title;
            titleDOM.setAttribute("class","menu_title");
        self.titleDOM=titleDOM;

        _menuBox.appendChild(titleDOM);
        self.menuBox=_menuBox;
    };

    function _checkMenuListDOM(){
        var self=this;
        if(!self.menuListDOM){
            var menuListDOM=document.createElement("div");
            menuListDOM.setAttribute("class","menu_items");
            menuListDOM.style.display="none";
            self.menuListDOM=menuListDOM;
            self.menuBox.appendChild(menuListDOM);
        }
    }

    function _DropMenu(option){
        var self=this;
        var _tempDOM=option.parentDOM;
        self._parentDOM=_tempDOM;
        self.status=false;
        self.onChangeHandler=option.onChange;
        self.childList=[];
        var blur;
        _renderUI.call(this,option);

        self.titleDOM.addEventListener("click",function(evt){
            evt.preventDefault();
            if(self.childList.length>0){
                self.trigger();
            };
            if(typeof(option.onClick)==="function"){
                option.onClick.call(self,evt);
            }
            return false;
        });

        if(option.childList&&option.childList.length>0){
            for(var i= 0,l=option.childList.length;i<l;i++){
                self.addItem(option.childList[i]);
            }
        }
        if(typeof(option.onBlur)=="funcition"){
            self.menuBox.addEventListener("blur",function(evt){
                setTimeout(function(){
                    var d=document.activeElement;
                    var ddd=_contains(self.menuBox,d);
                    if(ddd){
                        self.menuBox.focus();
                    }else{
                        option.onBlur? option.onBlur.call(self,evt):"";
                    }
                });
            },false);
        }
    }

    _DropMenu.prototype.trigger=function(action){
        var self=this;
        if(arguments.length==0){
            if(self.status){
                _close();
            }else{
                _open();
            }
        }else{
            if(action){
                _open();
            }else{
                _close();
            }
        }
        function _close(){
            self.status=false;
            self.menuListDOM.style.display="none";
            self.onChangeHandler?self.onChangeHandler.call(self,type):"";
        }
        function _open(){
            self.status=true;
            self.menuListDOM.style.display="block";
            self.onChangeHandler?self.onChangeHandler.call(self,type):"";
        }
    };

    _DropMenu.prototype.addItem=function(option){
        var self=this;
        _checkMenuListDOM.call(self);
        option.parentDOM=self.menuListDOM;
        var dm=new _DropMenu(option);
        self.childList.push(dm);
        return dm;
    };

    _DropMenu.prototype.addItems=function(ary){
        var self=this;
        for(var i=0;i<ary.length;i++){
            self.addItem(ary[i]);
        }
    };

    _DropMenu.prototype.getStatus=function(ary){
        return this.status;
    };

    _obj.init=function(option){
        return new _DropMenu(option);
    }

    return _obj;
});

