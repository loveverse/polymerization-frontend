import React, { useEffect } from "react";
import { useECharts } from "@/hooks/useECharts";
import { RadarECOption } from "@/utils/echarts";

interface RadarChartProps {
  // 柱状图系列的数据
  radarData: string[] | number[];
  // 柱状图X轴的数据
  seriesData: string[] | number[];
  style?: React.CSSProperties;
}

const RadarChart: React.FC<RadarChartProps> = (props) => {
  const { seriesData, radarData, style } = props;
  const { chartRef: radarRef, chartInstanceRef: radarChart } = useECharts();
  useEffect(() => {
    radarChart.current?.setOption({
      tooltip: {},
      radar: {
        center: ["50%", "50%"],
        indicator: radarData.map((item) => {
          return { name: item, max: 100 };
        }),
      },

      series: [
        {
          type: "radar",
          name: "指标得分信息",
          data: [
            {
              value: seriesData,
              areaStyle: {
                color: "rgba(84, 112, 198, 0.2)",
              },
              label: {
                show: true,
                formatter: function (params) {
                  return params.value;
                },
              },
            },
          ],
        },
      ],
    } as RadarECOption);
  }, [radarChart, seriesData, radarData]);

  return <div ref={radarRef} style={{ height: 300, ...style }}></div>;
};
export default RadarChart;
