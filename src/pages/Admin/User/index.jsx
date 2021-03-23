
import React, { Component } from 'react'
import {
  AddUser,
  UpdateUser,
  GetUserList,
  DeleteUser
} from '@/api'
import LinkButton from '@/components/LinkButton'

import { Card,Table,Button, message,Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import AddUpdateUser from './AddUpdateUser'
import { formateDate } from '@/util/dateUtils'


export default class User extends Component {

  constructor(props) {
    super(props)

    this.state = {
      roles: [],
      users: [],
      showStatus: 'hide',
      loading: true
    }

  }

  initData = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render: role_id =>  this.roleNames[role_id]
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: formateDate
      },
      {
        title: '操作',
        render: (user) => {
          return (
            <>
              <LinkButton style={{marginRight:'15px'}} onClick={(e) => {this.showUpdate(user)}}>修改</LinkButton>
              <LinkButton onClick={(e)=>{this.deleteUser(user)}}>删除</LinkButton>
            </>
          )
        }
      },
    ]
  }
  initRoleNames = (roles) => {
    // Promsie - 同步执行更新
    const roleNames = roles.reduce((preValue,role) => {
     preValue[role._id] = role.name
     return preValue
   },{})
   this.roleNames = roleNames
 }

  UNSAFE_componentWillMount() {
    this.initData()
  }

  deleteUser = (user) => {

    Modal.confirm({
      title: `确认删除${user.username}用户 ?`,
      okText: '确认',
      cancelText: '取消',
      onOk: async() => {    
        const res = await DeleteUser(user._id)
        let { status } = res
        if (status === 0) {
          this.getUserList()
          message.success('删除用户成功')
        } else {
          message.errror('删除用户失败')
        } 

      }
      
    })

  }

  getUserList = async () => {
    this.setState({loading:true})
    const res = await GetUserList()
    this.setState({loading:false})

    let { status,data:{ users,roles } } = res
    if (status === 0) {
      // Promsie - 同步执行更新
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })

    } else {
      message.error('获取用户信息失败')
    }

  }

  confirmAdd = () => {
    this.form.validateFields().then(async values => {

      this.hide()
      const { username,password,phone,email,role_id } = values
      let user = { username,phone,email,role_id }

      let res 

      // 此处不想发送多余的参数过去
      console.log(!!this.user)
      if (this.user) {
        // 修改用户，有this.user
        user._id = this.user._id
        res = await UpdateUser(user)

      } else {
        // 添加用户，this.user为null
        user.password = password
        // console.log(user)
        res = await AddUser(user)
      }
      
      let { status,msg } = res
      // console.log(user,res)
      if (status === 0) { 
        // 此处不想再发送网络请求
        // const users = this.state.users
        // user = {...data} // 更新的用户信息
        // if (_id) {
        //   // 修改
        //   const newUsers = users.map(item => {
        //     if (item._id === user._id) return user
        //     return item
        //   })
        //   console.log(user)
        //   this.setState({users: newUsers})

        // } else {
        //   // 添加
        //   this.setState({users: [...users,user]})
        // }
        this.getUserList()

        message.success((this.user ? '修改' : '添加') + ('用户成功'))
      } else {
        message.error(msg)
      }

    }).catch(reason => {
      console.log(reason)
    })
  }

  componentDidMount() {
    // 1. 获取所有用户信息
    this.getUserList()
  }


  hide = () => {
    // console.log(this.form.resetFields)
    // this.form.resetFields()
    this.setState({
      showStatus: 'hide'
    })
  }
  showAdd = () => {
    this.user = null
    this.setState({showStatus:'AddUpdateUser'})
  }
  showUpdate = (user) => {
    this.user = user
    this.setState({showStatus:'AddUpdateUser'})
  }

  componentWillUnmount() {
    this.setState = () => ({})
  }

  render() {
    const title = (
      <Button type="primary" onClick={this.showAdd}>
        <span style={{marginRight: '5px'}}>添加用户</span>
        <PlusOutlined/>
      </Button>
    )

    const user = this.user || {} 
    const { showStatus,users,roles,loading } = this.state
    // console.log(user)
    // console.log(users,showStatus)
    // console.log(this.roleNames)
    // console.log(users)

    return (
      <>
        <Card 
          title={title}
          style={{width:'100%'}}
          bordered
        >
          
          <Table 
            dataSource={users} 
            columns={this.columns} 
            bordered
            rowKey='_id'
            pagination={{
              defaultPageSize: 7,
              showQuickJumper: true 
            }}
            loading={loading}
          />

        </Card>

        
        <Modal 
          title={user._id ? '修改用户信息' : '添加用户'}
          visible={showStatus === 'AddUpdateUser'}  
          onOk={this.confirmAdd} 
          onCancel={this.hide}
          okText="确认"
          cancelText="取消"
          destroyOnClose={true}
        >
          <AddUpdateUser setForm={(form) => {this.form = form}} user={user} roles={roles} />
        </Modal>


      </>
    )
  }
}
