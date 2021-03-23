
import ajax from './ajax'
const baseURL = 'http://localhost:3000'


// 获取用户登录信息
export const UserLogin = (username,password) => ajax(baseURL + '/login',{
  username,
  password
},'POST')

// 添加用户
export const AddUser = (user) => ajax(baseURL + '/manage/user/add',
  user,
  'POST'
)

// 更新用户信息
export const UpdateUser = (user) => ajax(baseURL + '/manage/user/update',
  user,
  'POST'
)

// 获取所有用户信息
export const GetUserList = () => ajax(baseURL + '/manage/user/list')

// 删除用户信息
export const DeleteUser = (userId) => ajax(baseURL + '/manage/user/delete',{
  userId
},'POST')


// 获取城市的天气状况
const key = '1bc4e86fe23b2c0abaa49de114bd35d9'
const city = '110101'
// restapi.amap.com/v3/weather/weatherInfo
//    ?key=1bc4e86fe23b2c0abaa49de114bd35d9&city=110101
export const GetWeather = () => ajax(
  `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`,
  'GET' 
)



// 根据类父id 获取子类的列表
export const GetCategorys = (parentId) => ajax(
  baseURL + '/manage/category/list',
  {
    parentId
  },
  'GET'
)

// 添加分类
export const AddCategory = (parentId,categoryName) => ajax(
  baseURL + '/manage/category/add',
  {
    parentId,
    categoryName
  },
  'POST'
)

// 更新类名
export const UpdateCategoryName = (categoryId,categoryName) => ajax(
  baseURL + '/manage/category/update',
  {
    categoryId,
    categoryName
  },
  'POST'
)


// 获取管理的商品列表
export const GetProductList = ({ pageNum,pageSize }) => ajax(
  baseURL + '/manage/product/list',
  {
    pageNum,
    pageSize
  },
  'GET'
)

// 根据ID/Name搜索产品分页列表
//    将根据商品名称和商品关键字封装成一个函数
export const GetSearchList = ({ pageNum,pageSize,searchValue,searchType }) => ajax(
  baseURL + '/manage/product/search',
  {
    pageNum,
    pageSize,
    [searchType]: searchValue
  },
  'GET'
)


// 根据分类id获得分类名称
export const GetCategoryName = (categoryId) => ajax(
  baseURL + '/manage/category/info',
  {
    categoryId
  },
  'GET'
)

// 修改商品的上架和下架状态，根据商品id来更新状态
export const UpdateStatus = (productId,status) => ajax(
  baseURL + '/manage/product/updateStatus',
  {
    productId,
    status 
  },
  'POST'
)

// 删除图片
export const RemovedPiture = (name) => ajax(
  baseURL + '/manage/img/delete',
  {
    name
  },
  'POST'
)

// 添加或更新商品
export const AddOrUpdateProduct = (product) => ajax(
  baseURL + '/manage/product/' + (product._id ? 'update' : 'add'),
  product,
  'POST'
)


// 获取角色列表
export const GetRole = () => ajax(
  baseURL + '/manage/role/list',
)

// 添加角色
export const AddRole = (roleName) => ajax(
  baseURL + '/manage/role/add',
  {
    roleName
  },
  'POST'
)

// 更新角色权限
/*  
  role: {
    _id,
    menus,
    auth_time,
    auth_name
  }
*/
export const UpdateRole = (role) => ajax(
  baseURL + '/manage/role/update',
  role,
  'POST'
)