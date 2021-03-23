import React, { Component } from 'react'
import {
  Form,
  Select,
  Input
} from 'antd'
import PropTypes from 'prop-types'

export default class Modify extends Component {
  static propTypes = {
    parentId: PropTypes.string.isRequired,
    categorys: PropTypes.array.isRequired,
    setForm: PropTypes.func.isRequired
  }


  formRef = React.createRef()

  componentDidMount() {
    let { setForm } = this.props
    // 暴露此组件的form给父组件
    setForm(this.formRef.current)

  }

  render() {
    //  categorys是一级分类列表，而category是当前选中的分类
    let { categorys,parentId } = this.props

    return (
      <>
        <Form
          layout="vertical" 
          preserve={false}
          ref={this.formRef}
          initialValues={{ 
            parentId: parentId, // 这样能动态匹配 Option中的value，parentId可能为一级分类列表的0，也可能是二级分类列表的 ._id
            categoryName: ''
          }}
        >

          <Form.Item
            name="parentId"
          >
            <Select>
              {/* 添加到一级分类列表 */}
              <Select.Option key={'0'} value={'0'}>一级分类列表</Select.Option>
              {/* 添加一级分类的子类 */}
              {
                categorys.map(ele => {
                  return <Select.Option 
                    key={ele._id} 
                    value={ele._id}>
                      {ele.name}
                    </Select.Option>
                })
              }
            </Select>
          </Form.Item>

          <Form.Item
            name="categoryName"
            rules={
              [{required: true,whitespace: true,message: '分类名称必须输入'}]
            } 
          >
            <Input placeholder="请输入分类名称" autoComplete="off" allowClear/>
          </Form.Item>
        
        </Form>

      </>
    )
  }
}
