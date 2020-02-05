import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App";
import { Provider } from "react-redux";
import axios from "axios";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./redux/reducers";
axios.defaults.withCredentials = true;

const renderApp = async () => {
    const state = await axios.get("http://localhost:8080/api/user/login")
    .then( res => {
        if (res.data.user) {
            return res.data.user;
        };
        return;
    });
    
    const store = createStore(reducer, state, applyMiddleware(thunk));   
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>, 
        document.getElementById("root"));
};

( async () => renderApp())();

