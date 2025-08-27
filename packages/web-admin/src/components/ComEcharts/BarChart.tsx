import { useECharts } from "@/hooks/useECharts"
import React, { useEffect } from "react"
import { BarECOption } from "@/utils/echarts"

interface BarChartProps {
  // 柱状图系列的数据
  seriesData: Recordable[]
  // 柱状图X轴的数据
  xAxisData: string[] | number[]
  xName?: string
  yName?: string
  xType?: string
  yType?: string
  isStack?: boolean
  style?: React.CSSProperties
}

const BarChart: React.FC<BarChartProps> = props => {
  const { chartRef: barRef, chartInstanceRef: barChart } = useECharts()
  const {
    seriesData,
    xAxisData,
    xName = "分数",
    yName = "人数",
    isStack = true,
    xType = "category",
    yType = "value",
    style,
  } = props
  useEffect(() => {
    barChart.current?.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      title: {
        show: true,
      },

      xAxis: {
        name: xName,
        type: xType,
        data: xType == "category" ? xAxisData : [],
        axisLabel: {
          interval: 0, // 显示所有标签
          formatter: (value: string) => {
            if (typeof value === "string") {
              return value.replace(/(.{5})/g, "$1\n") // 每5个字符后插入换行符
            }
            return value
          },
        },
        axisTick: {
          // 刻度
          show: false,
        },
        axisLine: {
          show: true,
          symbol: ["none", "arrow"],
          symbolSize: [8, 8],
          symbolOffset: [0, 7],
        },
        minInterval: 1,
        max: xType == "category" ? "dataMax" : "dataMax",
      },
      yAxis: {
        name: yName,
        type: yType,
        data: yType == "category" ? xAxisData : [],
        axisLabel: {
          interval: 0, // 显示所有标签
          formatter: (value: string) => {
            // if (typeof value === "string") {
            //   return value.replace(/(.{5})/g, "$1\n"); // 每5个字符后插入换行符
            // }
            return value
          },
        },
        axisTick: {
          // 刻度
          show: false,
        },
        axisLine: {
          show: true,
          symbol: ["none", "arrow"],
          symbolSize: [8, 8],
          symbolOffset: [0, 7],
        },

        max: yType == "category" ? "dataMax" : 100,
      },
      series: seriesData.map(item => {
        return {
          name: item.name,
          type: "bar",
          data: item.data,
          stack: isStack ? "total" : "",
          barWidth: 20,
          itemStyle:
            seriesData.length > 1
              ? undefined
              : {
                  color: "#5A72F7",
                },
          label: {
            show: true,
            position: xType === "category" ? "top" : "right",
          },
        }
      }),
    } as BarECOption)
  }, [barChart, seriesData, xAxisData])

  return <div style={{ height: 400, ...style }} ref={barRef}></div>
}
export default BarChart
