
import React, { Component } from 'react'
import { Form,Input } from 'antd'
import PropTypes from 'prop-types'

export default class CreateRole extends Component {
  
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
  
  }

  static propTypes = {
    setForm: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { setForm } = this.props
    setForm(this.formRef.current)
  }

  render() {

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    return (
        <>
          <Form
            {...layout}
            name="form"
            ref={this.formRef}
            preserve={false}
          >
            <Form.Item
              label="角色名"
              name="roleName"
              rules={[{ required: true, whitespace: true, message: '角色名不能为空' }]}
            >
              <Input placeholder="请输入角色名"/>
            </Form.Item>
          </Form>
        </>
      )
    }
  }
