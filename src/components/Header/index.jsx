import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'

import { connect } from 'react-redux'
import { writeUser,loginOut } from '@/redux/actions/user'
import { writeTitle } from '@/redux/actions/title'

import navConfig from '@/config/navConfig'

import { formateDate } from '@/util/dateUtils'
import { GetWeather } from '@/api/index'

import { message,Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

class Header extends Component {
  
  state = {
    weather: '',
    time: formateDate()
  }

  loginOut = () => {
    Modal.confirm({
      title: '确认退出登录?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {

        this.props.loginOut()
        message.success('注销成功')
      },
    })
  }
  
  // 本地更新时间
  updateTime = () => {
    this.timer = setInterval(() => {
      let time = formateDate()
      this.setState({time})
    },1000)
  }
  // 通过API获取实时时间
  getWeather = async () => {
    const weatherMessage = await GetWeather()
    // console.log(weather)
    const { weather } = weatherMessage.lives[0]
    this.setState({weather})

  }
  //不使用redux来管理headTitle时的获取方法：动态获取标题
  getTitle = () => {
    let { pathname } = this.props.location
    // console.log(pathname)
    let title = ''

    navConfig.forEach(ele => {
      if (pathname === ele.key) {
        title = ele.title

      } else if (ele.children && ele.children.length) {

        // true返回找到的元素，false返回undefined
        // /product/manage  /product/manage/addupdate 
        let cItem = ele.children.find(item => pathname.indexOf(item.key) !== -1)
        if (cItem) {
          title = cItem.title
        }

      }

    })
    return title

  }

  // 一般用于发送 ajax请求，开启定时器等异步操作，仅做一次就够的
  // 只有加上 async的函数 await才会等待异步事件完成！
  componentDidMount () {
    // // 开启定时器更新时间
    this.updateTime()

    // 发送网络请求获取天气信息
    this.getWeather()
    
  }

  componentWillUnmount () {
    clearInterval(this.timer)
    this.setState = () => ({})
  }

  render() {
    let { weather,time } = this.state

    let { username } = this.props.user
    let headTitle = this.props.headTitle

    return (
      <>
        <div className="header">
          <div className="header-top">
            <span className="header-top-welcome">欢迎 {username}</span>
            <button onClick={this.loginOut} className="header-top-loginout">退出</button>
          </div>
          <div className="header-bottom">
            <span className="header-bottom-left">{headTitle}</span>
            <div className="header-bottom-right">
              <span className="header-bottom-time">{time}</span>
              <span className="header-bottom-weather">{weather}</span>
            </div>
          </div>
        </div>
      </>
    )
  }
}



export default connect(state => ({
  user: state.user,
  headTitle: state.headTitle,
}),{
  writeUser,
  writeTitle,
  loginOut,
})(withRouter(Header))