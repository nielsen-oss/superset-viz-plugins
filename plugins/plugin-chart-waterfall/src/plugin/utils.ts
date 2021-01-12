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
import { t } from '@superset-ui/core';
import { WaterfallChartData } from '../components/WaterfallChart';
import { QueryData } from './transformProps';

const groupDataByPeriod = (data: QueryData[], periodColumn: string) =>
  data.reduce((acc, cur) => {
    const period = cur[periodColumn] as string;
    const periodData = acc.get(period) || [];
    periodData.push(cur);
    acc.set(period, periodData);
    return acc;
  }, new Map<string, QueryData[]>());

const addTotalValueToPeriod = (
  newVal: QueryData[],
  xAxisColumn: string,
  periodColumn: string,
  valueColumn: string,
  key: string,
) => {
  // Calc total per period
  const sum = newVal.reduce((acc, cur) => acc + (cur[valueColumn] as number), 0);
  // Push total per period to the end of period values array
  newVal.push({
    [xAxisColumn]: key,
    [periodColumn]: '__TOTAL__',
    [valueColumn]: sum,
  });
};

const removeRedundantValuesInPeriod = (newVal: QueryData[], periodCounter: number) =>
  periodCounter === 0 ? [newVal[newVal.length - 1]] : newVal;

export const convertDataForRecharts = (
  periodColumn: string,
  xAxisColumn: string,
  valueColumn: string,
  data: QueryData[],
) => {
  // Group by period (temporary map)
  const groupedData = groupDataByPeriod(data, periodColumn);

  let resultData: QueryData[] = [];
  let periodCounter = 0;
  groupedData.forEach((val, key) => {
    let newVal = val;
    // Sort for waterfall Desc
    newVal.sort((a, b) => (a[periodColumn] as number) - (b[periodColumn] as number));

    addTotalValueToPeriod(newVal, xAxisColumn, periodColumn, valueColumn, key);
    newVal = removeRedundantValuesInPeriod(newVal, periodCounter);
    periodCounter += 1;

    resultData = resultData.concat(newVal);
  });
  return resultData;
};

export const createReChartsBarValues = (
  rechartsData: QueryData[],
  valueColumn: keyof QueryData,
  periodColumn: keyof QueryData,
): WaterfallChartData[] =>
  // Create ReCharts values array of deltas for bars
  rechartsData.map((cur: QueryData, index: number) => {
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

export const MAX_FORM_CONTROLS = 50;

export enum SortingType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const SortingTypeNames = {
  [SortingType.ASC]: t('Ascending'),
  [SortingType.DESC]: t('Descending'),
};
