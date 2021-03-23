
import { combineReducers } from 'redux'
import user from './user'
import headTitle from './headTitle'

// Reducers 一直在监听有无 dispatch过来actions，一旦派发过来actions，所有的reducers都会走一遍
//  因此每个Reducers负责的功能，需要我们手动去定义，派发过来的actions不是它的功能时，则不该它负责的状态！

// 建立redux中，key（访问redux的状态的key） 与 value的联系（对应的reducer的返回值）
export default combineReducers({
  user, 
  headTitle,
})