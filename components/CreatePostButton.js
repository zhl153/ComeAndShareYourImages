import React from 'react';
import { Modal, Button,message } from 'antd';
import { CreatePostForm } from './CreatePostForm';
import {API_ROOT, AUTH_HEADER, TOKEN_KEY, POS_KEY, LOC_SHAKE, TOPIC_AROUND} from "../constants";

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => { // post image
        this.form.validateFields((err, values) => {
            console.log(values);
            if (!err) {
                const token = localStorage.getItem(TOKEN_KEY);
                const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
                this.setState({confirmLoading: true});
                const formData = new FormData();
                formData.set('lat', lat + LOC_SHAKE * (Math.random() * 2 - 1));
                formData.set('lon', lon + LOC_SHAKE * (Math.random() * 2 - 1));
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);

                this.setState({ confirmLoading: true });
                fetch(`${API_ROOT}/post`, {
                    method: 'POST',
                    headers: {
                        Authorization: `${AUTH_HEADER} ${token}`
                    },
                    body: formData,
                })
                    .then((response) => {
                        if (response.ok) {
                            console.log("response ok");
                            // return this.topic === TOPIC_AROUND
                            //     ? this.props.loadNearbyPosts()
                            //     : this.props.loadFacesAroundTheWorld();
                            return this.props.loadPostsByTopic();
                        }
                        throw new Error('Upload failed')
                    })
                    .then(() => {
                        console.log("load by topic");
                        this.setState({visible: false, confirmLoading: false});
                        message.success("Post created successfully!")
                        this.form.resetFields();
                    })
                    .catch((e) => {
                        console.log("Button did not fetch");
                        console.error(e);
                        message.error(e.message);
                        this.setState({confirmLoading: false});
                    });
            }
        });
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    getFormRef = (formInstance) => {
        this.form = formInstance;
    };


    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create new post"
                    visible={visible}
                    onOk={this.handleOk}
                    okText='Create'
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <CreatePostForm ref={this.getFormRef}/>
                </Modal>
            </div>
        );
    }
}