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
import { CategoricalColorNamespace, JsonObject } from '@superset-ui/core';
import { BREAKDOWN_SEPARATOR, ResultData, SortingType, Z_SEPARATOR } from '../plugin/utils';
import { BarChartValue, CHART_SUB_TYPES, CHART_TYPES, ColorSchemeBy } from './types';

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

export const isStackedBar = (ct: keyof typeof CHART_TYPES, cst: keyof typeof CHART_SUB_TYPES) =>
  ct === CHART_TYPES.BAR_CHART && cst === CHART_SUB_TYPES.STACKED;

export const getMetricFromBreakdown = (breakdown = '') => breakdown?.split(BREAKDOWN_SEPARATOR)[0];

export const checkIsBreakdownInMetricsList = (breakdown: string, excludedMetricsForStackedBars: string[] = []) =>
  excludedMetricsForStackedBars.includes(getMetricFromBreakdown(breakdown));

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
  includedMetricsForStackedBars: string[],
  isMainChartStacked: boolean,
) => {
  const newSortedData = { ...sortedData };
  let iterator = 0;
  // Putting sorted bars back to result data by their index order
  breakdowns.forEach((item, index) => {
    if (tempSortedArray[index]) {
      if (
        checkIsMetricStacked(
          isMainChartStacked,
          tempSortedArray[index]?.id,
          excludedMetricsForStackedBars,
          includedMetricsForStackedBars,
        )
      ) {
        newSortedData[iterator] = {
          ...tempSortedArray[index],
        };
        iterator++;
      }
      // For other custom types if not bar
      newSortedData[tempSortedArray[index].id] = tempSortedArray[index].value;
    }
  });
  return newSortedData;
};

export const buildSortedDataForBars = (
  dataItem: ResultData,
  tempSortedArray: BarChartValue[],
  yColumns: string[],
  breakdowns: string[],
  isMainChartStacked: boolean,
  excludedMetricsForStackedBars: string[],
  includedMetricsForStackedBars: string[],
) => {
  const hasBreakdowns = Object.keys(dataItem).some(item => item.includes(BREAKDOWN_SEPARATOR));

  let iterator = 0;
  let iteratorOfBreakdownProps = 0;
  return Object.entries(dataItem).reduce(
    (prev, next) => {
      if (
        !String(next[0]).includes(BREAKDOWN_SEPARATOR) &&
        !yColumns.includes(String(next[0])) &&
        !breakdowns.includes(String(next[0]))
      ) {
        // If not metric/breakdown field just return it
        return { ...prev, [next[0]]: next[1] };
      }
      const orderedBarsDataMap: JsonObject = { ...prev.orderedBarsDataMap };

      // If not not relevant field when use breakdowns
      if (!(!String(next[0]).includes(BREAKDOWN_SEPARATOR) && hasBreakdowns)) {
        orderedBarsDataMap[iteratorOfBreakdownProps] = iterator;
        // Build array with breakdowns to sort it next
        if (
          checkIsMetricStacked(
            isMainChartStacked,
            next[0],
            excludedMetricsForStackedBars,
            includedMetricsForStackedBars,
          )
        ) {
          iterator++;
        }
        tempSortedArray.push({
          id: next[0],
          value: next[1] as number,
          name: next[0],
          color: 'transparent',
        });
        iteratorOfBreakdownProps++;
      }
      return {
        ...prev,
        orderedBarsDataMap,
      };
    },
    { orderedBarsDataMap: {} } as ResultData,
  );
};

export const processBarChartOrder = (
  hasOrderedBars: boolean,
  breakdowns: string[],
  yColumns: string[],
  resultData: ResultData[],
  orderByYColumn: SortingType,
  excludedMetricsForStackedBars: string[],
  includedMetricsForStackedBars: string[],
  isMainChartStacked: boolean,
): ResultData[] => {
  if (hasOrderedBars) {
    // Build this model: https://mabdelsattar.medium.com/recharts-stack-order-bf22c245d0be
    return resultData.map(dataItem => {
      const tempSortedArray: BarChartValue[] = [];
      const sortedData: ResultData = buildSortedDataForBars(
        dataItem,
        tempSortedArray,
        yColumns,
        breakdowns,
        isMainChartStacked,
        excludedMetricsForStackedBars,
        includedMetricsForStackedBars,
      );
      // Sorting bars according order
      const sortSign = orderByYColumn === SortingType.ASC ? 1 : -1;
      tempSortedArray.sort((a, b) => sortSign * (a?.value - b?.value));
      return fillBarsDataByOrder(
        breakdowns,
        sortedData,
        tempSortedArray,
        excludedMetricsForStackedBars,
        includedMetricsForStackedBars,
        isMainChartStacked,
      );
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

export const getBreakdownsOnly = (breakdown = '') => breakdown?.split(BREAKDOWN_SEPARATOR).slice(1);

export const getResultColor = (breakdown = '', colorSchemeBy: ColorSchemeBy) => {
  let resultColorScheme = colorSchemeBy.metric?.[getMetricFromBreakdown(breakdown)];
  if (!resultColorScheme) {
    const foundBreakdown = getBreakdownsOnly(breakdown).find(bo => colorSchemeBy.breakdown?.[bo]);
    if (foundBreakdown) {
      resultColorScheme = colorSchemeBy.breakdown?.[foundBreakdown];
    }
  }
  const colorFn = CategoricalColorNamespace.getScale(
    // eslint-disable-next-line no-underscore-dangle
    resultColorScheme ?? colorSchemeBy.__DEFAULT_COLOR_SCHEME__,
  );
  return colorFn(breakdown);
};
