
import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react'
import { Button,Card } from 'antd'

export default class Line extends Component {

  state = {
    sales: [24,23,9,61,44,33],
    store: [13,17,41,26,37,59]
  }

  // 更新销售商品的数量
  increment = () => {
    this.setState(state => ({
      sales: state.sales.map(sale => sale + 1),
      store: state.store.map(product => product + 1)
    }))
  }
  // 更新销售商品的数量
  decrement = () => {
    this.setState(state => ({
      sales: state.sales.map(state => state.sale - 1),
      store: state.store.map(product => product - 1)
    }))
  }

  getOption = () => {
    const { sales,store } = this.state
    return  {
      title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        left: 'center'
      },
      tooltip: {
          trigger: 'item'
      },
      legend: {
          orient: 'vertical',
          left: 'left',
      },
      series: [
          {
              name: '访问来源',
              type: 'pie',
              radius: '50%',
              data: [
                  {value: 1048, name: '搜索引擎'},
                  {value: 735, name: '直接访问'},
                  {value: 580, name: '邮件营销'},
                  {value: 484, name: '联盟广告'},
                  {value: 300, name: '视频广告'}
              ],
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
    }
  }

  render() {
    return (
      <>
        <Card>
          <Button type="primary" style={{marginLeft: '4%'}}
            onClick={this.increment}>添加商品数据</Button>
          <Button type="primary" style={{marginLeft: '50px'}}
            onClick={this.decrement}>减少商品数据</Button>
        </Card>
        <Card>
          <ReactECharts
            option={this.getOption()}
            style={{ height: 500, marginLeft: '5%' }}
            opts={{ renderer: 'svg' }}
          />
        </Card>
      </>
    )
  }
}
