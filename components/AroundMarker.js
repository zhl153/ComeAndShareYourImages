import React, {Component} from 'react';
import {InfoWindow, Marker} from "react-google-maps";
import PropTypes from 'prop-types'
import blueMarkerUrl from '../assets/images/blue-marker.svg';

export class AroundMarker extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired, // 验证调用时传入了position
    }
    state = {
        isOpen: false, // 是否打开
    }

    handleToggle = () => {
        this.setState((prevState) => ({isOpen: !prevState.isOpen,})); // 再按一下关闭
    }
    render() {
        const {user, message, url, location, type} = this.props.post; // 传入的位置信息
        const {lat, lon} = location;
        const isImagePost = type === 'image';
        const customIcon = isImagePost ? undefined : {
            url: blueMarkerUrl,
            scaledSize: new window.google.maps.Size(26, 41),
        };
        return (
            <Marker
                position={{lat, lng: lon}}
                onMouseOver={isImagePost ? this.handleToggle : undefined}
                onMouseOut={isImagePost ? this.handleToggle : undefined}
                onClick={isImagePost ? undefined: this.handleToggle}
                icon={customIcon}
            >
                {this.state.isOpen ? (
                    <InfoWindow>
                        <div>
                            {isImagePost
                                ? <img src={url} alt={message} className="around-marker-image"/>
                                : <video src={url} controls className="around-marker-video"/>}
                            {/*<img src={url} alt={message} className={"around-marker-image"}/>*/}
                            <p>{`${user}:${message}`}</p>
                        </div>
                    </InfoWindow>
                ) : null}
            </Marker>
        );
    }
}
