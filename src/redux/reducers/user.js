
import { ERR_MSG, WRITE_USER, LOGIN_OUT } from '@/redux/actionTypes'
import { getStorage } from '@/util/storageUtils'

// 初始为： {}
const initState = getStorage('user_id') // 刷新后，仍然获取到用户的信息
export default function user(preState=initState,action) {
  const { type,data } = action
  switch(type) {
    case LOGIN_OUT: 
      return {}
    case ERR_MSG: 
      return {...preState,errMsg: data}
    case WRITE_USER: 
      return data 
    default: 
      return preState
  }

}