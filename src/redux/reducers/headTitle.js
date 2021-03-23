
import { WRITE_TITLE,LOGIN_OUT } from '@/redux/actionTypes'

// 初始为：string
const initState = '首页'
export default function headTitle(preState=initState,actions) {
  const { type,data } = actions
  switch(type) {
    case LOGIN_OUT:
      return '首页'
    case WRITE_TITLE: 
      return data
    default: 
      return preState
  }
}