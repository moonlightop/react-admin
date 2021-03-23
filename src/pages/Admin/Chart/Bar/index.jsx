
import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react'
import { Button,Card } from 'antd'

export default class Bar extends Component {

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
    return {
      title: {
        text: '商品信息'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      legend: {
        data:['销量','库存'],
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{ 
        name: '销量',
        type: 'bar',
        data: sales
      },{ 
        name: '库存',
        type: 'bar',
        data: store
      }]
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
