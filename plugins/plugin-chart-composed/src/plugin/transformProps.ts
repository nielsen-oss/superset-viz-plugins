/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { ChartProps } from '@superset-ui/chart';
import { CHART_SUB_TYPE_NAMES, CHART_SUB_TYPES, CHART_TYPES, Layout } from '../components/utils';
import { ComposedChartProps } from '../components/ComposedChart';
import { lineChartSubType } from './controlPanel';

type TMetric = {
  label: string;
};

export type TLabelColors = 'black' | 'white';

type FormData = {
  layout: Layout;
  colorScheme: string;
  chartType: keyof typeof CHART_TYPES;
  lineChartSubType: keyof typeof CHART_SUB_TYPES;
  areaChartSubType: keyof typeof CHART_SUB_TYPES;
  barChartSubType: keyof typeof CHART_SUB_TYPES;
  scatterChartSubType: keyof typeof CHART_SUB_TYPES;
  numbersFormat: string;
  labelsColor: TLabelColors;
  xAxisLabel: string;
  yAxisLabel: string;
  xAxisTickLabelAngle: string;
  yAxisTickLabelAngle: string;
  metrics: TMetric[];
  groupby: string[];
};

export type ResultData = Data & {
  rechartsDataKey: string;
  rechartsTotal?: number;
};

type Data = Record<string, string | number>;

export default function transformProps(chartProps: ChartProps) {
  const { width, height, queryData } = chartProps;
  const data = queryData.data as Data[];
  const formData = chartProps.formData as FormData;
  const metrics = formData.metrics.map(metric => metric.label);

  let resultData: ResultData[] = data.map(item => ({
    ...item,
    rechartsDataKey: formData.groupby.map(field => item[field]).join(', '),
  }));

  if (
    formData.barChartSubType === CHART_SUB_TYPES.STACKED &&
    formData.chartType === CHART_TYPES.BAR_CHART
  ) {
    resultData = resultData.map(item => ({
      ...item,
      rechartsTotal: metrics.reduce((total, metric) => total + (item[metric] as number), 0),
    }));
  }

  let chartSubType = formData.barChartSubType;
  switch (formData.chartType) {
    case CHART_TYPES.LINE_CHART:
      chartSubType = formData.lineChartSubType;
      break;
    case CHART_TYPES.AREA_CHART:
      chartSubType = formData.areaChartSubType;
      break;
    case CHART_TYPES.SCATTER_CHART:
      chartSubType = formData.scatterChartSubType;
      break;
    case CHART_TYPES.BAR_CHART:
    default:
      chartSubType = formData.barChartSubType;
  }

  const result: ComposedChartProps = {
    width,
    height,
    layout: formData.layout,
    colorScheme: formData.colorScheme,
    chartType: formData.chartType,
    chartSubType,
    numbersFormat: formData.numbersFormat,
    labelsColor: formData.labelsColor,
    xAxis: {
      label: formData.xAxisLabel,
      tickLabelAngle: -Number(formData.xAxisTickLabelAngle),
    },
    yAxis: {
      label: formData.yAxisLabel,
      tickLabelAngle: -Number(formData.yAxisTickLabelAngle),
    },
    data: resultData,
    metrics,
  };
  return result;
}
