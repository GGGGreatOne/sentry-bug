import { EChartsOption } from 'echarts/types/dist/echarts'
import CreatChart, { PieChartsProps } from 'components/CreatChart'

interface Props {
  width: number
  height: number
  barHeight?: number
  total: number
  data: PieChartsProps[]
  colorList: string[]
  length?: number
}

export default function PieChart(props: Props) {
  const { width, height, total, data, colorList, barHeight = 20 } = props
  const GetData = (data: PieChartsProps[]) => {
    const dataList: number[] = []
    const dataY: string[] = []
    const dataMax: number[] = []
    data.forEach(item => {
      dataList.push(item.value)
      dataY.push(item.name)
      dataMax.push(total)
    })
    return {
      dataList: dataList,
      dataY: dataY,
      dataMax: dataMax
    }
  }
  const { dataList, dataY, dataMax } = GetData(data)
  const option: EChartsOption = {
    grid: {
      left: '2%',
      right: '2%',
      bottom: '-5%',
      top: 0,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      extraCssText: 'max-width:240px; white-space:pre-wrap;word-break: break-all;',
      formatter: function (params: any) {
        const str =
          `<div style="display:flex;flex-direction:row;gap:10px;align-items:center">
          <div style="display:flex;"><div style="width:10px;height:10px;background:${params[0].color};border-radius:50%;margin-right:6px;margin-top:6px"></div>
          <div style="width:130px;font-weight:500;font-size:13px;color:#0C0C0C;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;">${params[0].name}</div>
          </div>` +
          `<div style="text-align:right;font-weight:500;font-size:16px;width:100px;color:#0C0C0C">${
            data[params[0].dataIndex].percent
          }</div></div>`
        return str
      }
    },

    xAxis: {
      show: false,
      type: 'value'
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisLabel: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        data: dataY
      }
    ],
    series: [
      {
        type: 'bar',
        zlevel: 1,
        itemStyle: {
          borderRadius: 30,
          color: function (params) {
            return colorList[params.dataIndex % colorList.length]
          }
        },
        barWidth: barHeight,
        data: dataList
      },
      {
        type: 'bar',
        barWidth: barHeight,
        barGap: '-100%',
        data: dataMax,
        itemStyle: {
          color: 'rgba(255, 255, 255, 0.10)',
          borderRadius: 30
        }
      }
    ]
  }
  return <CreatChart option={option} size={{ width: width, height: height }} />
}
