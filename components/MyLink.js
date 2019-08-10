import React, {Component} from 'react';
import {Icon} from "antd";

class MyLink extends Component {
    render() {
        return (
            <div>
                <a className={"my"} href={"https://github.com/zhl153/ComeAndShareYourImages.git"}>
                    <Icon type="github" theme="filled"/>{' '}About
                </a>
            </div>
        );
    }
}

export default MyLink;