import { ChartProps } from '@superset-ui/chart';
import { PieProps } from '../Pie';

type TQueryData = {
  [key: string]: number | string;
};

export default function transformProps(chartProps: ChartProps): PieProps {
  const { width, height, formData, queryData } = chartProps;
  const { colorScheme, isDonut, groupBy, metric, colorPicker, showLegend, pieLabelType, showLabels } = formData;
  let data = queryData.data as TQueryData[];

  return {
    dataKey: metric.label,
    width,
    height,
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
