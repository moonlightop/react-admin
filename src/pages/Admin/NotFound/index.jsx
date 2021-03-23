import React, { Component } from 'react'
import { Button, Row, Col } from 'antd'
import { connect } from 'react-redux'

import { writeTitle } from '@/redux/actions/title'
import './index.less'

/*
前台404页面
 */
class NotFound extends Component {

  goHome = () => {
    this.props.writeTitle('首页')
    this.props.history.replace('/home')
  }

  UNSAFE_componentWillMount() {
    this.props.writeTitle('')
  }

  render() {
    return (

      <Row className='not-found'>
        <Col span={12} className='left'></Col>
        <Col span={12} className='right'>
          <h1>404</h1>
          <h2>抱歉，你访问的页面不存在</h2>
          <Button type='primary' onClick={this.goHome}>
            回到首页
          </Button>
        </Col>
      </Row>
    )
  }
}

export default connect(
  null,
  {
    writeTitle
  }
)(NotFound)