
import React, { Component } from 'react'
import './index.less'
import { Redirect } from 'react-router-dom' 

import { Form, Input, Button, message} from 'antd'
import { UserOutlined,LockOutlined } from '@ant-design/icons'

import { connect } from 'react-redux'
import { login } from '@/redux/actions/user'


class Login extends Component {

  onFinish = async (values) => {
    const { username,password } = values
    const { login,user } = this.props
    login(username,password)
    if (user.errMsg) {
      message.error(user.errMsg)
    } else {
      message.success(`${username}用户登录成功`)
    }
    this.props.history.replace('/')

  }
  
  onFinishFailed = () => {
    console.log('检验失败的回调')
  }


// 自定义验证
  validatorPassword = (rule, value) => {
    // console.log('@validatorPassword：',rule,value)
    if (value.length < 4) {
      return Promise.reject('密码必须大于4位')
    } else if (value.length > 13) {
      return Promise.reject('密码必须小于13位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return Promise.reject('密码必须由数字 字母 下划线组成')
    }

    return Promise.resolve()

  }


  render() {

    const { user } = this.props
    if (user._id) {
      return <Redirect to='/'/>
    }

    return (
      <div className="login">
        <header>
          <p>React后台管理平台</p>
        </header>
        <div className="content">
          <section>
            <p className="title">用户登录界面</p>

            <Form
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <Form.Item
                name="username"
                rules={[
                  { 
                    required: true,
                    whitespace: true,
                    message: 'Please input your username!', 
                  },
                  {
                    max: 12,
                    message: '账户不能长于12位'
                  },
                  {
                    min: 4,
                    message: '账户不能小于4位'
                  },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: '账户必须是由字母 数组 下划线组成'
                  }
                ]}
              >
                <Input autoComplete="off" placeholder="Please input your username" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input your password!',
                    },
                    {
                      validator: this.validatorPassword
                    }
                  ]}
                >
                <Input.Password autoComplete="off" placeholder="Please input your password" prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  登录
                </Button>
              </Form.Item>
              
            </Form>

          </section>
        </div>
       
      </div>
    )
  }
}

export default connect(state => ({
  user: state.user
}),{
  login
})(Login)