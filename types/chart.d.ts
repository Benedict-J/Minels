import {ChartType, Plugin} from 'chart.js';

declare module 'chart.js' {
  export interface PluginOptionsByType<TType extends ChartType> {
    htmlLegend?: {
      containerID?: string
    }
  }
}
