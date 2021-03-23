
import React, { Component,lazy,Suspense} from 'react'
import { Switch,Route } from 'react-router-dom'

const Home = lazy(() => import('./Home'))
const AddUpdate = lazy(() => import('./AddUpdate'))
const Detail = lazy(() => import('./Detail'))
const NotFound = lazy(() => import('@/pages/Admin/NotFound'))

export default class Manage extends Component {
  render() {
    return (
      <>
        <Suspense fallback={ <h1>loading...</h1> }>
          <Switch>
            {/* 需要开启严格匹配，因为后面两个路由都是它的子路由 */}
            <Route exact path="/products/manage" component={Home}></Route>
            <Route exact path="/products/manage/addupdate" component={AddUpdate}></Route>
            <Route exact path="/products/manage/detail" component={Detail}></Route>
            <Route component={NotFound}/>
          </Switch>
        </Suspense>
      </>
    )
  }
}
