
import React, { Component } from 'react'
import { Card,Form,Input,Cascader,Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '@/components/LinkButton'
import {
  GetCategorys,
  AddOrUpdateProduct
} from '@/api'

import PitureWall from './PictureWall'
import EditorConvertToHTML from './Editor'
import PropTypes from 'prop-types'

export default class AddUpdate extends Component {

  static propTypes = {
    product: PropTypes.object,
  }

  constructor(props) {
    super(props)
    
    this.state = {
      // value作为key，label是显示的文本
      options: [],
    }

    this.formRef = React.createRef()
    this.pitureRef = React.createRef()
    this.editorRef = React.createRef()
  }


  goBack = () => {
    this.props.history.goBack()
  }
  // 自定义价格验证
  validatePricce = (rule,value) => {
    // console.log(parseInt(value))
    if (parseInt(value) <= 0) {
      return Promise.reject('价格必须大于0元')
    } 
    return Promise.resolve(value)
  }

  // 修改或添加商品的提交
  submit = (e) => {
    // 1. 触发表单验证
    // console.log(this.formRef.current.validateFields)
    this.formRef.current.validateFields()
      .then(async values => {
        // 1. 获取添加或修改商品，所需要的参数
        const imgs = this.pitureRef.current.getImgs()
        const detail = this.editorRef.current.getEditorHtml()
        const { name,desc,price,categorysId } = values

        let pCategoryId,categoryId = ''
        if (categorysId.length === 1) {
          pCategoryId = '0'
          categoryId = categorysId[0]
        } else {
          pCategoryId = categorysId[0]
          categoryId = categorysId[1]
        }
        const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}


        if (this.isUpdate) {
          // 修改商品，需要多获取_id
          product._id = this.product._id
        } 
        
        // 2. 发送请求添加或更新商品
        const res = await AddOrUpdateProduct(product)
        if (res.status === 0) {
          // 3. 添加商品成功返回的数据携带 data，修改商品成功返回的数据只有status === 0
          if (res.data) {
            console.log(res.data)
            message.success('添加商品成功')
          } else {
            message.success('修改商品成功')
          }
        } else {
          message.error((product._id ? '修改' : '添加') + ('商品失败'))
        }


      }).catch(reason => {  
        console.log(reason)
      })
  }



  UNSAFE_componentWillMount() {
    // 获取更新或修改商品时传过来的state路由参数，修改时有state.product，而更新时无state.product
    const state = this.props.location.state
    // 因为这个组件共用了 两个路由，修改商品路由传递了product，而添加商品路由不传递参数
    this.isUpdate = !!(state && state.product) 
    this.product = this.isUpdate ? state.product : {}

    this.title = (
      <>
        <LinkButton onClick={this.goBack}>
          <ArrowLeftOutlined style={{marginRight: '8px'}}/>
        </LinkButton> 
        <span>{this.isUpdate ? '修改商品' : '添加商品'}</span>
      </>
    )

  }





  componentDidMount() {
    this.getCategorys('0')
  }

  // 动态加载级联数据
    //  selectedOptions存放选择的框，因为允许选中多个，所以复数
  loadData = async (selectedOptions) => {
    // 选一个时 相当于  selectedOptions[0]
    const targetOption = selectedOptions[selectedOptions.length - 1]
    // console.log(targetOption)
    targetOption.loading = true
    // 获取级联数据
    let res = await this.getCategorys(targetOption.value)
    let { data } = res
    targetOption.loading = false

    if (data && data.length > 0) {
      let newOption = data.map(item => {
        return {
          value: item._id, // 用于与categorysId数组关联起来进行匹配
          label: item.name,
          isLeaf: true
        }
      })
      targetOption.children = newOption

    } else {
      // 体验不太好，但返回的接口并没有标注它是否有二级分类列表
      targetOption.isLeaf = true
    }

    this.setState({
      options: [...this.state.options]
    })

  }

  // 更新默认选中的一级、二级分类列表
  initOption = async (categorys) => {
    // 1. 更新一级分类列表
    let newOption = categorys.map(item => {
      return {
        value: item._id,
        label: item.name,
        isLeaf: false
      }
    })

    // 2. 判断是否有二级分类列表，有则获取并更新它
    let { product,isUpdate } = this
    let { pCategoryId } = product

    // console.log(pCategoryId,categoryId)

    if (isUpdate && pCategoryId !== '0') {

      let { data:subCategorys } = await this.getCategorys(pCategoryId)
      // 更新二级分类列表的option
      let childrenOption = subCategorys.map(item => {
        return {
          value: item._id,
          label: item.name,
          isLeaf: true
        }
      })
      // 寻找selectedOption的一级分类列表，并生成二级option
      let targetOption = newOption.find(item => item.value === pCategoryId)
      // 添加到选中的一级分类列表option的children中
      if (targetOption)
        targetOption.children = childrenOption

    }

    this.setState({
      options: newOption
    })

  }

  // 获取parentId的所有子类
  getCategorys = async (parentId) => {
    let { status,data } = await GetCategorys(parentId)
    // console.log(status,data)
    if (status === 0) {
      if (parentId === '0') {
        // 展示options
        this.initOption(data)
      } else {
        // 返回子类数据
        return { data }
      }

    } else {
      message.error('获取分类列表数据失败')
    }

  }

  render() {
    const { title,formRef,loadData,isUpdate } = this
    const { name,desc,price,pCategoryId,categoryId,imgs,detail } = this.product 
    // console.log(imgs,detail)

    const { options } = this.state
    const layout = {
      labelCol:{ span: 3 },
      wrapperCol:{ span: 10 }
    }

    const categorysId = []
    if (isUpdate) { 
      // 默认选中分类
      categorysId.push(categoryId)
      if (pCategoryId !== '0') {
        // 二级分类时，需要添加父类
        categorysId.unshift(pCategoryId)
      }
    }

    return (
      <>
        <Card 
          title={title} 
          style={{ width: '100%' }}
        >

          <Form
            {...layout}
            layout="horizontal"
            ref={formRef}
            initialValues={{
              name,
              desc,
              price,
              categorysId,
            }}
            
          >
            {/* 记得给每一个Form.Item加上name,才能进行表达验证提交 */}
            <Form.Item 
              label="商品名称"
              rules={[
                { 
                  required: true,
                  whitespace:true,
                  message: '请输入商品名称' 
                }
              ]}
              name="name"
            >
              <Input placeholder="请输入商品名称"/>
            </Form.Item>

            <Form.Item 
              label="商品描述"
              rules={[
                {
                  required: true,
                  whitespace:true,
                  message: '请输入商品描述' 
                }
              ]}
              name="desc"
            >
              <Input.TextArea placeholder="请输入商品描述" autoSize={{minRows: 2, maxRows: 6}}/>
            </Form.Item>

            <Form.Item 
              label="商品价格"
              rules={[
                { 
                  required: true,
                  message: '请输入商品价格' 
                },
                {
                  validator: this.validatePricce
                }
              ]}
              name="price"
            >
              <Input placeholder="请输入商品价格" addonAfter="元"/>
            </Form.Item>
                    
            <Form.Item 
              label="商品分类"
              rules={[
                { 
                  required: true, 
                  message: '请选择商品分类' 
                }
              ]}
              name="categorysId"
            >
              <Cascader
                options={options}
                loadData={loadData}
                placeholder="请选择商品分类"
              />
            </Form.Item>
                  
            <Form.Item 
              label="商品图片"
            >
              <PitureWall imgs={imgs} ref={this.pitureRef}/>
            </Form.Item>    

            <Form.Item 
              label="商品详情"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 12 }}
            >
              <EditorConvertToHTML detail={detail} ref={this.editorRef}/>
            </Form.Item>

            <Form.Item 
              wrapperCol={{ ...layout.wrapperCol,offset:3}}
            >
              {/* 推荐使用原生提交事件，然后通过form实列的方法来触发表单验证 */}
              <Button type="primary" onClick={this.submit}>提交</Button>
            </Form.Item>

          </Form>

        </Card>
      </>
    )
  }
}
