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
import { ChartProps, t } from '@superset-ui/core';
import { WaterfallChartData, TWaterfallChartProps } from '../components/WaterfallChart';

type TMetric = {
  label: string;
};

type TQueryData = {
  [key: string]: number | string;
};

type TFormData = {
  xAxisColumn: string;
  periodColumn: string;
  queryFields: { metrics: string };
  metrics: TMetric[];
};

const convertDataForRecharts = (periodColumn: string, xAxisColumn: string, valueColumn: string, data: TQueryData[]) => {
  // Group by period (temporary map)
  const groupedData = data.reduce((acc, cur) => {
    const period = cur[periodColumn] as string;
    const periodData = acc.get(period) || [];
    periodData.push(cur);
    acc.set(period, periodData);
    return acc;
  }, new Map<string, TQueryData[]>());

  let resultData: TQueryData[] = [];
  let counter = 0;
  groupedData.forEach((val, key) => {
    let newVal = val
    // Sort for waterfall Desc
    newVal.sort((a, b) => (a[periodColumn] as number) - (b[periodColumn] as number));
    // Calc total per period
    const sum = newVal.reduce((acc, cur) => acc + (cur[valueColumn] as number), 0);
    // Push total per period to the end of period values array
    newVal.push({
      [xAxisColumn]: key,
      [periodColumn]: '__TOTAL__',
      [valueColumn]: sum,
    });
    // Remove first period and leave only last one
    if (counter++ === 0) {
      newVal = [newVal[newVal.length - 1]];
    }
    resultData = resultData.concat(newVal);
  });
  return resultData;
};

const createReChartsBarValues = (
  rechartsData: TQueryData[],
  valueColumn: keyof TQueryData,
  periodColumn: keyof TQueryData,
): WaterfallChartData[] =>
  // Create ReCharts values array of deltas for bars
  rechartsData.map((cur: TQueryData, index: number) => {
    let totalSumUpToCur = 0;
    for (let i = 0; i < index; i++) {
      // Ignore calculation on period column
      if (rechartsData[i][periodColumn] !== '__TOTAL__' || i === 0) {
        totalSumUpToCur += rechartsData[i][valueColumn] as number;
      }
    }

    if (cur[periodColumn] === '__TOTAL__') {
      return {
        ...cur,
        __TOTAL__: true,
        [valueColumn]: [0, totalSumUpToCur || cur[valueColumn]],
      } as WaterfallChartData;
    }

    return {
      ...cur,
      [valueColumn]: [totalSumUpToCur, totalSumUpToCur + (cur[valueColumn] as number)],
    } as WaterfallChartData;
  });

export default function transformProps(chartProps: ChartProps): TWaterfallChartProps {
  const { width, height, formData, queryData } = chartProps;

  const { periodColumn, xAxisColumn, metrics } = formData as TFormData;

  const valueColumn = metrics[0].label;
  let data = queryData.data as TQueryData[];

  if (metrics.length !== 1) {
    return {
      dataKey: valueColumn,
      width,
      height,
      error: t('Please choose only one "Metric" in "Query" section'),
    };
  }

  // Remove bars with value 0
  data = data.filter(item => item[valueColumn] !== 0);

  // Sort by period (ascending)
  data.sort((a, b) => Number.parseInt(a[periodColumn] as string, 10) - Number.parseInt(b[periodColumn] as string, 10));

  const rechartsData = convertDataForRecharts(periodColumn, xAxisColumn, valueColumn, data);

  const resultData = createReChartsBarValues(rechartsData, valueColumn, periodColumn);

  return {
    dataKey: valueColumn,
    xAxisDataKey: xAxisColumn,
    width,
    height,
    data: resultData,
    onBarClick: () => null,
    resetFilters: () => null,
  };
}
