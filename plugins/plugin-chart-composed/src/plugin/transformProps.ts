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
import { CHART_SUB_TYPES, CHART_TYPES, mergeBy, Layout } from '../components/utils';
import { ComposedChartProps } from '../components/ComposedChart';
import {
  addBreakdownMetricsAndGetBreakdownValues,
  addRechartsKeyAndGetGroupByValues,
  getChartSubType,
  ResultData,
  Data,
  FormData,
  SortingType,
} from './utils';

export default function transformProps(chartProps: ChartProps) {
  const { width, height, queriesData } = chartProps;
  const data = queriesData[0].data as Data[];
  const formData = chartProps.formData as FormData;
  const metrics = formData.metrics.map(metric => metric.label);

  const groupByValues: string[] = [];
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

  const chartTypeMetrics: (keyof typeof CHART_TYPES)[] = [];
  const chartSubTypeMetrics: (keyof typeof CHART_SUB_TYPES)[] = [];
  const useCustomTypeMetrics: boolean[] = [];

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

  let resultShowTotals = false;
  if (
    formData.barChartSubType === CHART_SUB_TYPES.STACKED &&
    formData.chartType === CHART_TYPES.BAR_CHART &&
    useCustomTypeMetrics.every(el => !el)
  ) {
    resultShowTotals = formData.showTotals;
  }

  const hasOrderedBars = formData.chartType === CHART_TYPES.BAR_CHART && formData.useOrderByMetric0;

  const result: ComposedChartProps = {
    orderByTypeMetric: formData.orderByTypeMetric0 as SortingType,
    hasOrderedBars,
    breakdowns,
    width,
    height,
    chartTypeMetrics,
    chartSubTypeMetrics,
    hasCustomTypeMetrics: useCustomTypeMetrics,
    layout: formData.layout,
    colorScheme: formData.colorScheme,
    chartType: formData.chartType,
    showLegend: formData.showLegend,
    legendPosition: formData.legendPosition,
    chartSubType,
    showTotals: resultShowTotals,
    numbersFormat: formData.numbersFormat,
    labelsColor: formData.labelsColor,
    xAxis: {
      label: formData.xAxisLabel,
      tickLabelAngle: -Number(formData.xAxisTickLabelAngle),
    },
    hasY2Axis: formData.useY2Axis && formData.layout === Layout.horizontal,
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
