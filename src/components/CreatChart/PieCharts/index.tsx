import { EChartsOption } from 'echarts/types/dist/echarts'
import CreatChart, { PieChartsProps } from 'components/CreatChart'
import useBreakpoint from 'hooks/useBreakpoint'
import { formatGroupNumber } from 'utils'

interface Props {
  width: number
  height: number
  total: number
  data: PieChartsProps[]
  textColor?: string
  titleSize?: number
  subtextColor?: string
  subtextSize?: number
  colorList?: string[]
  textTop?: string
}

export default function PieChart(props: Props) {
  const isMd = useBreakpoint('md')
  const {
    width,
    height,
    total,
    data,
    textColor,
    subtextColor,
    colorList,
    titleSize = isMd ? 12 : 15,
    subtextSize = isMd ? 12 : 20,
    textTop = '47%'
  } = props
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      position: 'inside',
      confine: true,
      extraCssText: 'max-width:240px; white-space:pre-wrap; word-break: break-all;',
      textStyle: {
        lineHeight: 200
      },
      formatter: function (params: any) {
        const str =
          `<div style="display:flex;flex-direction:row;gap:10px;align-items:center">
          <div style="display:flex">
          <div style="width:10px;height:10px;background:${params.color};border-radius:50%;margin-right:6px;margin-top:6px"></div>
          <div style="width:130px;font-weight:500;font-size:13px;color:#0C0C0C;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;">${params.data.name}</div>
          </div>` +
          '</br>' +
          `<div style="text-align:right;font-weight:500;font-size:16px;width:100px;color:#0C0C0C">${params.data.percent}</div></div>`
        return str
      }
    },
    title: {
      text: 'Total Supply',
      subtext: `${total ? formatGroupNumber(total) : ''}`,
      left: 'center',
      top: textTop,
      itemGap: 12,
      textStyle: {
        color: textColor ? textColor : '#fff',
        fontSize: titleSize,
        fontWeight: 500,
        lineHeight: 1,
        align: 'center'
      },
      subtextStyle: {
        color: subtextColor ? subtextColor : '#fff',
        fontSize: subtextSize,
        fontWeight: 500,
        lineHeight: 1.3,
        align: 'center'
      }
    },
    series: [
      {
        name: 'value:',
        type: 'pie',
        radius: ['45%', '95%'],
        avoidLabelOverlap: false,
        itemStyle: {
          color: function (params) {
            const color = ['#FF7F50', '#87CEFA', '#32CD32', '#6495ED', '#FF69B4']
            return colorList ? colorList[params.dataIndex] : color[params.dataIndex]
          }
        },
        label: {
          show: false
          // position: 'outer',
          // alignTo: 'labelLine',
          // bleedMargin: 5,
          // formatter: function (params: any) {
          //   if (params.value == 0) {
          //     return ''
          //   } else {
          //     return params.percent + '%'
          //   }
          // },
          // color: '#fff',
          // fontFamily: 'Public Sans',
          // fontWeight: 400,
          // lineHeight: 1.5
        },
        data: data
      }
    ]
  }
  return <CreatChart option={option} size={{ width: width, height: height }} />
}
