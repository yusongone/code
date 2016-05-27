window.$View=(function(){

    var Mock={
        Groups:[
            {
                "groupName":"粉丝趴1",
                "checked":false,
                childs:[
                    {
                        "name":"main.js",
                        "originLink":"http://g.assets.daily.taobao.net/base-tech-fe/ysf-fansparty/bundle.js",
                        "proxyLink":"http://g.assets.daily.taobao.net/base-tech-fe/ysf-fansparty/bundle.js",
                        "checked":true
                    },
                    {
                        "name":"node.js",
                        "originLink":"http://g.assets.daily.taobao.net/base-tech-fe/ysf-fansparty/bundle.js",
                        "proxyLink":"http://g.assets.daily.taobao.net/base-tech-fe/ysf-fansparty/bfefeundle.js",
                        "checked":true
                    }
                ]
            },
            {
                "groupName":"粉丝趴1",
                "checked":true,
                childs:[
                    {
                        "name":"main.js",
                        "originLink":"http://g.assets.daily.taobao.net/base-tech-fe/ysf-fansparty/bundle.js",
                        "proxyLink":"http://g.assets.daily.taobao.net/base-tech-fe/ysf-fansparty/bundle.js",
                        "checked":true
                    },
                    {
                        "name":"node.js",
                        "originLink":"http://g.assets.daily.taobao.net/base-tech-fe/ysf-fansparty/bundle.js",
                        "proxyLink":"http://g.assets.daily.taobao.net/base-tech-fe/ysf-fansparty/bfefeundle.js",
                        "checked":true
                    }
                ]
            },
            {
                "groupName":"粉丝趴2",
                "checked":true,
                childs:[
                    {
                        "name":"main.js",
                        "proxyLink":"http://g.assets.daily.taobao.net/base-tech-fe/ysf-fansparty/bundle.js"
                    }
                ]
            }

        ]

    }
    localStorage.time=new Date();

    var Item=React.createClass({displayName: "Item",
        getInitialState:function(){
            return {
                checked:this.props.data.checked,
                name:this.props.data.name,
                proxyLink:this.props.data.proxyLink
            }
        },
        render(){
            return React.createElement("li", {className: "item"}, 
                                React.createElement("span", null, 
                                    React.createElement("input", {type: "checkbox", className: "checkbox"})
                                ), 
                React.createElement("span", {className: "itemName"}, this.state.name), 
                React.createElement("span", {className: "itemProxyLink"}, this.state.proxyLink)
            )
        }
    });

    var GroupItem=React.createClass({displayName: "GroupItem",
        getInitialState:function(){
            return {
                data:{
                    checked:this.props.data.checked,
                    childs:this.props.data.childs,
                    name:this.props.data.groupName
                },
                status:{
                    hideArea:true
                }
            }
        },
        componentWillReceiveProps(){
            console.log("fefe");
        },
        render(){
            var self=this;
            var items=this.state.data.childs.map(function(item,index){
                return React.createElement(Item, {data: item, key: index})
            });
            var hide=this.state.status.hideArea?"hidden":"";
            var className="hideArea "+hide;
            return React.createElement("li", {className: "group"}, 
                React.createElement("div", {className: "bar", onClick: function(){
                    self.state.status.hideArea=!self.state.status.hideArea;
                    self.setState(self.state,function(){ });
                    return false;
                }}, 
                    React.createElement("input", {type: "checkbox", className: "checkbox", 
                        onClick: function(e){
                            e.stopPropagation()
                        }, 

                        onChange: function(e,a,b){
                            self.state.data.checked=!self.state.data.checked;
                            self.setState(self.state,function(){ });
                        }, 
                        checked: self.state.data.checked}
                    ), 

                    this.state.data.name, 
                    React.createElement("div", {className: "drop"}, "v"), 
                    React.createElement("div", {className: "checkedCount"}, "1/2")
                ), 
                React.createElement("div", {className: className}, 
                    React.createElement("ul", null, 
                        items
                    )
                )
            )
        }
    });

    var Group=React.createClass({displayName: "Group",
        getInitialState:function(){
            return {
                groups:Mock.Groups
            }
        },
        getDefaultProps(){
            return {
                Groups:Mock.Groups
            }
        },
        componentWillReceiveProps(){

        },
        render(){
            var GroupItems=this.state.groups.map(function(item,index){
                return React.createElement(GroupItem, {data: item, key: index})
            });


            return React.createElement("ul", {className: "groupList"}, 
                GroupItems, 
                React.createElement("li", {className: "groupItem"}, 
                    React.createElement("div", {className: "bar"}, 
                        React.createElement("input", {type: "checkbox", className: "checkbox"}), 
                        "奇门接入", 
                        React.createElement("div", {className: "drop"}, "v"), 
                        React.createElement("div", {className: "checkedCount"}, "1/2")
                    ), 
                    React.createElement("div", {className: "hideArea"}, 
                        React.createElement("ul", null

                        )

                    )
                )
            )

        }
    });
    return {
        init:function(parentDOM){
            ReactDOM.render(React.createElement(Group, null),parentDOM);
        }
    }
})();