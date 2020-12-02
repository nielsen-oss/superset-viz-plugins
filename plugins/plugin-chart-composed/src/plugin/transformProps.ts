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
import { ChartProps } from '@superset-ui/core';
import { CHART_SUB_TYPES, CHART_TYPES, mergeBy, Layout, LegendPosition } from '../components/utils';
import { ComposedChartProps } from '../components/ComposedChart';

type Metric = {
  label: string;
};

export type LabelColors = 'black' | 'white';

export const BREAKDOWN_SEPARATOR = '_$_';

type FormData = {
  [key: string]: string | string[] | Metric[] | boolean;
  layout: Layout;
  colorScheme: string;
  chartType: keyof typeof CHART_TYPES;
  lineChartSubType: keyof typeof CHART_SUB_TYPES;
  areaChartSubType: keyof typeof CHART_SUB_TYPES;
  barChartSubType: keyof typeof CHART_SUB_TYPES;
  scatterChartSubType: keyof typeof CHART_SUB_TYPES;
  numbersFormat: string;
  columns: string[];
  labelsColor: LabelColors;
  xAxisLabel: string;
  yAxisLabel: string;
  showLegend: boolean;
  legendPosition: LegendPosition;
  y2AxisLabel: string;
  xAxisTickLabelAngle: string;
  yAxisTickLabelAngle: string;
  y2AxisTickLabelAngle: string;
  useY2Axis: boolean;
  metrics: Metric[];
  groupBy: string[];
};

export type ResultData = Data & {
  rechartsDataKey: string;
  rechartsTotal?: number;
};

type Data = Record<string, string | number>;

const getChartSubType = (
  chartType: keyof typeof CHART_TYPES,
  barChartSubType: keyof typeof CHART_SUB_TYPES,
  lineChartSubType: keyof typeof CHART_SUB_TYPES,
  areaChartSubType: keyof typeof CHART_SUB_TYPES,
  scatterChartSubType: keyof typeof CHART_SUB_TYPES,
) => {
  switch (chartType) {
    case CHART_TYPES.LINE_CHART:
      return lineChartSubType;
    case CHART_TYPES.AREA_CHART:
      return areaChartSubType;
    case CHART_TYPES.SCATTER_CHART:
      return scatterChartSubType;
    case CHART_TYPES.BAR_CHART:
    default:
      return barChartSubType;
  }
};

const getGroupByValues = (field: string, item: Record<string, string | number>, groupByValues: string[]) => {
  if (!groupByValues.includes(field)) {
    groupByValues.push(field); // Small mutation in map, but better then one more iteration
  }
  return item[field];
};

const addRechartsKeyAndGetGroupByValues = (
  formData: FormData,
  data: Record<string, string | number>[],
  groupByValues: string[],
) =>
  data.map(item => ({
    ...item,
    rechartsDataKey: formData.groupBy.map(field => getGroupByValues(field, item, groupByValues)).join(', '),
  }));

const addBreakdownMetricsAndGetBreakdownValues = (
  resultData: ResultData[],
  metrics: string[],
  formData: FormData,
  breakdowns: string[],
) =>
  resultData.map(item => {
    metrics.forEach(metric => {
      const breakdown = (formData.columns || []).reduce(
        (acc, column) => `${acc}${BREAKDOWN_SEPARATOR}${item[column]}`,
        '',
      );
      // Build metric name by breakdown
      const resultBreakdown = `${metric}${breakdown}`;
      item[resultBreakdown] = item[metric];
      // build breakdown values array
      if (!breakdowns.includes(resultBreakdown)) {
        breakdowns.push(resultBreakdown);
      }
    });
    return {
      ...item,
    };
  });

export default function transformProps(chartProps: ChartProps) {
  const { width, height, queryData } = chartProps;
  const data = queryData.data as Data[];
  const formData = chartProps.formData as FormData;
  const metrics = formData.metrics.map(metric => metric.label);

  let groupByValues: string[] = [];
  let resultData: ResultData[] = addRechartsKeyAndGetGroupByValues(formData, data, groupByValues);

  const breakdowns: string[] = [];
  resultData = addBreakdownMetricsAndGetBreakdownValues(resultData, metrics, formData, breakdowns);

  // Unit data elements by groupBy values
  resultData = mergeBy(resultData, 'rechartsDataKey');

  const chartSubType = getChartSubType(
    formData.chartType,
    formData.barChartSubType,
    formData.lineChartSubType,
    formData.areaChartSubType,
    formData.scatterChartSubType,
  );

  let chartTypeMetrics: (keyof typeof CHART_TYPES)[] = [];
  let chartSubTypeMetrics: (keyof typeof CHART_SUB_TYPES)[] = [];
  let useCustomTypeMetrics: boolean[] = [];

  metrics.forEach((metric, index) => {
    useCustomTypeMetrics.push(formData[`useCustomTypeMetric${index}`] as boolean);
    chartTypeMetrics.push(formData[`chartTypeMetric${index}`] as keyof typeof CHART_TYPES);
    chartSubTypeMetrics.push(
      getChartSubType(
        formData[`chartTypeMetric${index}`] as keyof typeof CHART_TYPES,
        formData[`barChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
        formData[`lineChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
        formData[`areaChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
        formData[`scatterChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
      ),
    );
  });

  if (
    formData.barChartSubType === CHART_SUB_TYPES.STACKED &&
    formData.chartType === CHART_TYPES.BAR_CHART &&
    useCustomTypeMetrics.every(el => !el)
  ) {
    resultData = resultData.map(item => ({
      ...item,
      rechartsTotal: breakdowns.reduce((total, breakdown) => total + ((item[breakdown] as number) || 0), 0),
    }));
  }

  const result: ComposedChartProps = {
    breakdowns,
    width,
    height,
    chartTypeMetrics,
    chartSubTypeMetrics,
    useCustomTypeMetrics,
    layout: formData.layout,
    colorScheme: formData.colorScheme,
    chartType: formData.chartType,
    showLegend: formData.showLegend,
    legendPosition: formData.legendPosition,
    chartSubType,
    numbersFormat: formData.numbersFormat,
    labelsColor: formData.labelsColor,
    xAxis: {
      label: formData.xAxisLabel,
      tickLabelAngle: -Number(formData.xAxisTickLabelAngle),
    },
    useY2Axis: formData.useY2Axis && formData.layout === Layout.horizontal,
    yAxis: {
      label: formData.yAxisLabel,
      tickLabelAngle: -Number(formData.yAxisTickLabelAngle),
      label2: formData.y2AxisLabel,
      tickLabelAngle2: -Number(formData.y2AxisTickLabelAngle),
    },
    data: resultData,
    metrics,
  };
  return result;
}
