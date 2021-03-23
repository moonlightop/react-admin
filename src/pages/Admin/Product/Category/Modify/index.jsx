import React, { Component } from 'react'
import {
  Form,
  Input,
} from 'antd'
import PropTypes from 'prop-types'

export default class Modify extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired
  }

  formRef = React.createRef() // 不兼容，用尼玛呢！！！

  componentDidMount() {
    // console.log(this.formRef.current.getFieldValue('categoryName'))
    let { setForm } = this.props
    setForm(this.formRef.current)
  }

  render() {
    let { category } = this.props

    return (
      <>
      {/* 
       
      */}
        <Form
          ref={this.formRef} // 记得在current里面呀！！！
          layout="vertical"
          preserve={false}
          initialValues={{
            categoryName: category.name
          }}
          rules={[
            {required: true,whitespace: true}
          ]} 
        >
          <Form.Item
            name="categoryName"
          >
            <Input placeholder="请输入分类的名称" autoComplete="off" allowClear/>
          </Form.Item>

        </Form>
      </>
    )
  }
}
