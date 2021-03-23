
import React,{ Component,Suspense,lazy } from 'react'
import { Route,Switch } from 'react-router-dom'
import './App.less'

const Admin = lazy( () => import('@/pages/Admin'))
const Login = lazy( () => import('@/pages/Login'))



export default class App extends Component {
  render() {
    return (
      <div className="App">

        <Suspense fallback={<h1>Loading...</h1>}>
          <Switch>
            <Route path="/login" component={Login}/>
            {/* 因为Admin组件登录后时刻展示，所以不能开启严格匹配 */}
            <Route path="/" component={Admin}/>
          </Switch>
        </Suspense>
      </div>
    )
  }
}