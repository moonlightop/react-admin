
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'

import { connect } from 'react-redux'
import { writeTitle } from '@/redux/actions/title'

import MyNavLink from '../MyNavLink'
import navConfig from '@/config/navConfig'

import { Menu } from 'antd'
const { SubMenu } = Menu

class LeftNav extends Component {
  
  initMenus = () => {
    const { role:{menus},username } = this.props.user
    this.username = username

    this.newMenus = menus.map(menu => {
      if (menu === '/category') {
        return '/products' + menu
      } else if (menu === '/product') {
        return '/products/manage' 
      }
      return menu
    })
    
    // console.log(this.newMenus)
  }

  UNSAFE_componentWillMount() {
    this.initMenus()
    this.MenuList = this.getMenuNodes(navConfig)
  }

  // 判断用户是否有权限访问一个route
  hasAuth = (route) => {
    /*
      1. 登录用户是admin，不用限制
      2. isPublic为true
      3. 权限包含此Menu.Item，没有子菜单：/home /user /role
      4. 权限包含Menu.Item，但它是子菜单，且不包含SubMenu?
    */
    // 登录的用户中取出 role.menus来判断权限
    const { isPublic } = route
    const newMenus = this.newMenus
    // console.log(newMenus)

    /* 
      /home   
      /products   /products/category    /products/manage      
      /role   /user
      /charts    /charts/line   /charts/bar   /charts/pie
    */
    if (this.username === 'admin' || isPublic || newMenus.indexOf(route.key) !== -1) {
      return true
    } else if (route.children.length > 0) {
      // 如果route.key是/products，而newMenus中包括/products/category，但是上面判断会返回false
      //  route.key就是/products/category，而newMenus中也包括，返回true  
      return route.children.find(subRoute => {
        return newMenus.indexOf(subRoute.key) !== -1
      })
    } 

    return false

  }

 // map 或 reduce 方法加递归调用实现！
  getMenuNodes(navConfig) {

    return navConfig.reduce((preValue,route) => {
      const { title,key,icon,children } = route
      const path = this.props.location.pathname

      if (this.hasAuth(route)) {

        // 防止登录后，页面刷新而导致选中的导览项和标题不一样
        if (path.indexOf(key) !== -1) {
          // /products/manage   /products/manage/addupdate
          this.props.writeTitle(title)
        }

        if (children.length) {
          // 刷新后默认选中的是子菜单，那么需要将其父菜单打开
          //   因此设计路由时，子菜单路由是在父菜单路由下的
          let isOpen = children.find(item => {
            return path.indexOf(item.key) !== -1
          })
  
          if (isOpen) {
            // 找到应该默认打开的SubMenu
            this.OpenKey = route.key
          }
  
          preValue.push(
            <SubMenu key={key} icon={icon} title={title}>
              {/* 递归调用 */}
              {this.getMenuNodes(children)}
            </SubMenu>
          )
  
        } else {
          preValue.push(
            <Menu.Item key={key} icon={icon}>
              <MyNavLink to={key} onClick={() => {
                // 1. 每次切换路由在redux中存储相应的title
                this.props.writeTitle(title)
              }}>
                {title}
              </MyNavLink>
            </Menu.Item>
          )
        }

      }

      return preValue

    },[])
    
  }
  
  render() {

    let SelectKey = this.props.location.pathname
    if (SelectKey.indexOf('/products/manage') !== -1) {
    //  防止进入/product的子路由时左侧导航不选中
      SelectKey = '/products/manage'
    }

    const OpenKey = this.OpenKey

    return (
      <div className="left-nav">

        <header className="left-nav-header">
          <MyNavLink to="/home">后台</MyNavLink> 
        </header>

        <section className="left-nav-list">

          <Menu 
            theme="dark" 
            defaultSelectedKeys={['1']} 
            mode="inline"
            selectedKeys={[SelectKey]} 
            defaultOpenKeys={[OpenKey]} // 默认打开的子菜单
            // openKeys={[OpenKey]} // 当前展开的子菜单，受控
            >
            {
              this.MenuList
            }
          </Menu>

        </section>

      </div>
    )
  }
}

export default connect(state => ({
  user: state.user
}),{
  writeTitle,
})(withRouter(LeftNav))