import React from "react"
import {
    Form, // 注意这个库
    Input,
    Button,
    Tooltip,
    Icon,
    message,
} from 'antd';
import {Link} from "react-router-dom";
import {API_ROOT} from "../constants";

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = e => { // 按钮操作
        e.preventDefault(); // 阻挡form的默认操作，->/action
        this.props.form.validateFieldsAndScroll((err, values) => { //form：high order component lib中的，“AndScroll”会顶端，validateField检查
            if (!err) {
                console.log('Received values of form: ', values); // 无错误。。。
                fetch(`${API_ROOT}/signup`, { // 回promise进行操作
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
                        message.success('Registration succeed!'); // antd库
                        this.props.history.push('/login'); // Route自带一个props.hist，push入hist则访问新页面
                    })
                    .catch((err) => { // 挂
                        console.error(err);
                        message.error('Registration failed.');
                    });
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        // getFieldDecorator来自Form，最后调用时产生提醒
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className={"register"}>
                <Form.Item
                    label={
                        <span>
                            <Tooltip title="What do you want others to call you?">
                <Icon type="info-circle" />
              </Tooltip>
            </span>} colon={false}
                >
                {getFieldDecorator('username', {
                    rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
                })(<Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                />)}

            </Form.Item>
            <Form.Item label={
                <span>
              {/*Password&nbsp;*/}
                    <Tooltip title="Your password should not include your username or real name. It should contain at least two types of characters (lowercase, uppercase, numbers, punctuation).">
                <Icon type="info-circle" />
              </Tooltip>
            </span>
            }colon={false}
                       hasFeedback>
                {getFieldDecorator('password', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            validator: this.validateToNextPassword,
                        },
                    ],
                })(<Input.Password
                    prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Password"
                />)}
            </Form.Item>
            <Form.Item label={
                <span>
              {/*Confirm Password&nbsp;*/}
                    <Tooltip title="Enter your password again.">
                <Icon type="info-circle" />
              </Tooltip>
            </span>}colon={false}
                       hasFeedback>
                {getFieldDecorator('confirm', {
                    rules: [
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        {
                            validator: this.compareToFirstPassword,
                        },
                    ],
                })(<Input.Password
                    prefix={<Icon type="monitor" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Confirm password"
                    onBlur={this.handleConfirmBlur} />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout} className={'text'}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                    <p>
                        Already have an account?
                        <Link to="/login"> Login now!</Link>
                    </p>
                </Form.Item>

            </Form>
        );
    }
}

export const Register = Form.create({ name: 'register' })(RegistrationForm); // Form.create返回一个函数，用RegistrationForm生成node
