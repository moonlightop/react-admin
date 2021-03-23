import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'


export default class EditorConvertToHTML extends Component {
  
  static propTypes = {
    detail: PropTypes.string
  }

  constructor(props) {
    super(props)
    const html = this.props.detail
    if (html) {
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        this.state = {
          editorState,
        }
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty()
      }
    }

  }

  // 获取文本编辑器转为HTML的字符串
  getEditorHtml = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/manage/img/upload')
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)

        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          const url = "http://120.55.193.14:5000" + response.data.url.split(':5000')[1]   
          const newResponse = {...response,...{data:{name:response.data.name,url}}}
          // console.log(newResponse,response)
          resolve(newResponse)

        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          console.log(error)
          reject(error)
        })

      }
    )
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  render() {
    const { editorState } = this.state
    return (
      <>
      
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
          editorStyle={{border: '1px solid black',paddingLeft: '10px',minHeight: '200'}}
          toolbar={{
            // 1. 监听本地图片上传成功或失败的回调函数，启用上传本地图片
            // 2. 并显示在文本编辑器上，启用alt必填字段和图片文本编辑器中预览
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />

      </>
    )
  }


}