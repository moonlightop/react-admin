
import React from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { RemovedPiture } from '@/api'
import PropTypes from 'prop-types'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  constructor(props) {
    super(props)

    let fileList = []
    const { imgs } = this.props
    if (imgs && imgs.length > 0) {
      // console.log("http://120.55.193.14:5000/upload/" + (typeof imgs[0] === 'object' ? imgs[0].name : imgs[0]))
      fileList = imgs.map((img,index) => {
        let imgName = typeof img === 'object' ? img.name : img
        return {
          uid: -index,
          name: imgName,
          status: 'done',
          // 远程访问服务器的地址
          url: "http://120.55.193.14:5000/upload/" + imgName
        }  
      })
    }

    this.state = {
      previewVisible: false, // 预览图片的状态
      previewImage: '', // 预览图片的URL
      previewTitle: '',// 预览图片的名字
       // 当前文件列表, 获取到 的图片放在此处
      fileList,
    }
  }

  // 返回图片的名字
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }

  // 图片状态发生变化，该函数传递过来的fileList是最新的当前文件列表
  handleChange = async ({ file,fileList }) => {
    
    // file 代表当前状态发生变化的文件
    if (file.status === 'done') {
      const res = file.response // { status: 0, data: ... }

      const { status,data:{name,url} } = res
      if (status === 0) {

        message.success('图片上传成功')
        var currentIndex = fileList.length - 1
        // 因为该组件内部自动生成的name和url 不是我们想要的，所以需要修改它
        fileList[currentIndex].name = name
        // 访问服务器中图片的url地址
        fileList[currentIndex].url =  "http://120.55.193.14:5000" + url.split(':5000')[1]
        // console.log(fileList[currentIndex].url )
        
      } else {
        message.error('图片上传失败')
      }

    } else if (file.status === 'removed') {
      // 删除图片
      const res = await RemovedPiture(file.name)
      let { status } = res
      if (status === 0) {
        message.success('图片删除成功')
      } else {
        message.error('图片删除失败')
      }
    }

    this.setState({ fileList })  

  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )
    return (
      <>
        <Upload
        // 图片上传到服务器的地址
          action="/manage/img/upload"
        // 图片列表展示的方式
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview} 
          onChange={this.handleChange}
          accept="image/*"
          name="image"
        >
          {fileList.length >= 2 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null} // 隐藏确定 和 取消 按钮
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    )
  }
}
