
import React, { Component } from 'react'
import { Form,Select,Input } from 'antd'

export default class MyUpdateCategory extends Component {

  formRef = React.createRef()

  componentDidMount() {
    const {setForm} = this.props
    setForm(this.formRef.current)
  }

  render() {
    const {formRef} = this
    const {categorys,parentId} = this.props
  
    // console.log(categorys)
    return (
      <>
        <Form
          initialValues={{ 
            parentId: parentId === '0' ? '0' : parentId, 
            categoryName: ''
          }}
          layout='vertical'
          ref={formRef}
          preserve={false}
        >

          <Form.Item
            name="parentId"
            style={{marginBottom: '40px'}}
          >
            <Select>
              <Select.Option value="0">一级分类列表</Select.Option>
              {
                categorys.map(ele => {
                  return <Select.Option key={ele._id} value={ele._id}>{ele.name}</Select.Option>
                })
              }
            </Select>

          </Form.Item>

          <Form.Item
            rules={[
              { required: true, whitespace: true, message: '类名不能空' }
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
