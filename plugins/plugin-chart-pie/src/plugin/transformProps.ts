import { ChartProps } from '@superset-ui/chart';
import { PieChartData, PieProps } from '../Pie';

export default function transformProps<G extends string, DK extends string>(chartProps: ChartProps): PieProps<G, DK> {
  const { width, height, formData, queryData } = chartProps;
  const {
    colorScheme,
    isDonut,
    groupBy,
    metric,
    colorPicker,
    showLegend,
    pieLabelType,
    showLabels,
    legendPosition,
  } = formData;
  let data = queryData.data as PieChartData<G, DK>[];

  return {
    dataKey: metric.label,
    width,
    legendPosition,
    height,
    // @ts-ignore
    data: data.filter(item => item[metric.label] !== null).filter(item => item[groupBy] !== null),
    isDonut,
    baseColor: colorPicker,
    colorScheme,
    showLegend,
    showLabels,
    groupBy,
    pieLabelType,
  };
}
