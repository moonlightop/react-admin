import React, { Component } from 'react'
import { List,Card, message } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import LinkButton from '@/components/LinkButton'
// import MyNavLink from '@/components/MyNavLink'
import './index.less'

import {
  GetCategoryName
} from '@/api'

export default class Detail extends Component {
  
  state = {
    pCategoryName: '',
    categoryName: '',


    dataSource: [],
    loading: true
  }

  goBack = () => {
    this.props.history.goBack()
  }
  // 获取分类的名称
  getCategoryName = async () => {
    
    let { state: { product: { name,desc,price,categoryId,pCategoryId,imgs,detail } } } =  this.props.location
    // console.log(imgs)
    this.setState({
      loading: true
    })

    if (pCategoryId === '0') {
      // 如果是一级分类列表，它没有父类！‘
      let res = await GetCategoryName(categoryId)
      console.log(categoryId,res)
      let { status,data } = res
      if (status === 0) {
        let categoryName = data.name
        this.setState({
          categoryName
        })

      } else {
        message.error('请求分类名称失败')
      }

    } else {
      let res = await Promise.all([GetCategoryName(pCategoryId),GetCategoryName(categoryId)])
      let { status:pStatus,data:pData } = res[0]
      let { status,data } = res[1]
      // console.log(pCategoryId,categoryId,res)
      if (pStatus === 0 && status === 0) {
        let pCategoryName = pData.name
        let categoryName = data.name
        this.setState({
          pCategoryName,
          categoryName
        })

      } else {
        message.error('请求分类名称失败')
      }

    }
  
    let { pCategoryName,categoryName } = this.state
    // console.log(pCategoryName,'-----------',categoryName)
    
    // console.log('detail-imgs：',imgs)

    const dataSource = [
      <>
        <span className="detail-list-left">商品名称</span>
        <h1 className="detail-list-right">{name}</h1>
      </>,
      <>
        <span className="detail-list-left">商品描述</span>
        <h1  className="detail-list-right">{desc}</h1>
      </>,
        <>
        <span className="detail-list-left">商品价格</span>
        <h1  className="detail-list-right">{price}</h1>
      </>,
      <>
        <span className="detail-list-left">商品分类</span>
        <h1  className="detail-list-right">
          {pCategoryName ? `${pCategoryName}-` : pCategoryName}{categoryName}
        </h1>
      </>,
      <>
        { 
          imgs.length === 0 ? '' : 
          <>
            <span className="detail-list-left">商品图片</span> 
            <div  className="detail-list-right"> 
              {
                imgs.map((item,index) => {
                  return <img 
                      src={ typeof item === 'object' ? item.url : ("http://120.55.193.14:5000/upload/" + item)} 
                      key={ -index }
                      className="detail-img" 
                      alt={`img-${ typeof item === 'object' ? item.name : item}`} // 无法显示图像时显示的提示信息
                      title={'image' + index} // 聚焦时显示此文本
                    />
                })
              }
            </div>
          </>
        }
      </>,
      <>
        <span className="detail-list-left">商品详情</span>
        <div dangerouslySetInnerHTML={{__html: detail}} className="detail-img" ></div>
      </>,
    ]

    this.setState({
      dataSource,
      loading: false
    })

  }

  // 为何说异步事件不放在componentWillMount中 ? 
  //  因为生命周期函数是同步执行
  //  可能还没获取到数据就render了,因此一般放在componentDid配合this.setState
  //  如果说
  UNSAFE_componentWillMount() {
    // console.log(pCategoryName,categoryName)
    this.getCategoryName()

    this.title = (
      <>
        <LinkButton onClick={this.goBack}>返回</LinkButton>
        <ArrowRightOutlined style={{margin: '0 8px'}}/>
        <span>商品详情</span>
      </>
    )

  }

  componentDidMount() {
    this.getCategoryName()
  }

  render() {
    let { title } = this
    let { dataSource,loading } = this.state
    // console.log(dataSource,title)

    return (
      <>
        <Card 
          title={title} 
          style={{ width: '100%' }}
        >

          <List
            size="large"
            bordered
            dataSource={dataSource}
            split
            renderItem={item => <List.Item >{item}</List.Item>}
            loading={loading}
          /> 

        </Card>
      </>
    )

  }
}
