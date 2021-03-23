
import React, { Component } from 'react'
import { Form,Input,Select } from 'antd'
import PropTypes from 'prop-types'

export default class AddUpdateUser extends Component {
  
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  constructor(props) {
    super(props)
  
    this.formRef = React.createRef()

  }

  componentDidMount() {
    const { setForm } = this.props
    setForm(this.formRef.current)
  }

  render() {
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    }
    const { formRef } = this
    const { user,roles } = this.props
    // console.log(user)

    return (
      <>
        <Form
          ref={formRef}
          {...layout}
          initialValues={user}
          preserve={false}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, whitespace: true, message: '请输入用户名'}]}
          >
            <Input placeholder="请输入用户名"/>
          </Form.Item>

          {
            user._id ? null : 
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, whitespace: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码"/>
            </Form.Item>
          }

          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ required: true, whitespace: true, message: '请输入手机号' }]}
          >
            <Input placeholder="请输入手机号"/>
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, whitespace: true, message: '请输入邮箱' }]}
          >
            <Input placeholder="请输入邮箱"/>
          </Form.Item>

          <Form.Item
            label="角色"
            name="role_id"
            rules={[{ required: true, whitespace: true, message: '请选择角色' }]}
          >
            {/* 修改有默认选中 */}
            <Select placeholder="请选择角色">
              {
                roles.map(role => {
                  return <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
                })
              }
            </Select>
          </Form.Item>

        </Form>
      </>
    )
  }
}
