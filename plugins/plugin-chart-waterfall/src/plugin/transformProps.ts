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
import { processNumbers, convertDataForRecharts, createReChartsBarValues, SortingType, Metric } from './utils';
import { WaterfallChartProps } from '../components/WaterfallChart';
import { LegendPosition } from '../types';

export type QueryData = {
  [key: string]: number | string;
};

type FormData = {
  xAxisColumn: string;
  xAxisLabel: string;
  yAxisLabel: string;
  yAxisLabelAngle: string;
  xAxisTickLabelAngle: string;
  periodColumn: string;
  queryFields: { metric: string };
  metric: Metric;
  numbersFormat: string;
  legendPosition: LegendPosition;
  orderByChange: SortingType;
  useOrderByChange: boolean;
  showHorizontalGridLines: boolean;
};

export default function transformProps(chartProps: ChartProps): WaterfallChartProps {
  const { width, height, formData, queriesData } = chartProps;

  const {
    periodColumn,
    xAxisColumn,
    metric,
    numbersFormat,
    legendPosition,
    orderByChange,
    useOrderByChange,
    showHorizontalGridLines = true,
  } = formData as FormData;

  const valueColumn = metric.label;
  const data = queriesData?.[0]?.data as QueryData[];

  const rechartsData = convertDataForRecharts(
    periodColumn,
    xAxisColumn,
    valueColumn,
    data,
    orderByChange,
    useOrderByChange,
  );

  let resultData = createReChartsBarValues(rechartsData, valueColumn, periodColumn);
  resultData = processNumbers(resultData, metric.label, formData.numbersFormat, formData.numbersFormatDigits);

  return {
    dataKey: valueColumn,
    xAxisDataKey: xAxisColumn,
    xAxisLabel: formData.xAxisLabel ?? '',
    yAxisLabel: formData.yAxisLabel ?? '',
    xAxisTickLabelAngle: -Number(formData.xAxisTickLabelAngle ?? 45),
    yAxisLabelAngle: -Number(formData.yAxisLabelAngle),
    width,
    height,
    legendPosition,
    showHorizontalGridLines,
    numbersFormat,
    data: resultData,
    onBarClick: () => null,
    resetFilters: () => null,
  };
}
