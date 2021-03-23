
import React, { PureComponent } from 'react'
import { Tree, Input, Form } from 'antd'
import navConfig from '@/config/navConfig'
import PropTypes from 'prop-types'

export default class CreateRole extends PureComponent {

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    const { role:{menus} } = this.props

    this.state = {
      menus,
    }
  }

  static propTypes = {
    role: PropTypes.object.isRequired
  }

  UNSAFE_componentWillMount() {
    this.initialData()
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // 更新role
    const menus = nextProps.role.menus
    // 1. 不建议用setState方式修改，因为这样会 更新，浪费了   
    this.setState({
      menus,
    })
    // this.state.menus = menus
  }

  // 初始化属性组件的数据
  initialData = () => {
    // console.log(navConfig)
    this.treeData = navConfig
  }

  // 父组件调用此方法得到选中的权限
  getPower = () => {
    return this.state.menus
  }

  // 树形组件，选择复选框时触发
  onCheck = (checkedKeys) => { 
    this.setState({
      menus: checkedKeys
    })

  }


  render() {
    const { treeData } = this
    const { menus } = this.state
    const { role } = this.props 
    // console.log(menus)

    return (
      <>
        <Form.Item 
          label="用户名"
        >
          <Input disabled value={role.name} style={{marginLeft: '15px',width:'75%'}}/>
        </Form.Item>
        <Tree

          checkable
          defaultExpandAll={true}
          checkedKeys={menus} // 使得选中受控（this.state.menus控制）

          onCheck={this.onCheck}
          selectable={false}

          treeData={treeData}
        />
      </>
    )
  }

}
