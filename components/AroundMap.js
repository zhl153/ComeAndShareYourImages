import React, {Component} from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
} from "react-google-maps";
import { AroundMarker } from './AroundMarker'
import {POS_KEY, TOPIC_AROUND} from "../constants";

class NormalAroundMap extends Component {
    reloadMarker = () => {
        const center = this.getCenter();
        console.log(center);
        const radius = this.getRadius();

        this.props.loadPostsByTopic(center, radius);
        // const { topic, loadNearbyPosts, loadFacesAroundTheWorld } = this.props;
        // if (topic === TOPIC_AROUND) {
        //     loadNearbyPosts(center, radius);
        // } else {
        //     loadFacesAroundTheWorld();
        // }
    };
    getCenter(){
        const center = this.map.getCenter();
        return {lat:center.lat(), lon: center.lng()}
    }
    getRadius = () => {
        const center = this.map.getCenter();
        const bounds = this.map.getBounds(); // 东北，西南
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new window.google.maps.LatLng(center.lat(), ne.lng()); // google加入window
            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right); // 计算距离
        }
    };
    getMapRef = (mapInstance) => {
        this.map = mapInstance;
        window.map = mapInstance;
    }; // 获取instance

    render() {
        const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
        console.log("map");
        console.log(this.props.posts);
        return (
            <GoogleMap
                ref={this.getMapRef}
                defaultZoom={2}
                defaultCenter={{ lat, lng: lon }}
                onDragEnd={this.reloadMarker}
                onZoomChanged={this.reloadMarker}
            >
                {this.props.posts.map((post) => <AroundMarker post={ post } key={post.url}/>)}
            </GoogleMap>
        );
    }
}

export const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));