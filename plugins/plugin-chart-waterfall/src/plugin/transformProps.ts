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
import { WaterfallChartData } from '../components/WaterfallChart';
import { convertDataForRecharts, createReChartsBarValues, SortingType } from './utils';
import { LegendPosition } from '../components/utils';

type Metric = {
  label: string;
};

export type QueryData = {
  [key: string]: number | string;
};

type FormData = {
  xAxisColumn: string;
  periodColumn: string;
  queryFields: { metric: string };
  metric: Metric;
  numbersFormat: string;
  legendPosition: LegendPosition;
  orderByChange: SortingType;
  useOrderByChange: boolean;
};

export default function transformProps(
  chartProps: ChartProps,
): {
  dataKey: string;
  onBarClick: () => null;
  numbersFormat: string;
  data: WaterfallChartData[];
  xAxisDataKey: string;
  width: number;
  resetFilters: () => null;
  legendPosition: LegendPosition;
  height: number;
} {
  const { width, height, formData, queriesData } = chartProps;

  const {
    periodColumn,
    xAxisColumn,
    metric,
    numbersFormat,
    legendPosition,
    orderByChange,
    useOrderByChange,
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

  const resultData = createReChartsBarValues(rechartsData, valueColumn, periodColumn);

  return {
    dataKey: valueColumn,
    xAxisDataKey: xAxisColumn,
    width,
    height,
    legendPosition,
    numbersFormat,
    data: resultData,
    onBarClick: () => null,
    resetFilters: () => null,
  };
}
