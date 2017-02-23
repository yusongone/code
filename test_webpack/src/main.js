import React, {Component} from "react"
import ReactDOM from "react-dom"
import {createStore,combineReducers} from "redux"
//import {content} from "react-redux"
import {Provider,connect} from "react-redux"
import App from "./libs/test.js"




const store=createStore(combineReducers({
    reducer1:function(state=0,action){
        console.log("111",state,action);
        return 10;
    },
    reducer2:function(state,action){
        console.log("222",state,action);
        return 2;
    }
}));

ReactDOM.render(<div>
        <Provider  store={store}>
            <App/>
        </Provider>
    </div>,
    document.getElementById("canvas"));



//store.subscribe(function(a,b){
//    render();
//});

