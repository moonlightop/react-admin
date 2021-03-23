
import React, { Component } from 'react'
import LinkButton from '@/components/LinkButton'
import {
  GetCategorys,
  UpdateCategoryName,
  AddCategory
} from '@/api'
import { Card,message,Table,Button,Modal } from 'antd'
import { PlusOutlined,ArrowRightOutlined } from '@ant-design/icons'
import MyUpdateCategory from './MyUpdateCategory'
import MyAddCategory from './MyAddCategory'


export default class MyCategory extends Component {

  state = {
    parentId: '0',
    categorys: [],
    subCategorys: [],
    status: 0, // 0 均不展示, 1展示修改类名对话框, 2展示添加类名对话框
    title: '', // 存储进入二级分类的一级标题
    loading: true,
  }

  // 获取最新的分类列表数据
  getCategorys = async ({parentId}=this.state) => {

    this.setState({
      loading: true
    })    
    let {status,data} = await GetCategorys(parentId)
    this.setState({
      loading: false
    })
  
    if (status === 0) {
      if (parentId === '0') {
        // 更新一级分类列表
        this.setState({
          categorys: data,
        })
      } else {
        // 更新二级分类列表
        // console.log('subCategorys')
        this.setState({
          subCategorys: data,
        })
      }

    } else {
      message.error("获取分类列表失败")
    }

  }

  // 查看二级分类列表
  showSubClass = (category) => {
    // 保存当前展开二级分类列表的父级
    let {_id:parentId,name:title} = category
    // console.log(category,title)
    this.setState({
      parentId,
      title,
    },() => {
      // 获取最新的二级分类列表数据
      this.getCategorys()
    })
  }

  // 二级分类列表返回一级分类列表
  showOneClass = () => {
    this.setState({
      parentId: '0',
    })
  }

  // 显示修改类名对话框
  showModify = (category) => {
    this.category = category
    this.setState({
      status: 1
    })
  }

  // 显示添加类对话框
  showAdd = () => {
    this.setState({
      status: 2
    })
  }

  // 修改分类成功
  modifyOk = () => {

    this.form.validateFields().then(async values => {

      // 1. 获取到改类的categoryId,categoryName
      let {_id:categoryId} = this.category
      let {categoryName} = values

      // 2. 发送网络请求修改类名
      let {status} = await UpdateCategoryName(categoryId,categoryName)
      if (status === 0) {
        // 3. 需要重新渲染改分类列表
        this.getCategorys()

      } else {
        message.error("修改类名失败")
      }


    }).catch(reason => {
      message.error(String(reason))
    })
    
    // 如何获取到categoryId呢
    this.setState({
      status: 0
    })


  }
  // 添加分类成功
  addOk = () => {

    this.form.validateFields().then(async values => {
      let {parentId,categoryName} = values
      let {status} = await AddCategory(parentId,categoryName)

      if (status === 0) {
        if (parentId === this.state.parentId) {
          // 在当前分类中添加分类,需要重新渲染
          this.getCategorys()
        } else if(parentId === '0') {
          // 添加的是显示列表的父级分类,不用重新渲染,但需要重新获取最新数据到this.state.categorys
          this.getCategorys('0')
        }
        // 一级分类列表获取二级分类列表,不需要处理,因为点击查看时会重新请求最新数据

      } else {
        message.error('添加分类失败')
      }

    }).catch(reason => {
      message.error(String(reason))
    })

    // 成功后隐藏对话框
    this.setState({
      status: 0
    })

  }

  // 隐藏对话框
  hidenModal = () => {
    this.setState({
      status: 0
    })
  }

  // 同步准备render函数需要的数据
  UNSAFE_componentWillMount() {
    // 准备columns数据
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'c_name',
        width: '75%'
      },
      {
        title: '操作',
        key: 'c_operation',
        render: (category) => {
          return (
            <>
              <LinkButton style={{marginRight: '5px'}} onClick={() => {this.showModify(category)}}>修改类名</LinkButton>
              {
                category.parentId === '0' ? <LinkButton onClick={() => {this.showSubClass(category)}}>查看子类</LinkButton> : ''
              }
            </>
          )
        }
      }
    ]
    this.extra = (
      <Button type="primary" onClick={this.showAdd}>
        <PlusOutlined />
        <span>添加</span>
      </Button>
    )
  }

  componentDidMount() {
    // 如果想实现，查看子类后，刷新仍然显示该子类，则需要持久化存储
    //    因为每次刷新，所有的模块重新加载初始化（可能使用缓存，就不需要网络请求了）
    this.getCategorys()
  }

  componentWillUnmount() {
    // 防止组件卸载后，还修改组件中的state状态
    this.setState = () => ({}) 
  }



  render() {
    let { categorys,status,title,parentId,subCategorys,loading } = this.state 
    const { extra,columns,addOk,hidenModal,showOneClass,modifyOk } = this

    return (
      <>
        <Card 
          title={ 
            parentId === '0' ? '一级分类列表' : 
            (
              <>
                <LinkButton onClick={showOneClass}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginLeft: '7px'}}/>
                <span> {title}</span>
              </>
            )
          } 
          extra={extra}
        >
        
          <Table 
            dataSource={parentId === '0' ? categorys : subCategorys} 
            columns={columns} 
            bordered
            rowKey='_id' // 以渲染的每一行的数据中的_id属性为key\
            loading={loading}
            pagination={{
              defaultPageSize: 7,
              showQuickJumper: true 
            }}
            destroyOnClose 
          />

        </Card>



        <Modal 
          title="修改类名" 
          visible={status === 1}  
          onOk={modifyOk} 
          onCancel={hidenModal}
          okText="确认"
          cancelText="取消"
          centered
          destroyOnClose 
        >
          <MyUpdateCategory setForm={(form) => {this.form = form}}/>
        </Modal>

        <Modal 
          title="添加分类" 
          visible={status === 2}  
          onOk={addOk} 
          onCancel={hidenModal}
          okText="确认"
          cancelText="取消"
          centered
          destroyOnClose 
        >
          <MyAddCategory categorys={categorys} parentId={parentId} setForm={(form) => {this.form = form}}/>
        </Modal>

      </>
    )
  }
}
