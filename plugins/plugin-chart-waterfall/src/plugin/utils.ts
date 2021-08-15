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
import { BarValue, WaterfallChartData } from '../components/WaterfallChart';
import { QueryData } from './transformProps';

export enum SortingType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type Metric = {
  label: string;
};

const groupDataByPeriod = (data: QueryData[], periodColumn: string) =>
  data.reduce((acc, cur) => {
    const period = cur[periodColumn] as string;
    const periodData = acc.get(period) || [];
    periodData.push(cur);
    acc.set(period, periodData);
    return acc;
  }, new Map<string, QueryData[]>());

const addTotalValueToPeriod = (
  valuesOfPeriod: QueryData[],
  xAxisColumn: string,
  periodColumn: string,
  valueColumn: string,
  key: string,
) => {
  // Calc total per period
  const sum = valuesOfPeriod.reduce((acc, cur) => acc + (cur[valueColumn] as number), 0);
  // Push total per period to the end of period values array
  valuesOfPeriod.push({
    [xAxisColumn]: key,
    [periodColumn]: '__TOTAL__',
    [valueColumn]: sum,
  });
};

const removeRedundantValuesInPeriod = (newVal: QueryData[], periodCounter: number) =>
  periodCounter === 0 ? [newVal[newVal.length - 1]] : newVal;

const findDiffOfPeriodsValue = (
  valueOfPeriod: QueryData,
  valueColumn: string,
  groupedData: Map<string, QueryData[]>,
  keys: string[],
  periodCounter: number,
  xAxisColumn: string,
): QueryData => {
  const lastPeriodValue =
    (groupedData
      ?.get(keys[periodCounter - 1])
      ?.find(prevPeriodValue => prevPeriodValue[xAxisColumn] === valueOfPeriod[xAxisColumn])?.[
      valueColumn
    ] as number) ?? 0;
  const thisPeriodValue = valueOfPeriod[valueColumn] as number;
  return {
    ...valueOfPeriod,
    thisPeriodValue,
    lastPeriodValue,
    [valueColumn]: thisPeriodValue - lastPeriodValue,
  };
};

export const convertDataForRecharts = (
  periodColumn: string,
  xAxisColumn: string,
  valueColumn: string,
  data: QueryData[],
  orderByChange: SortingType,
  useOrderByChange: boolean,
) => {
  // Group by period (temporary map)
  const groupedData = groupDataByPeriod(data, periodColumn);

  let resultData: QueryData[] = [];
  let periodCounter = 0;
  groupedData.forEach((valuesOfPeriod, periodKey) => {
    const keys = [...groupedData.keys()];
    let newValuesOfPeriod: QueryData[] =
      periodCounter === 0
        ? valuesOfPeriod
        : valuesOfPeriod.map(valueOfPeriod =>
            findDiffOfPeriodsValue(valueOfPeriod, valueColumn, groupedData, keys, periodCounter, xAxisColumn),
          );

    addTotalValueToPeriod(newValuesOfPeriod, xAxisColumn, periodColumn, valueColumn, periodKey);
    newValuesOfPeriod = removeRedundantValuesInPeriod(newValuesOfPeriod, periodCounter);
    // Add client sort by change
    if (useOrderByChange) {
      newValuesOfPeriod.sort((a, b) =>
        a[periodColumn] === '__TOTAL__'
          ? 1
          : (orderByChange === SortingType.ASC ? 1 : -1) * ((a[valueColumn] as number) - (b[valueColumn] as number)),
      );
    }

    resultData = resultData.concat(newValuesOfPeriod);
    periodCounter += 1;
  });
  return resultData;
};

export const createReChartsBarValues = (
  rechartsData: QueryData[],
  valueColumn: keyof QueryData,
  periodColumn: keyof QueryData,
): WaterfallChartData[] => {
  // Create ReCharts values array of deltas for bars
  const resultData = rechartsData.map((cur: QueryData, index: number) => {
    let totalSumUpToCur = 0;
    for (let i = 0; i < index; i++) {
      // Ignore calculation on period column
      if (rechartsData[i][periodColumn] !== '__TOTAL__' || i === 0) {
        totalSumUpToCur += rechartsData[i][valueColumn] as number;
      }
    }

    const lastPeriod = totalSumUpToCur;
    const thisPeriod = totalSumUpToCur + (cur[valueColumn] as number);
    const change = index === 0 ? 0 : thisPeriod - lastPeriod;
    const changePercentage = (change / lastPeriod) * 100;
    if (cur[periodColumn] === '__TOTAL__') {
      return {
        ...cur,
        thisPeriod,
        change,
        __TOTAL__: true,
        [valueColumn]: [0, totalSumUpToCur || cur[valueColumn]],
      } as WaterfallChartData;
    }
    return {
      ...cur,
      lastPeriod,
      thisPeriod,
      change,
      changePercentage,
      [valueColumn]: [lastPeriod, thisPeriod],
    } as WaterfallChartData;
  });

  return resultData;
};

export const MAX_FORM_CONTROLS = 50;

export const SortingTypeNames = {
  [SortingType.ASC]: t('Ascending'),
  [SortingType.DESC]: t('Descending'),
};

export const processNumbers = (
  resultData: WaterfallChartData[],
  metric: string,
  numbersFormat: string,
  numbersFormatDigits?: string,
): WaterfallChartData[] => {
  const digits = Number(numbersFormatDigits);
  if (numbersFormat === 'SMART_NUMBER' && numbersFormatDigits && !Number.isNaN(digits)) {
    // eslint-disable-next-line no-param-reassign
    return resultData.map(item => ({
      ...item,
      [metric]: (item[metric] as BarValue)?.map((value: number) =>
        Number(
          value
            .toLocaleString('en-US', {
              minimumFractionDigits: digits,
              maximumFractionDigits: digits,
            })
            .replace(/,/g, ''),
        ),
      ),
    })) as WaterfallChartData[];
  }
  return resultData;
};
