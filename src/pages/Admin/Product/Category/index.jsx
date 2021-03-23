
import React, { Component } from 'react'
import { Space,Button,Card,Table, message, Modal } from 'antd'
import { PlusOutlined,ArrowRightOutlined } from '@ant-design/icons'
import {
  GetCategorys,
  AddCategory,
  UpdateCategoryName
} from '@/api/index'
import LinkButton from '@/components/LinkButton'

import Modify from './Modify'
import Add from './Add'

export default class Category extends Component {

  state = {
    categorys: [],
    subCategorys: [],
    parentId: '0',
    name: '',
    loading: true,
    showStatus: 0, // 0 修改和添加类的对话框都不显示，1 显示修改类的对话框，2 显示添加类的对话框
    loadSub: false,
  }

  //  获取分类列表并修改state
  /*
      1. 传入parentId参数时,根据传入的parentId更新分类列表
      2. 默认根据this.state.parentId来更新分类列表
  */
  getCategorys = async ({parentId}=this.state) => {

    this.setState({
      loading: true,
    })
    
    let { data: categorys,status } = await GetCategorys(parentId)
    
    if (status === 0) {
      // 判断是一级分类还是二级分类
      if (parentId === '0') {
        // 一级分类列表
        this.setState({
          categorys,
          loading: false,
        })

      } else {
        // 二级分类列表
        this.setState({
          subCategorys: categorys,
          loading: false,
        })

      }

    } else {
      message.error('获取分类列表失败')
    }

  }

  //  修改parentId和name，获取二级分类列表并修改state
  getSubCategorys = async (category) => {

    this.category = category
    let { _id,name } = category

    this.setState({
      parentId: _id,
      name
    },() => {
      // 获取二级分类列表并修改state
      this.getCategorys()
    })

  }

  // 返回展示一级列表
  showCategorys = () => {
    this.setState({
      parentId: '0',
      loadSub: false,
    })
  }

  // 为render准备数据
  UNSAFE_componentWillMount() {
    //  1. 获取表格的列名
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
        width: '70%'
      },
      {
        title: '操作',
        // render函数，antd组件内部传了对应的dataSource过来
        render: (category) => (
          <>
            <Space size="middle">
              <LinkButton onClick={() => { this.showModifyCategory(category) }}>修改类名</LinkButton>
              {
                category.parentId === '0' ? <LinkButton onClick={() => { 
                  this.setState({ loadSub: true })
                  this.getSubCategorys(category) 
                }}>查看子类</LinkButton> : ''
              }
            </Space>
          </>
        )
      },
    ]
    // 2. 添加按钮
    this.extra = (
      <>
        <Button type="primary" onClick={this.showAddCategory}>
          <PlusOutlined />
          <span>添加</span>
        </Button>
      </>
    )
  }

  // 做异步请求，走更新
  componentDidMount() {
    // 异步获取一级分类列表展示
    this.getCategorys()
  }
  


  // 确认修改分类
  confirmModify = () => {

    this.form.validateFields().then(async values => {
      // 1. 获取所需请求参数
      let _id = this.category._id
      let { categoryName } = values
      // console.log(_id,categoryName)
      // 2. 发送网络请求更新数据
      let {status} = await UpdateCategoryName(_id,categoryName)
      if (status === 0) {
        // 3. 重新发送网络请求获得最新数据，然后渲染分类列表
        // console.log("status：",status)
        message.success('修改类名成功')
        this.getCategorys()
      } else {
        message.error('修改类名失败')
      }

    }).catch(reason => {
      message.error('修改类名时表单提交失败:',reason)
    })

    // 如何获取到categoryId呢
    this.setState({
      showStatus: 0
    })
    
  }
  // 确认添加分类
  confirmAdd = () => {

    this.form.validateFields().then(async values => {
      // 1. 隐藏对话框
      this.setState({
        showStatus: 0
      })
      // 2. 获取请求参数
      // let { parentId,categoryName } = this.form.getFieldValue()
      let { parentId,categoryName } = values
      // console.log(parentId,categoryName)

      // // 3. 发送网络请求实现添加子类
      let { status } = await AddCategory(parentId,categoryName)
      if (status === 0) { 
        message.success('添加分类成功')
        // 4. 添加成功
        if (this.state.parentId === parentId) {
          // 添加处于当前 分类列表的类 才重新渲染
          this.getCategorys() 
        } else if (parentId === '0') {
          // 二级列表下添加一级列表的类,只更新一级分类列表this.state.category
          this.getCategorys('0')
        }
      } else {
        message.error('添加分类失败')
      }

    }).catch(reason => {
      message.error('添加分类验证失败')
    })

  }



  // 显示修改类名对话框
  showModifyCategory = (category) => {
    this.category = category
    this.setState({
      showStatus: 1
    })
  }
  // 显示添加分类对话框
  showAddCategory = () => {
    this.setState({
      showStatus: 2
    })
  }
  // 取消或关闭均不显示
  hidenCategory = () => {
    this.setState({
      showStatus: 0
    })
  }


  render() {
    console.log('render')
    let { categorys,loading,parentId,name,subCategorys,showStatus } = this.state
    let { extra,columns } = this
    let category = this.category || {}

    return (
      <>
        <Card 
          title={ 
            parentId === '0' ? '一级分类列表' : 
            <div>
              <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
              <ArrowRightOutlined style={{marginRight: '5px'}}/>
              <span>{name}</span> 
            </div>
          }
          extra={extra} 
          style={{ width: '100%' }}
        >
          <Table 
            bordered={true}
            dataSource={ parentId === '0' ? categorys : subCategorys} 
            columns={columns} 
            rowKey='_id' // 每行以dataSource的_id作为key
            loading={loading}
            pagination={{
              defaultPageSize:5,
              showQuickJumper:true 
            }}
          />
        </Card>


        <Modal 
          title="修改类名" 
          visible={showStatus === 1}
          onOk={() => this.confirmModify()}
          onCancel={() => this.hidenCategory()}
          cancelText="取消"
          okText="确认"
          destroyOnClose
          style={{marginTop: '110px'}}
        >
          {/* 
            如何传分类名呢？ 
            Card组件中render那个函数
          */}
          <Modify category={category} setForm={(form) => {this.form = form}}/>
        </Modal>

        <Modal 
          title="添加分类" 
          visible={showStatus === 2}
          onOk={() => this.confirmAdd()}
          onCancel={() => this.hidenCategory()}
          cancelText="取消"
          okText="确认"
          destroyOnClose
          style={{marginTop: '110px'}}
        >
          <Add categorys={categorys} parentId={parentId} setForm={(form) => {this.form = form}}/>
        </Modal>

      </>
    )
  }

}
