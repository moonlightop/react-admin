
import React, { Component } from 'react'
import { Form,Input } from 'antd'

export default class MyUpdateCategory extends Component {

  formRef = React.createRef()

  componentDidMount() {
    let {setForm} = this.props
    setForm(this.formRef.current)
  }

  render() {
    let {formRef} = this

    return (
      <>
        <Form
          layout='vertical'
          ref={formRef}
          preserve={false}
        >
          <Form.Item
            rules={[
              { 
                required: true,
                whitespace: true,
                message: '类名不能为空', 
              },
            ]}
            name="categoryName"
          >
            <Input placeholder="请输入新的类名" autoComplete="off"/>
          </Form.Item>

        </Form>
      </>
    )
  }
}
