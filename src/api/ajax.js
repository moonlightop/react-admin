
import axios from 'axios'
import {message} from 'antd'

export default function ajax (url,data={},type='GET') {
  // console.log(type.toUpperCase())
  return new Promise((res,rej) => {

    let promise 

    if (type.toUpperCase() === 'GET') {
      // console.log('--------',url,data)
      promise = axios.get(url,{
        params: data
      })
  
    } else if (type.toUpperCase() === 'POST') {
      promise = axios.post(url,data)
    }

    promise.then(value => {
      value.data ? res(value.data) : res(value)
    },reason => {
      message.error('请求出错了：' + reason.message)
    })

  })

}