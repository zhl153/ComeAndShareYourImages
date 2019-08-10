import React, {Component} from 'react';
import {Icon} from "antd";

class Foot extends Component {
    render() {
        return (
            <div className={"footer"}>
                <ul className={"unordered"}>
                    <li className={"list"}><a href={"https://github.com/zhl153/ComeAndShareYourImages.git"}><Icon type="info-circle" theme="filled" />{' '}Owner: Zheng Li</a></li>
                    <li className={"list"}><a href={"https://ucsd.edu/"}><Icon type="read" theme="filled"/>{' '}University of California, San Diego</a></li>
                    <li className={"list"}><a href={"mailto:zhl153@ucsd.edu"}><Icon type="mail" theme="filled" />{' '}E-mail: zhl153@ucsd.edu</a></li>
                </ul>
            </div>
        );
    }
}

export default Foot;