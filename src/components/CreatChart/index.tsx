import * as echarts from 'echarts'
import { EChartsType } from 'echarts'
import { useEffect, useRef } from 'react'

export interface PieChartsProps {
  value: number
  name: string
  percent?: string
}

type EChartsOption = echarts.EChartsOption

const DonutChart = ({ option, size }: { option: EChartsOption; size: { width: number; height: number } }) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const cInstance = useRef<EChartsType>()

  useEffect(() => {
    if (chartRef.current) {
      cInstance.current = echarts.getInstanceByDom(chartRef.current)
      if (!cInstance.current) {
        cInstance.current = echarts.init(chartRef.current as any as HTMLElement, undefined, {
          width: size.width,
          height: size.height
        })
      } else {
        cInstance.current?.resize({
          animation: { duration: 300 },
          width: size.width,
          height: size.height
        })
      }
      if (option) cInstance.current.setOption(option)
    }
  }, [chartRef, option, size.height, size.width])

  return <div ref={chartRef}></div>
}
export default DonutChart
