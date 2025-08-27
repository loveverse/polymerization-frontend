import { use } from "echarts/core"
import { BarChart, PieChart, RadarChart } from "echarts/charts"
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent,
} from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

import type { ComposeOption } from "echarts/core"
import type { BarSeriesOption, PieSeriesOption, RadarSeriesOption } from "echarts/charts"
import type {
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  RadarComponentOption,
  ToolboxComponentOption,
  DataZoomComponentOption,
} from "echarts/components"

export type BarECOption = ComposeOption<
  | BarSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | ToolboxComponentOption
  | DataZoomComponentOption
>

export type PieECOption = ComposeOption<
  | PieSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
>

export type RadarECOption = ComposeOption<
  RadarSeriesOption | RadarComponentOption | TooltipComponentOption
>

export const initEcharts = () => {
  use([
    GridComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    DataZoomComponent,
    BarChart,
    PieChart,
    RadarChart,
    CanvasRenderer,
  ])
}
