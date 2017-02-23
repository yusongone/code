
import React, {Component} from "react"
import {connect} from "react-redux"



class App extends Component{
    render(){
        var self=this;
        setTimeout(function(){

            var a=self.props.addCount(123);
        },3000);

        return <div>123:{this.props.abc}:{this.props.bcd}</div>
    }
}

function select(state){//action
    console.log(state);
    return {
        abc:state.reducer1,
        bcd:state.reducer1
    }
}


var actions={
    "addCount":function(a){
        console.log(a);
        return {
            type:"add Count"
        }
    }
}



export default connect(select,actions)(App);