
import React, { PureComponent } from 'react'
import { Card,Table,message,Button,Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { GetRole,AddRole,UpdateRole } from '@/api'
import { formateDate } from '@/util/dateUtils'

import CreateRole from './CreateRole'
import ModifyPower from './ModifyPower'
import { connect } from 'react-redux'

class Role extends PureComponent {
 
  constructor(props) {
    super(props)

    this.treeRef = React.createRef()

    this.state = {
      loading: true,

      roles: [],
      role:{},

      showStatus: 'hide',
    }
  }

  clickRow = (role) => {
    return {
      // 点击表格行触发事件
      onClick: event => {
        this.setState({
          role
        })
      }
    }
  }

  initialData = () => {
    // 1. 因为有动态的数据，不能放在componentWillMount中，那么直接在render中就好了
    // this.title = (
    //   <>
    //     <Button onClick={this.createRole} type="primary">
    //         <PlusOutlined/>
    //         <span style={{marginLeft: '3px'}}>创建角色</span>
    //       </Button>
    //     <Button type="primary" style={{marginLeft: '20px'}} 
    //       disabled={!this.state.role._id}>修改角色权限</Button>
    //   </>
    // )
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        width: '23.5%',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        width: '23.5%',
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        width: '23.5%',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'auth_name',
        width: '23.5%'
      },
    ]
  }
  // 预先准备一次性固定的数据，存入state
  UNSAFE_componentWillMount() {
    this.initialData()
  }

  getRoles = async () => {
    this.setState({loading:true})
    const res  = await GetRole()
    this.setState({loading:false})
    let { status,data } = res

    if (status === 0) {
      this.setState({
        roles: data
      })
    } else {
      message.error('获取角色列表数据失败')
    }

  }
  // 准备异步的一次性的固定数据，存入state
  componentDidMount() {
    this.getRoles()
  }
  
  hideRole = () => {
    this.setState({
      showStatus: 'hide'
    })
  }
  showCreate = () => {
    this.setState({
      showStatus: 'createRole'
    })
  }
  showModify = () => {
    this.setState({
      showStatus: 'modifyPower'
    })
  }

  createConfirm = () => {
    // 1. 进行添加角色的表单验证
    this.form.validateFields().then(async values => {
      const roleName = values.roleName
      // console.log(roleName)
      if (roleName) {
        this.hideRole()
      } 
      const res = await AddRole(roleName)
      let { status,data } = res

      if (status === 0) {
        let { roles } = this.state
        this.setState({
          roles: [...roles,data]
        },() => {
          message.success('添加角色成功')
        })
      } else {
        message.error('添加角色失败')
      }
    }).catch(reason => {
      message.error('表单验证失败-' + reason)
    })

  }

  modifyConfirm = async () => {
    this.hideRole()
    // 1. 获取请求所需参数
    const menus = this.treeRef.current.getPower()
    const { role } = this.state
    role.menus = menus
    role.auth_name = this.props.user.username
    const res = await UpdateRole(role)
   

    // 2. 更新页面渲染
    let { status } = res
    if (status === 0) {
      // 此处因为 role 在初始化时是引用值，所以修改了它即更新 roles中的那个角色
      message.success('更新角色权限成功')
      this.setState({
        // roles: [...this.state.roles]
        role: {...role}
      })
    } else {
      message.error('更新角色权限失败')
    }

  }

  componentWillUnmount() {
    this.setState = () => ({})
  }

  // 而在其它生命周期，需要再经过一次，它们所获取的数据才会，根据变量再去取得
  render() {

    const { columns } = this
    const { roles,loading,role,showStatus } = this.state
    const title = (
      <>
        <Button onClick={this.showCreate} type="primary">
            <PlusOutlined/>
            <span style={{marginLeft: '3px'}}>创建角色</span>
          </Button>
        <Button type="primary" style={{marginLeft: '20px'}} 
          disabled={!role._id} onClick={this.showModify}>修改角色权限</Button>
      </>
    )

    //  直接在 Table组件的columns里面的render函数中 进行时间的格式化
    // roles.forEach(role => {
    //   role.create_time = formateDate(role.create_time)
    //   role.auth_time = formateDate(role.auth_time)
    // })

    return (
      <>
        <Card 
          title={title} 
          style={{ width: '100%'}}
        >
          <Table 
            bordered={true}
            dataSource={roles} 
            columns={columns} 
            rowKey='_id' // 每行以dataSource的_id作为key
            loading={loading}
            pagination={{
              defaultPageSize:7,
              showQuickJumper:true 
            }}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: [role._id],
              onSelect: (role) => {
                this.setState({
                  role
                })
              }
            }}
            onRow={this.clickRow}
          />
        </Card>
        
        {/* 
          注意Modal组件，因为我是通过 visible来隐藏对话框的，也就是说它并没有销毁它
            即组件创建时的生命周期不会再走一次，
              而是走父组件render -> UNSAFE_componentWillReceiveProps
          
        */}
        <Modal 
          title="创建角色" 
          visible={showStatus === 'createRole'}
          onOk={this.createConfirm}
          onCancel={this.hideRole}
          cancelText="取消"
          okText="确认"
          // destroyOnClose // 配置此属性，每次点击隐藏对话框，都会删除Modal组件
          style={{marginTop: '100px'}}
        >
          <CreateRole setForm={(form) => {this.form = form}}/>
        </Modal>

        <Modal 
          title="修改角色权限" 
          visible={showStatus === 'modifyPower'}
          onOk={this.modifyConfirm}
          onCancel={this.hideRole}
          cancelText="取消"
          okText="确认"
          // destroyOnClose
        >
          <ModifyPower role={role} ref={this.treeRef}/>
        </Modal>

      </>
    )
  }
}


export default connect(state => ({
  user: state.user,
}),{

})(Role)