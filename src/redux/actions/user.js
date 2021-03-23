
import { UserLogin } from '@/api/index'
import { saveStorage } from '@/util/storageUtils'
import { WRITE_USER,ERR_MSG, LOGIN_OUT } from '@/redux/actionTypes'
import { removeStorage } from '@/util/storageUtils'


export const writeUser = (user) => ({ type: WRITE_USER,data: user }) 
export const errMsg = (err_msg) => ({type: ERR_MSG,data: err_msg})

export const loginOut = () => {
  // 1. 删除持久化的user
  removeStorage('user_id')
  // 2. 派发action来重置redux中user为 {}
  return ({type: LOGIN_OUT})
}

export const login = (username,password) => {
  return async (dispatch) => {
  
    // 1. 发送网络请求获取登录用户信息和状态
    let {status,msg,data} = await UserLogin(username,password)

    if (status === 0) {
      // 2.1持久化用户信息
      saveStorage(data,'user_id')
      // 2.2写进redux
      dispatch(writeUser(data))
      
    } else if (status === 1) {
      // 2.2错误信息写进redux
      dispatch(errMsg(msg))

    }
  }
} 