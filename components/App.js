import React from 'react';
import { TopBar } from "./TopBar"
import { Main } from "./Main"
import {TOKEN_KEY} from "../constants";
import { Icon } from 'antd';
import Foot from "./Foot"

import '../styles/App.css';

class App extends React.Component{
    state = {
        isLoggedIn: Boolean(localStorage.getItem(TOKEN_KEY)), // 查看是否logged in
    };

    handleLoginSucceed = (token) => {
        localStorage.setItem(TOKEN_KEY, token); // 保存token
        this.setState({ isLoggedIn: true });
        console.log("set state");
    };

    handleLogout = () => {
        console.log("logging out");
        localStorage.removeItem(TOKEN_KEY);
        this.setState({ isLoggedIn: false });
    };

    render(){
        return (
            <div className="App">
                <TopBar handleLogout={this.handleLogout} isLoggedIn={this.state.isLoggedIn}/>
                <Main handleLoginSucceed={this.handleLoginSucceed} isLoggedIn={this.state.isLoggedIn}/>
                <Foot/>
            </div>
        );
    }
}

export default App;
