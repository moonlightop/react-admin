
import React, { Component } from 'react'
import { Card,Input,Button,Select,Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PAGE } from './constant.js'

import { 
  GetProductList,
  GetSearchList,
  UpdateStatus
} from '@/api'

import MyNavLink from '@/components/MyNavLink'

export default class Home extends Component {

  state = {
    loading: true,

    products: [],
    total: 0,
    pageNum: PAGE.pageNum,
    pageSize: PAGE.pageSize,

    searchValue: '',
    searchType: 'productName',

  }

  // 路由跳转时，保存pageNum
  savePageNum = () => {
    // console.log(this.state.pageNum)
    PAGE.pageNum = this.state.pageNum
  }

  UNSAFE_componentWillMount() {
    this.isSearch = false
    // 1. 为Table组件准备数据
    this.initTableData()
  }


  componentDidMount() {
    // 2. 准备Table的dataSource
    this.getProductList()
  }

  // 为Table组件准备数据
  initTableData = () => {
    // 1. 准备extra,title
    this.title = (
      <>
        {/* 建立受控组件间的联系,默认选中  */}
        <Select defaultValue={this.state.searchType} onChange={(value) => { this.setState({searchType: value})}}>
          <Select.Option value="productName">按商品名称搜索</Select.Option>
          <Select.Option value="productDesc">按商品描述搜索</Select.Option>
        </Select>
        <Input placeholder="请输入关键字" onChange={(e) => { 
          this.setState({searchValue: e.target.value}) 
        }} style={{marginRight: "8px",marginLeft: "8px",width:"200px"}}/>
        {/* 每次点击搜索获取第一页数据，但是分页器不是第一页呀，指定就是拉！！ */}
        <Button type="primary" onClick={(e) => { 
          this.isSearch = true
          this.getProductList(1) 
          this.isSearch = false
        }}>搜索</Button>
      </>
    )
    this.extra = (
      // 添加商品进行路由跳转
      <MyNavLink to={{
        pathname: "/products/manage/addupdate",
      }}>
        <Button type="primary" onClick={this.savePageNum}>
          <PlusOutlined style={{marginRight: "5px"}}/>  
          <span onClick={this.savePageNum}>添加商品</span>
        </Button>
      </MyNavLink>
    )
     // 3. 准备Table的columns
     this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        width: '20%'
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        width: '50%'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => ('￥' + price)
      },
      {
        title: '状态',
        render: (product) => {
          return (
            <>
              <Button type="primary" onClick={() => this.changeStatus(product)}>
                {
                  // 1是下架，2是上架
                  product.status === 1 ?  "上架" : "下架"
                }
              </Button>
              <p style={{marginTop: '3px',marginLeft: '3px'}}>
                {
                  product.status === 1 ? "已下架" : "在售"
                }
              </p>
            </>
          )
        }
      },
      {
        title: '操作',
        render: (product) => {
          return (
            <>
            {/* 点击详情页，切换路由显示，如何传递数据过去？路由参数 */}
              <MyNavLink to={{
                pathname: "/products/manage/detail",
                state: {
                  product
                }
              }} style={{display: 'block',marginBottom: '12px'}}><span onClick={this.savePageNum}>详情</span></MyNavLink>

              {/* 点击修改进行路由跳转，并进行路由传参 - state */}
              <MyNavLink to={{
                pathname: "/products/manage/addupdate",
                state: {
                  product
                }
              }}><span onClick={this.savePageNum}>修改</span></MyNavLink>
            
            </>
          )
        }
      },
    ]
  }

  // 切换商品的上架和下架状态
  //  通过this.columns的render函数中获取到商品
  changeStatus = async (product) => {
    // 1. 准备参数
    // console.log(product)
    let { status,_id:productId } = product
    // 2. 发送请求
    let { status:Status } = await UpdateStatus(productId,status === 1 ? 2 : 1)
    if (Status === 0) {
      // 如何去影响到页面发生变化呢？
        // 重新获取最新的商品信息
      message.success('更新商品状态成功')
      this.getProductList()

    } else {
      message.error('切换商品的上架或下架状态失败')
    }
    
  }

  // 获取当前页面的商品信息，根据关键字搜索对应的商品信息
  getProductList = async (pageNum,pageSize) => {
    pageNum = pageNum || this.state.pageNum
    pageSize = pageSize || this.state.pageSize
    // 获取所需参数
    this.setState({
      loading: true,
      pageNum,
      pageSize
    })
    let { searchType,searchValue } = this.state
    let { isSearch } = this

    // console.log(pageNum,pageSize)

    let res
    if (searchValue && isSearch) {
      // 搜索框有值，获取的是搜索框中的物品
      res = await GetSearchList({pageNum,pageSize,searchType,searchValue})

    } else {
      res = await GetProductList({pageNum,pageSize})
    }

    let { status,data:{list:products},data:{total} } = res

    if (status === 0) {
      this.setState({
        products,
        total,
        loading: false
      })

    } else {
      message.error('获取商品列表信息失败')
    }


  }

  componentWillUnmount() {
    this.setState = () => ({})
  }

  render() {
    const { title,extra,columns } = this
    const { products,total,loading,pageSize,pageNum } = this.state

    return (
      <>
        <Card 
          title={title} 
          extra={extra} 
          style={{ width: '100%' }}
        >

          <Table 
            dataSource={products} 
            columns={columns} 
            rowKey='_id'
            bordered
            pagination={{
              pageSize,
              current: pageNum,
              total,
              onChange: this.getProductList,
              showQuickJumper: true,
              showSizeChanger: false
            }}
            loading={loading}

          />

        </Card>
      </>
    )
  }
}
