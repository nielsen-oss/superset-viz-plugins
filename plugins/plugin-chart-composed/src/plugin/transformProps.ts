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
import { AxisInterval } from 'recharts';
import { mergeBy } from '../components/utils';
import { CHART_SUB_TYPES, CHART_TYPES, Layout } from '../components/types';
import { ComposedChartProps } from '../components/ComposedChart';
import {
  addBreakdownYColumnsAndGetBreakdownValues,
  addRechartsKeyAndGetXColumnValues,
  checkTimeSeries,
  Data,
  FormData,
  getChartSubType,
  processNumbers,
  QueryMode,
  ResultData,
  SortingType,
  sortOrderedBars,
} from './utils';

export default function transformProps(chartProps: ChartProps) {
  const { width, height, queriesData } = chartProps;
  const data = queriesData[0].data as Data[];
  const formData = chartProps.formData as FormData;
  let xColumns: string[];
  let yColumns: string[];

  if (formData.queryMode === QueryMode.raw) {
    xColumns = [formData.xColumn];
    yColumns = [formData.yColumn];
  } else {
    xColumns = formData.groupby;
    yColumns = formData.metrics?.map(metric => metric.label ?? metric);
  }

  const xColumnValues: string[] = [];
  const isTimeSeries = checkTimeSeries(xColumns, formData.granularitySqla, formData.layout);
  let resultData: ResultData[] = addRechartsKeyAndGetXColumnValues(
    formData,
    data,
    xColumnValues,
    isTimeSeries,
    xColumns,
  );

  if (isTimeSeries) {
    resultData.sort(
      ({ __timestamp: __timestamp2 }, { __timestamp: __timestamp1 }) =>
        (__timestamp2 as number) - (__timestamp1 as number),
    );
  }

  const breakdowns: string[] = [];
  resultData = addBreakdownYColumnsAndGetBreakdownValues(resultData, yColumns, formData, breakdowns);

  // Unit data elements by groupBy values
  resultData = mergeBy(resultData, 'rechartsDataKey');

  const chartSubType = getChartSubType(
    formData.chartType,
    formData.barChartSubType,
    formData.lineChartSubType,
    formData.areaChartSubType,
    formData.scatterChartSubType,
    formData.bubbleChartSubType,
  );

  const chartTypeMetrics: (keyof typeof CHART_TYPES)[] = [];
  const chartSubTypeMetrics: (keyof typeof CHART_SUB_TYPES)[] = [];
  const useCustomTypeMetrics: boolean[] = [];

  if (formData.queryMode !== QueryMode.raw) {
    yColumns.forEach((yColumn, index) => {
      useCustomTypeMetrics.push(formData[`useCustomTypeMetric${index}`] as boolean);
      chartTypeMetrics.push(formData[`chartTypeMetric${index}`] as keyof typeof CHART_TYPES);
      chartSubTypeMetrics.push(
        getChartSubType(
          formData[`chartTypeMetric${index}`] as keyof typeof CHART_TYPES,
          formData[`barChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
          formData[`lineChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
          formData[`areaChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
          formData[`scatterChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
          formData[`bubbleChartSubTypeMetric${index}`] as keyof typeof CHART_SUB_TYPES,
        ),
      );
    });
  }

  let resultShowTotals = false;
  if (
    formData.barChartSubType === CHART_SUB_TYPES.STACKED &&
    formData.chartType === CHART_TYPES.BAR_CHART &&
    useCustomTypeMetrics.every(el => !el)
  ) {
    resultShowTotals = formData.showTotals;
  }

  const orderByYColumn = formData.useOrderByMetric0 && formData.orderByTypeMetric0;

  const hasOrderedBars = formData.chartType === CHART_TYPES.BAR_CHART && !!orderByYColumn;

  if (hasOrderedBars) {
    sortOrderedBars(
      resultData,
      xColumnValues,
      formData,
      formData.queryMode === QueryMode.raw ? 'XAxisColumn' : 'GroupBy',
    );
  }

  resultData = processNumbers(resultData, breakdowns, formData.numbersFormat, formData.numbersFormatDigits);
  const result: ComposedChartProps = {
    orderByYColumn: orderByYColumn as SortingType,
    hasOrderedBars,
    minBarWidth: formData.minBarWidth,
    breakdowns,
    width,
    height,
    metrics: formData.metrics.map(({ label }) => label),
    isTimeSeries,
    xColumns,
    yColumns,
    chartTypeMetrics,
    zDimension: formData.zDimension?.label,
    chartSubTypeMetrics,
    hasCustomTypeMetrics: useCustomTypeMetrics,
    layout: formData.layout,
    colorScheme: formData.colorScheme,
    bubbleSize: Number(formData.bubbleSize ?? 1000),
    chartType: formData.chartType,
    showLegend: formData.showLegend,
    legendPosition: formData.legendPosition,
    chartSubType,
    showTotals: resultShowTotals,
    numbersFormat: formData.numbersFormat,
    labelsColor: formData.labelsColor,
    xAxis: {
      interval: formData.xAxisInterval as AxisInterval,
      label: formData.xAxisLabel,
      tickLabelAngle: -Number(formData.xAxisTickLabelAngle),
    },
    hasY2Axis:
      yColumns.length > 1 &&
      formData.useY2Axis &&
      formData.layout === Layout.horizontal &&
      formData.queryMode !== QueryMode.raw,
    yAxis: {
      labelAngle: -Number(formData.yAxisLabelAngle ?? 0),
      labelAngle2: -Number(formData.y2AxisLabelAngle ?? 0),
      label: formData.yAxisLabel,
      tickLabelAngle: -Number(formData.yAxisTickLabelAngle),
      label2: formData.y2AxisLabel,
      tickLabelAngle2: -Number(formData.y2AxisTickLabelAngle),
    },
    data: resultData,
  };
  return result;
}
