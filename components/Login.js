import React from 'react';
import {Form, Icon, Input, Button, message} from 'antd';
import { Link } from 'react-router-dom'
import {API_ROOT} from "../constants";

class NormalLoginForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                fetch(`${API_ROOT}/login`, { // 回promise进行操作
                    method: 'POST',
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password
                    })
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.text(); // 成功回应
                        }
                        throw new Error(response.statusText); // 错误则。。。
                    })
                    .then((data) => { // 拿到了data。。。
                        console.log(data);
                        this.props.handleLoginSucceed(data); // 处理登录
                        message.success('Login succeed!'); // antd库
                    })
                    .catch((err) => { // 挂
                        console.error(err);
                        message.error('Login failed.');
                    });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </Form.Item>
                <Form.Item className={"text"}>
                    <div>
                        <Link className="login-form-forgot" to="/register">
                            Forgot password
                        </Link>
                    </div>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Don't have an account? <Link to="/register">Register now!</Link>
                </Form.Item>
            </Form>
        );
    }
}

export const Login = Form.create({ name: 'normal_login' })(NormalLoginForm);


