var Page=window.Page||{};
$(document).ready(function(){
    Page.App.init();
});


Page.App=(function(){
    var GroupsToolBar=(function(){
        var Dialog=React.createClass({
            getInitialState(){
                return{
                    show:true,
                    errMsg:"",
                    inputName:"",
                    inputDesc:""
                }
            },
            close(){
                this.props.onClose();
                this.state.show=false;
                this.setState(this.state);
            },
            ok(){
                var self=this;
                if(""==this.state.inputName){return}
                this.props.onOk({
                    name:this.state.inputName,
                    desc:this.state.inputDesc
                },function(result){
                    if(result.err){
                        console.log(result.errMsg);
                        self.setState({
                            errMsg:result.errMsg
                        });
                    }else{
                        self.setState({
                            errMsg:""
                        });
                    }
                });
            },
            componentWillReceiveProps(newProps){
                if(newProps.show==true){
                    this.state.show=true;
                    this.setState(this.state);
                }
            },
            render(){
                var self=this;
                if(!this.state.show){
                    return null;
                }
                var errMsg=null;
                if(this.state.errMsg!=""){
                    errMsg=<p className="errMsg">{this.state.errMsg}</p>;
                }
                return  <div className="dialog createGroup">
                            <div className="statusBar" >
                                <label className="title">{this.props.title}</label>
                                <div className="closeBtn" onClick={this.close} >&times;</div>
                            </div>
                            <div className="container">
                                <p>
                                    <label>名称 :</label>
                                    <input type="text" value={this.state.inputName} onChange={function(event){
                                        self.setState({
                                            inputName:event.target.value
                                        });
                                    }}/>
                                </p>
                                <p>
                                    <label>描述 :</label>
                                    <textarea value={this.state.inputDesc} onChange={function(event){
                                        self.setState({
                                            inputDesc:event.target.value
                                        });
                                    }} />
                                </p>
                                {errMsg}
                            </div>
                            <div className="btnBar">
                                <div className="btn" onClick={this.close} >取消</div>
                                <div className="btn ok" onClick={this.ok} >确定</div>
                            </div>
                        </div>
            }
        });

        var toolBar=React.createClass({
            componentDidMount() {
                var p = this.props.modalBoxId&& document.getElementById(this.props.modalBoxId);
                if (!p) {
                    var p = document.createElement('div');
                        p.setAttribute("class","overflow_layer");
                        p.style.display="none";
                    this.props.modalBoxId&&(p.id = this.props.modalBoxId);
                    document.body.appendChild(p);
                }
                this.DialogElement= p;
            },
            componentWillUnmount() {
                document.body.removeChild(this.DialogElement);
            },
            createDialog(){
                this.DialogElement.style.display="block";
                var self=this;
                ReactDOM.render(<Dialog
                                    show={true} title="创建组"

                                    onClose={function(){
                                        self.DialogElement.style.display="none";
                                    }}

                                    onOk={function(jsonData,callback){
                                        Page.Storage.addGroup(jsonData,function(result){
                                            callback(result);
                                            if(!result.err){
                                                self.DialogElement.style.display="none";
                                            }
                                        });
                                    }}
                                ></Dialog>,this.DialogElement);
            },
            render(){
                var self=this;
                return  <div className="toolBar">
                            <div className="btn" onClick={this.createDialog}>新建组</div>
                        </div>
            }
        });

        return toolBar;

    })();

    var Groups=(function(){
        var list=React.createClass({
            getInitialState(){
                var tempGroup="";
                for(var i in this.props.groups){
                    tempGroup=this.props.groups[i];
                    break;
                }
                return {
                   selectedGroup:tempGroup,
                    groups:this.props.groups
                }
            },
            componentDidMount() {
                this.props.onSelected(this.state.selectedGroup);
            },
            render(){
                var self=this;
                var li=[];
                for(var i in this.state.groups){
                    var className="group";
                    var tempGroup=this.props.groups[i];
                    if(self.state.selectedGroup.name==tempGroup.name){className+=" selected"}
                    li.push(<li
                        className={className}
                        onClick={(function(){
                            var d=i;
                            return function(){
                                var tempGroup=self.props.groups[d];
                                self.props.onSelected(tempGroup);
                                self.setState({
                                    selectedGroup:tempGroup
                                });
                            }
                        })()}
                        key={i} >
                            <input type="checkbox" checked={tempGroup.checked}
                                onClick={function(e){
                                    //e.preventDefault();
                                    //e.stopPropagation()
                                }}
                                onChange={(function(){
                                    var _tempGroup=tempGroup;
                                    return function(){
                                        self.props.onSetChecked({
                                            group:_tempGroup,
                                            checked:!_tempGroup.checked
                                        });
                                    }
                                })()}/>
                            <label> {tempGroup.name} </label>
                    </li>)
                }
                return  <div className="scrollBox">
                            <ul className="groups">
                                {li}
                            </ul>
                        </div>
            }
        });

        return list;

    })();


    var ListToolBar=(function(){

        var Dialog=React.createClass({
            getInitialState(){
                return{
                    show:true,
                    name:"",
                    errMsg:"",
                    origin:"",
                    target:""
                }
            },
            close(){
                this.props.onClose();
                this.state.show=false;
                this.setState(this.state);
            },
            ok(){
                var self=this;
                if(""==this.state.inputName){return}
                this.props.onOk({
                    link:{
                        name:self.state.name,
                        origin:self.state.origin,
                        target:self.state.target
                    }
                },function(result){
                    if(result.err){
                        console.log(result.errMsg);
                        self.setState({
                            errMsg:result.errMsg
                        });
                    }else{
                        self.setState({
                            errMsg:""
                        });
                    }
                });
            },
            componentWillReceiveProps(newProps){
                if(newProps.show==true){
                    this.state.show=true;
                    this.setState(this.state);
                }
            },
            render(){
                var self=this;
                if(!this.state.show){
                    return null;
                }
                var errMsg=null;
                if(this.state.errMsg!=""){
                    errMsg=<p className="errMsg">{this.state.errMsg}</p>;
                }
                return  <div className="dialog createLink">
                    <div className="statusBar" >
                        <label className="title">组:{this.props.title}</label>
                        <div className="closeBtn" onClick={this.close} >&times;</div>
                    </div>
                    <div className="container">
                        <p>
                            <label>名称 :</label>
                            <input type="text" className="name" value={this.state.name} onChange={function(event){
                                event.preventDefault();
                                self.setState({
                                    name:event.target.value
                                });
                            }}/>
                        </p>
                        <p>
                            <label>原生 :</label>
                            <input type="text" value={this.state.origin} onChange={function(event){
                                event.preventDefault();
                                        self.setState({
                                            origin:event.target.value
                                        });
                                    }}/>
                        </p>
                        <p>
                            <label>代理 :</label>
                            <input type="text" value={this.state.target} onChange={function(event){
                                event.preventDefault();
                                        self.setState({
                                            target:event.target.value
                                        });
                            }} />
                        </p>
                        {errMsg}
                    </div>
                    <div className="btnBar">
                        <div className="btn" onClick={this.close} >取消</div>
                        <div className="btn ok" onClick={this.ok} >确定</div>
                    </div>
                </div>
            }
        });

        var toolBar=React.createClass({
            getInitialState(){
                return{
                    group:this.props.group
                }
            },
            componentWillReceiveProps(newProps){
                this.setState({
                    group:newProps.group
                });
            },
            componentDidMount() {
                var p = this.props.modalBoxId&& document.getElementById(this.props.modalBoxId);
                if (!p) {
                    var p = document.createElement('div');
                    p.setAttribute("class","overflow_layer");
                    p.style.display="none";
                    this.props.modalBoxId&&(p.id = this.props.modalBoxId);
                    document.body.appendChild(p);
                }
                this.DialogElement= p;
            },
            createDialog(){
                var self=this;
                this.DialogElement.style.display="block";
                ReactDOM.render(<Dialog
                                    show={true} title={this.state.group.name}

                                    onClose={function(){
                                                        self.DialogElement.style.display="none";
                                                    }}

                                    onOk={function(jsonData,callback){
                                        jsonData.group=self.state.group.name;
                                        Page.Storage.addLink(jsonData,function(result){
                                            callback(result);
                                            if(!result.err){
                                                self.DialogElement.style.display="none";
                                            }
                                        });
                                    }}
                ></Dialog>,this.DialogElement);
            },
            render(){
                var self=this;
                return  <div className="toolBar">
                    <div className="btn" onClick={this.createDialog}>创建映射</div>
                </div>
            }
        });
        return toolBar;
    })();

    var Links=(function(){

        var links=React.createClass({
            render(){
                var self=this;
                var ary=this.props.group.links||[];
                var li=ary.map(function(item,index){
                    return  <li key={index} className="linkItem">
                                <div className="name">
                                    <input type="checkbox"
                                        checked={item.checked}
                                        onChange={function(){
                                            Page.Storage.updateLinkData({
                                                group:self.props.group,
                                                link:item,
                                                data:{
                                                    checked:!!!item.checked
                                                }
                                            });
                                        }} />
                                    <label>名称 :</label>{item.name}
                                    <i className="fa fa-pencil editIcon"></i>
                                </div>
                                <div className="origin">
                                    <p>
                                        <label>原生 :</label>
                                        {item.origin}
                                    </p>
                                </div>
                                <div className="target">
                                    <p>
                                        <label>目标 :</label>
                                        {item.target}
                                    </p>
                                </div>
                            </li>
                });
                return   <ul>
                            {li}
                         </ul>;
            }
        });

        return links;
    })();


    var App=React.createClass({
        getInitialState(){
            var self=this;
            var groups=Page.Storage.getData().groups;

            Page.Storage.onChange(function(jsonData){
                self.setState({
                    groups:jsonData.groups
                });
            });


            return {
                groups:groups,
                selectedGroup:{}
            }
        },
        render(){
            var self=this;
            return  <div className="pageContent">
                        <div className="catalog">
                            <div className="list">
                                <GroupsToolBar></GroupsToolBar>
                                <Groups
                                    groups={this.state.groups}
                                    onSelected={function(group){
                                        self.setState({
                                            selectedGroup:group
                                        });
                                    }}
                                    onSetChecked={function(json){
                                        Page.Storage.setGroupChecked({
                                            group:json.group,
                                            checked:json.checked
                                        },function(){

                                        });
                                    }}
                                ></Groups>
                            </div>
                        </div>
                        <div className="list">
                            <ListToolBar group={this.state.selectedGroup}></ListToolBar>
                            <div className="scrollBox bg">
                                <Links group={this.state.selectedGroup}></Links>
                            </div>
                        </div>
                    </div>
        }
    });

    return {
        init:function(){
            var parentDOM=document.getElementById("page");

            ReactDOM.render(<App></App>,parentDOM);
        }
    }
})();



