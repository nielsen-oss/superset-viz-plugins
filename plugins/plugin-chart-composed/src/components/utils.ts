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
import { JsonObject } from '@superset-ui/core';
import { BREAKDOWN_SEPARATOR, ResultData, SortingType, Z_SEPARATOR } from '../plugin/utils';
import { BarChartValue, BarChartValueMap, CHART_SUB_TYPES, CHART_TYPES } from './types';

export function mergeBy(arrayOfObjects: ResultData[], key: string): ResultData[] {
  const result: ResultData[] = [];
  arrayOfObjects.forEach(item => {
    const foundItem = result.find(resultItem => resultItem[key] === item[key]);
    if (foundItem) {
      Object.assign(foundItem, item);
      return;
    }
    result.push(item);
  });
  return result;
}

export const getValueForBarChart = (obj: BarChartValueMap, key: string) => obj?.[key]?.value;

export const isStackedBar = (ct: keyof typeof CHART_TYPES, cst: keyof typeof CHART_SUB_TYPES) =>
  ct === CHART_TYPES.BAR_CHART && cst === CHART_SUB_TYPES.STACKED;

export const checkIsBreakdownInMetricsList = (breakdown: string, excludedMetricsForStackedBars: string[] = []) =>
  excludedMetricsForStackedBars.includes(breakdown.split(BREAKDOWN_SEPARATOR)[0]);

export const checkIsMetricStacked = (
  isMainChartStacked: boolean,
  breakdown: string,
  excludedMetricsForStackedBars: string[],
  includedMetricsForStackedBars: string[],
) =>
  (isMainChartStacked && !checkIsBreakdownInMetricsList(breakdown, excludedMetricsForStackedBars)) ||
  (!isMainChartStacked && checkIsBreakdownInMetricsList(breakdown, includedMetricsForStackedBars));
export const getMetricName = (name: string, yColumns: string[], zDimension?: string) => {
  if (name?.startsWith(Z_SEPARATOR)) {
    return zDimension;
  }
  return yColumns.length === 1 ? name?.split(BREAKDOWN_SEPARATOR).pop() : name?.split(BREAKDOWN_SEPARATOR).join(', ');
};

export const fillBarsDataByOrder = (
  breakdowns: string[],
  sortedData: ResultData,
  tempSortedArray: BarChartValue[],
  excludedMetricsForStackedBars: string[],
) => {
  const newSortedData = { ...sortedData };
  let iterator = 0;
  const orderedBarsDataMap: JsonObject = {};
  // Putting sorted bars back to result data by their index order
  breakdowns.forEach((item, index) => {
    if (tempSortedArray[index]) {
      if (!excludedMetricsForStackedBars.includes(tempSortedArray[index]?.id?.split(BREAKDOWN_SEPARATOR)[0])) {
        newSortedData[iterator] = {
          ...tempSortedArray[index],
        };
        orderedBarsDataMap[tempSortedArray[index].id] = iterator;
        iterator++;
      }
      // For other custom types if not bar
      newSortedData[tempSortedArray[index].id] = tempSortedArray[index].value;
      newSortedData.orderedBarsDataMap = orderedBarsDataMap;
    }
  });
  return newSortedData;
};

export const buildSortedDataForBars = (
  dataItem: ResultData,
  tempSortedArray: BarChartValue[],
  yColumns: string[],
  breakdowns: string[],
) => {
  const hasBreakdowns = Object.keys(dataItem).some(item => item.includes(BREAKDOWN_SEPARATOR));
  return Object.entries(dataItem).reduce((prev, next) => {
    if (
      !String(next[0]).includes(BREAKDOWN_SEPARATOR) &&
      !yColumns.includes(String(next[0])) &&
      !breakdowns.includes(String(next[0]))
    ) {
      // If not metric/breakdown field just return it
      return { ...prev, [next[0]]: next[1] };
    }

    // If not not relevant field when use breakdowns
    if (!(!String(next[0]).includes(BREAKDOWN_SEPARATOR) && hasBreakdowns)) {
      // Build array with breakdowns to sort it next
      tempSortedArray.push({
        id: next[0],
        value: next[1] as number,
        name: next[0],
        color: 'transparent',
      });
    }
    return prev;
  }, {} as ResultData);
};

export const processBarChartOrder = (
  hasOrderedBars: boolean,
  breakdowns: string[],
  yColumns: string[],
  resultData: ResultData[],
  colorScheme: string,
  orderByYColumn: SortingType,
  excludedMetricsForStackedBars: string[],
): ResultData[] => {
  if (hasOrderedBars) {
    // Build this model: https://mabdelsattar.medium.com/recharts-stack-order-bf22c245d0be
    return resultData.map(dataItem => {
      const tempSortedArray: BarChartValue[] = [];
      const sortedData: ResultData = buildSortedDataForBars(dataItem, tempSortedArray, yColumns, breakdowns);
      // Sorting bars according order
      const sortSign = orderByYColumn === SortingType.ASC ? 1 : -1;
      tempSortedArray.sort((a, b) => sortSign * (a?.value - b?.value));
      return fillBarsDataByOrder(breakdowns, sortedData, tempSortedArray, excludedMetricsForStackedBars);
    });
  }
  return resultData;
};

export function debounce(func: Function, timeout = 300) {
  let timer: number;
  return (...args: any[]) => {
    clearTimeout(timer);
    // @ts-ignore
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args);
    }, timeout);
  };
}
