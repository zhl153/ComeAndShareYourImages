import React from 'react';
import { Tabs, Spin, Row, Col, Radio } from 'antd';
import {
    API_ROOT,
    AUTH_HEADER,
    GEO_OPTIONS,
    POS_KEY,
    TOKEN_KEY,
    POST_TYPE_IMAGE,
    POST_TYPE_VIDEO,
    POST_TYPE_UNKNOWN,
    TOPIC_AROUND, TOPIC_FACE
} from "../constants";
import {Gallery} from "./Gallery";
import { CreatePostButton } from './CreatePostButton';
import { AroundMap } from "./AroundMap";

const { TabPane } = Tabs;

export class Home extends React.Component {
    state = {
        isLoadingGeoLocation: false,
        isLoadingPosts: false,
        error: '',
        posts: [],
        topic: TOPIC_AROUND,
    };
    componentDidMount() {
        // 加载地理位置
        if ("geolocation" in navigator) {
            this.setState({isLoadingGeoLocation: true});
            /* geolocation is available */
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailLoadGeoLocation,
                GEO_OPTIONS  // settings
            );
        } else {
            /* geolocation IS NOT available */
            this.setState({ error: 'GeoLoaction is not supported '})
        }
    };

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        const {latitude, longitude} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude})); // save position
        this.setState({isLoadingGeoLocation: false, error: ''}); // finish setting
        this.loadNearbyPosts();
    };

    onFailLoadGeoLocation = () => {
        localStorage.setItem(POS_KEY, JSON.stringify({lat: 0, lon: 0})); // save default location
        this.setState({isLoadingGeoLocation: false, error: 'fail to load'});
    };

    loadNearbyPosts = (center, radius) => { // 加载图片发request
        const {lat,lon} = center ? center : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 10000;
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({isLoadingPosts: true, error:''});
        return fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`,{
            method:'GET',
            headers: {
                Authorization: `${AUTH_HEADER} ${token}` // 记住加空格
            }
        })
            .then((response) => {
                if(response.ok){
                    return response.json(); // 用json提取string
                }
                throw new Error('fail to load post')
            })
            .then((data) => {
                console.log('loadNearbyPosts');
                console.log(data);
                this.setState({posts: data ? data : [], isLoadingPosts: false})
            })
            .catch((e) => {
                console.log(e);
                this.setState({isLoadingPosts: false, error:e.message});
            });
    };

    // renderImagePosts() { // 不同状态生成不同页面
    //     const {error, isLoadingGeoLocation, isLoadingPosts, posts} = this.state;
    //     if(error){
    //         return error;
    //     }else if (isLoadingGeoLocation){
    //         return <Spin tip="Loading GeoLocation ..."/>;
    //     }else if (isLoadingPosts){
    //         return <Spin tip="Loading images ..."/>;
    //     }else if (posts.length > 0){
    //         // {
    //         //     user: PropTypes.string.isRequired,
    //         //         src: PropTypes.string.isRequired,
    //         //     thumbnail: PropTypes.string.isRequired,
    //         //     caption: PropTypes.string,
    //         //     thumbnailWidth: PropTypes.number.isRequired,
    //         //     thumbnailHeight: PropTypes.number.isRequired
    //         // }
    //         console.log("rendering images");
    //         const images = posts
    //             .filter((post) => post.type === 'image')
    //             .map((post) => {
    //             return {
    //                 user: post.user,
    //                 src: post.url,
    //                 thumbnail: post.url,
    //                 caption: post.message,
    //                 thumbnailWidth: 400,
    //                 thumbnailHeight: 300,
    //             }
    //         });
    //         return <Gallery images={images}/>;
    //     }else{
    //         return 'No nearby posts';
    //     }
    // }

    renderImagePosts() {
        const { posts } = this.state;
        const images = posts
            .filter((post) => post.type === POST_TYPE_IMAGE)
            .map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    caption: post.message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                };
            });
        return <Gallery images={images}/>
    }

    renderVideoPosts() {
        const { posts } = this.state;
        return (
            <Row gutter={30}>
                {
                    posts
                        .filter((post) => [POST_TYPE_VIDEO, POST_TYPE_UNKNOWN].includes(post.type))
                        .map((post) => (
                            <Col span={6} key={post.url}>
                                <video src={post.url} controls={true} className="video-block"/>
                                <p>{post.user}: {post.message}</p>
                            </Col>
                        ))
                }
            </Row>
        ); // 设置格式
    }

    renderPosts(type) {
        const { error, isLoadingGeoLocation, isLoadingPosts, posts } = this.state;
        if (error) {
            return error;
        } else if (isLoadingGeoLocation) {
            return <Spin tip="Loading geo location..."/>;
        } else if (isLoadingPosts) {
            return <Spin tip="Loading posts..."/>
        } else if (posts.length > 0) {
            return type === POST_TYPE_IMAGE ? this.renderImagePosts() : this.renderVideoPosts();
        } else {
            return 'No nearby posts';
        }
    }

    handleTopicChange = (e) => {
        const topic = e.target.value;
        console.log(topic);
        this.setState({ topic }); // = { topic: topic }
        if (topic === TOPIC_AROUND) {
            this.loadNearbyPosts();
        } else {
            this.loadFacesAroundTheWorld();
        }
    };

    loadFacesAroundTheWorld = () => {
        const token = localStorage.getItem(TOKEN_KEY);
        // API_ROOT/cluster?term=face
        this.setState({isLoadingPosts: true, error:''});
        return fetch(`${API_ROOT}/cluster?term=face`, {
            method: 'GET',
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`,
            },
        })
            .then((response) => {
                if(response.ok){
                    return response.json();
                }
                throw new Error('Failed to load posts')
            })
            .then((data) => {
                // console.log('loadFacesAroundTheWorld');
                // console.log(data);
                // this.setState({post: data ? data : [], isLoadingPosts: false});
                this.setState({ posts: data ? data : [], isLoadingPosts: false}); // postS!!!
            })
            .catch((e) => {
                console.log(e);
                this.setState({isLoadingPosts: false, error: e.message});
            });
    };

    loadPostsByTopic = (center, radius) => {
        if (this.state.topic === TOPIC_AROUND) {
            return this.loadNearbyPosts(center, radius);
        } else {
            console.log("load faces");
            return this.loadFacesAroundTheWorld();
        }
    };

    render() {
        // const operations = <Button type={"primary"}>Create New Post</Button>;
        const operations = <CreatePostButton
            // loadNearbyPosts={this.loadNearbyPosts}
            // loadFacesAroundTheWorld={this.loadFacesAroundTheWorld}
            // topic={this.state.topic}
            loadPostsByTopic={this.loadPostsByTopic}
        />;
        return (
            <div>
                <Radio.Group onChange={this.handleTopicChange} value={this.state.topic}>
                    <Radio value={TOPIC_AROUND}>Posts Around Me</Radio>
                    <Radio value={TOPIC_FACE}>Faces Around the World</Radio>
                </Radio.Group>
            <Tabs tabBarExtraContent={operations} className={"home"}>
                <TabPane tab="Image Posts" key="1">
                    {this.renderPosts(POST_TYPE_IMAGE)}
                </TabPane>
                <TabPane tab="Video Posts" key="2">
                    {this.renderPosts(POST_TYPE_VIDEO)}
                </TabPane>
                <TabPane tab="Map" key="3">
                    <AroundMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `500px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        posts={this.state.posts}
                        // loadNearbyPosts={this.loadNearbyPosts}
                        // loadFacesAroundTheWorld={this.loadFacesAroundTheWorld}
                        // topic={this.state.topic}
                        loadPostsByTopic={this.loadPostsByTopic}
                    />
                </TabPane>
            </Tabs>
            </div>
        );
    }
}
