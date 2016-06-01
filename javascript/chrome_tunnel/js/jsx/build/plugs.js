window.$View=(function(){

    var Item=React.createClass({displayName: "Item",
        getInitialState:function(){
            return {
                name:this.props.link.name,
                proxyLink:this.props.link.proxyLink
            }
        },
        render(){
            var self=this;
            var link=self.props.link;
            return React.createElement("li", {className: "item"}, 
                                React.createElement("span", null, 
                                    React.createElement("input", {type: "checkbox", className: "checkbox", 
                                        onChange: function(){
                                            Page.Storage.updateLinkData({
                                                group:self.props.group,
                                                link:link,
                                                data:{
                                                    checked:!!!link.checked
                                                }
                                            });
                                        }, 
                                        checked: link.checked}
                                    )
                                ), 
                React.createElement("span", {className: "itemName"}, link.name), 
                React.createElement("span", {className: "itemOriginLink"}, link.origin), 
                React.createElement("span", {className: "itemProxyLink"}, link.target)
            )
        }
    });

    var GroupItem=React.createClass({displayName: "GroupItem",
        getInitialState:function(){
            return {
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
            var items=this.props.group.links.map(function(item,index){
                return React.createElement(Item, {group: self.props.group, link: item, key: index})
            });
            var hide=this.state.status.hideArea?"hidden":"";
            var className="hideArea "+hide;
            return React.createElement("li", {className: "group"}, 
                React.createElement("div", {className: "bar", 
                     onClick: function(){
                        self.state.status.hideArea=!self.state.status.hideArea;
                        self.setState(self.state,function(){ });
                        return false;
                     }
                }, 
                    React.createElement("input", {type: "checkbox", className: "checkbox", 
                        onClick: function(e){
                            e.stopPropagation()
                        }, 

                        onChange: function(e,a,b){
                            Page.Storage.setGroupChecked({
                                group:self.props.group,
                                checked:!self.props.group.checked
                            },function(){

                            });
                        }, 
                        checked: this.props.group.checked}), 

                    this.props.group.name, 
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
            var self=this;
            var groups=Page.Storage.getData().groups;

            Page.Storage.onChange(function(jsonData){
                self.setState({
                    groups:jsonData.groups
                });
            });

            return {
                groups:groups
            }
        },
        getDefaultProps(){
        },
        componentWillReceiveProps(){

        },
        render(){
            var GroupItems=[];
            for(var i in this.state.groups){
                var item=this.state.groups[i];
                GroupItems.push(React.createElement(GroupItem, {group: item, key: i}));
            }


            return  React.createElement("ul", {className: "groupList"}, 
                        GroupItems
                    )

        }
    });
    return {
        init:function(parentDOM){
            ReactDOM.render(React.createElement(Group, null),parentDOM);
        }
    }
})();