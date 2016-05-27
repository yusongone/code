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

    var Item=React.createClass({
        getInitialState:function(){
            return {
                checked:this.props.data.checked,
                name:this.props.data.name,
                proxyLink:this.props.data.proxyLink
            }
        },
        render(){
            return <li className="item">
                                <span>
                                    <input type="checkbox" className="checkbox"/>
                                </span>
                <span className="itemName">{this.state.name}</span>
                <span className="itemProxyLink">{this.state.proxyLink}</span>
            </li>
        }
    });

    var GroupItem=React.createClass({
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
                return <Item data={item} key={index}></Item>
            });
            var hide=this.state.status.hideArea?"hidden":"";
            var className="hideArea "+hide;
            return <li className="group">
                <div className="bar" onClick={function(){
                    self.state.status.hideArea=!self.state.status.hideArea;
                    self.setState(self.state,function(){ });
                    return false;
                }}>
                    <input type="checkbox" className="checkbox"
                        onClick={function(e){
                            e.stopPropagation()
                        }}

                        onChange={function(e,a,b){
                            self.state.data.checked=!self.state.data.checked;
                            self.setState(self.state,function(){ });
                        }}
                        checked={self.state.data.checked}
                    />

                    {this.state.data.name}
                    <div className="drop">v</div>
                    <div className="checkedCount">1/2</div>
                </div>
                <div className={className}>
                    <ul>
                        {items}
                    </ul>
                </div>
            </li>
        }
    });

    var Group=React.createClass({
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
                return <GroupItem data={item} key={index}/>
            });


            return <ul className="groupList">
                {GroupItems}
                <li className="groupItem">
                    <div className="bar">
                        <input type="checkbox" className="checkbox"/>
                        奇门接入
                        <div className="drop">v</div>
                        <div className="checkedCount">1/2</div>
                    </div>
                    <div className="hideArea">
                        <ul>

                        </ul>

                    </div>
                </li>
            </ul>

        }
    });
    return {
        init:function(parentDOM){
            ReactDOM.render(<Group />,parentDOM);
        }
    }
})();