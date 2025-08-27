import { useECharts } from "@/hooks/useECharts"
import React, { useEffect } from "react"
import { PieECOption } from "@/utils/echarts"

export interface PieChartData {
  // 柱状图系列的数据
  pieSeriesData: any
}

interface PieChartProps extends PieChartData {
  // 图表高度
  height?: number
}

const PieChart: React.FC<PieChartProps> = ({ pieSeriesData, height = 400 }) => {
  const { chartRef: pieRef, chartInstanceRef: pieChart } = useECharts()

  useEffect(() => {
    pieChart.current?.setOption({
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      series: [
        {
          type: "pie",
          data: pieSeriesData,
        },
      ],
    } as PieECOption)
  }, [pieChart, pieSeriesData])

  return <div style={{ height: `${height}px` }} ref={pieRef}></div>
}
export default PieChart
