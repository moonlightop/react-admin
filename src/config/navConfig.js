
import {
  UserAddOutlined,
  UsergroupAddOutlined,
  HomeOutlined,
  SketchOutlined,

  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  AreaChartOutlined,

  AppstoreOutlined,
  DatabaseOutlined,

} from '@ant-design/icons'

const navConfig = [
  {
    title: "首页",
    key: "/home",
    icon: <HomeOutlined/>,
    children: [],
    isPulib: true,
  },
  {
    title: "商品",
    key: "/products",
    icon: <SketchOutlined/>,
    children: [
      {
        title: "品类管理",
        key: "/products/category",
        icon: <DatabaseOutlined/>,
        children: []
      },
      {
        title: "商品管理",
        key: "/products/manage",
        icon: <AppstoreOutlined/>,
        children: []
      }
    ]
  },
  {
    title: "用户管理",
    key: "/user",
    icon: <UserAddOutlined/>,
    children: []
  },
  {
    title: "角色管理",
    key: "/role",
    icon: <UsergroupAddOutlined/>,
    children: []
  },
  {
    title: "图形图标管理",
    key: "/charts",
    icon: <AreaChartOutlined/>,
    children: [
      {
        title: "柱形图",
        key: "/charts/bar",
        icon: <BarChartOutlined/>,
        children: []
      },
      {
        title: "折线图",
        key: "/charts/line",
        icon: <LineChartOutlined/>,
        children: []
      },
      {
        title: "饼状图",
        key: "/charts/pie",
        icon: <PieChartOutlined/>,
        children: []
      }
    ]
  },

]

export default navConfig