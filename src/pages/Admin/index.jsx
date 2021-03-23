
import React, { Component,lazy,Suspense } from 'react'
import { Route,Redirect,Switch } from 'react-router-dom'

import LeftNav from '@components/LeftNav'
import Header from '@components/Header'

import { Layout } from 'antd'
import { connect } from 'react-redux'
const { Footer, Sider, Content } = Layout


const Home = lazy(() => (import('@pages/Admin/Home')))
const Bar = lazy(() => (import('@pages/Admin/Chart/Bar')))
const Line = lazy(() => (import('@pages/Admin/Chart/Line')))
const Pie = lazy(() => (import('@pages/Admin/Chart/Pie')))
const MyCategory = lazy(() => (import('@pages/Admin/Product/MyCategory')))
const Manage = lazy(() => (import('@@/src/pages/Admin/Product/Manage')))
const Role = lazy(() => (import('@pages/Admin/Role')))
const User = lazy(() => (import('@pages/Admin/User')))
const NotFound = lazy(() => (import('@pages/Admin/NotFound')))


class Admin extends Component {

  state = {
    collapsed: false,
  }

  onCollapse = collapsed => {
    this.setState({ collapsed })
  }

  render() {

    const { collapsed } = this.state

    const user = this.props.user
    // console.log('admin:',user)
    if (!user._id) {
      // 退出登录后，跳转会登录页面，为何要加return，因为render函数返回虚拟dom才会渲染！
      return <Redirect to="/login"/>
    }

    return (
      <>
        <Layout style={{minHeight: '100vh'}}>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <LeftNav/>
          </Sider>

          <Layout>
            <Header></Header>
            <Content style={{backgroundColor: 'white',margin: '20px'}}>

              <Suspense fallback={<h1>Loading...</h1>}>
                <Switch>
                  {/* 
                    登录后
                      / 路由跳转首页，对应的跳转对应的路由，然后其它路径跳转NotFound 
                      路由匹配是按顺序往下匹配的！
                  */}
                    <Redirect exact from='/' to='/home'/>
                    <Route exact path="/home" component={Home}></Route>
                    <Route path="/products/category" component={MyCategory}></Route>
                    <Route path="/products/manage" component={Manage}/>
                    <Route exact path="/user" component={User}></Route>
                    <Route exact path="/role" component={Role}></Route>
                    <Route exact path="/charts/bar" component={Bar}></Route>
                    <Route exact path="/charts/line" component={Line}></Route>
                    <Route exact path="/charts/pie" component={Pie}></Route>
                    <Route component={NotFound}/>
                </Switch>
              </Suspense>

            </Content>
            <Footer style={{height: '64px',textAlign: 'center',backgroundColor: 'rgb(204,204,204)',fontWeight: 'bold'}}>
              建议使用谷歌浏览器打开，体验更佳
            </Footer>
          </Layout>
          
        {/* 注册路由 */}
        
        </Layout>
      </>
    )
  }
}

export default connect(state => ({
  user: state.user
}),{

})(Admin)
