import React from 'react';
import logo from "../assets/images/icon3.png";
import { Icon } from 'antd';
import MyLink from "./MyLink";

export class TopBar extends React.Component {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <span className="App-title">Share Your Moments</span>
                {this.props.isLoggedIn ?
                    <a className="logout" onClick={this.props.handleLogout}>
                        <Icon type="logout"/>{' '}Logout
                    </a>
                    :
                    <MyLink/>
                }
            </header>
        );
    }
}