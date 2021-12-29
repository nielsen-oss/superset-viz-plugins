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
import {
  BarChartSubType,
  BarChartValue,
  ChartType,
  ColorSchemes,
  Data,
  HiddenTickLabels,
  ResultData,
  SortingType,
  YColumnsMeta,
  YColumnsMetaData,
} from './types';

export const BREAKDOWN_SEPARATOR = '_$_';
export const Z_SEPARATOR = '_Z$_';
export const NORM_SEPARATOR = '_NORM$_';
export const HIDDEN_DATA = '_HIDDEN_DATA_';

export const getXColumnValues = (field: string, item: Record<string, string | number>, xColumnValues: string[]) => {
  if (!xColumnValues.includes(field)) {
    xColumnValues.push(field); // Small mutation in map, but better than one more iteration
  }
  return item[field];
};

export const getMetricByChartType = (
  lookup: ChartType,
  yColumns: string[],
  yColumnsMeta?: YColumnsMeta,
  chartType?: ChartType,
) =>
  yColumns.filter(
    yColumn =>
      yColumnsMeta?.[yColumn]?.chartType === lookup || (chartType === lookup && !yColumnsMeta?.[yColumn]?.chartType),
  );

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

export const isStackedBar = ({ chartType, chartSubType }: YColumnsMetaData) =>
  chartType === ChartType.barChart && chartSubType === BarChartSubType.stacked;

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
  breakdowns: string[],
  yColumns: string[],
  resultData: ResultData[],
  excludedMetricsForStackedBars: string[],
  includedMetricsForStackedBars: string[],
  isMainChartStacked: boolean,
  yColumnSortingType?: SortingType,
): ResultData[] => {
  if (yColumnSortingType) {
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
      const sortSign = yColumnSortingType === SortingType.asc ? 1 : -1;
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

export const getBreakdownsOnly = (breakdown = '') => {
  const items = breakdown.split(BREAKDOWN_SEPARATOR);
  if (items.length > 1) {
    return items.slice(1);
  }
  return [items[0]];
};

export const getResultColor = (breakdown = '', colorSchemes: ColorSchemes, resultColors: JsonObject) => {
  const currentMetric = getMetricFromBreakdown(breakdown);
  let resultColorScheme = colorSchemes.metric?.[currentMetric];
  if (!resultColorScheme) {
    const foundBreakdown = getBreakdownsOnly(breakdown).find(bo => colorSchemes.breakdown?.[bo]);
    if (foundBreakdown) {
      resultColorScheme = colorSchemes.breakdown?.[foundBreakdown];
    }
  }

  // eslint-disable-next-line no-underscore-dangle
  const calcColorScheme = resultColorScheme ?? colorSchemes.__DEFAULT_COLOR_SCHEME__;
  const colorFn = resultColors[`${calcColorScheme}`] ?? CategoricalColorNamespace.getScale(calcColorScheme);

  return {
    [`${calcColorScheme}`]: colorFn,
    [breakdown]: colorFn(`${breakdown}`),
  };
};

export const processNumbers = (
  resultData: ResultData[],
  breakdowns: string[],
  numbersFormat?: string,
  numbersFormatDigits?: number,
) => {
  if (numbersFormat === 'SMART_NUMBER' && !Number.isNaN(Number(numbersFormatDigits))) {
    // eslint-disable-next-line no-param-reassign
    return resultData.map(item => ({
      ...item,
      ...breakdowns.reduce((prevBreakdown, nextBreakdown) => {
        if (item[nextBreakdown] === undefined) {
          return prevBreakdown;
        }
        return {
          ...prevBreakdown,
          [nextBreakdown]: Number(
            Number(item[nextBreakdown])
              .toLocaleString('en-US', {
                minimumFractionDigits: numbersFormatDigits,
                maximumFractionDigits: numbersFormatDigits,
              })
              .replace(/,/g, ''),
          ),
        };
      }, {}),
    }));
  }
  return resultData;
};

export const addRechartsKeyAndGetXColumnValues = (
  data: Data[],
  xColumnValues: string[],
  hasTimeSeries?: boolean,
  xColumns: string[] = [],
  hiddenTickLabels?: HiddenTickLabels,
) =>
  data.map(item => {
    const dataKey = xColumns.map(field => getXColumnValues(field, item, xColumnValues));
    return {
      ...item,
      rechartsDataKey: dataKey.join(', '),
      rechartsDataKeyUI: dataKey.filter(value => hasTimeSeries || !hiddenTickLabels?.[value]).join(', '),
    };
  });

export const addBreakdownYColumnsAndGetBreakdownValues = (
  resultData: ResultData[],
  yColumns: string[],
  columnNames: string[],
  breakdowns: string[],
  chartType: ChartType,
  zDimension?: string,
) =>
  resultData.map(item => {
    yColumns.forEach(metric => {
      const breakdown = (columnNames || []).reduce(
        (acc, column) => (item[column] ? `${acc}${BREAKDOWN_SEPARATOR}${item[column]}` : acc),
        '',
      );
      // Build metric name by breakdown
      const resultBreakdown = `${metric}${breakdown}`;
      if (chartType === ChartType.bubbleChart) {
        // eslint-disable-next-line no-param-reassign
        item[`${resultBreakdown}${Z_SEPARATOR}`] = item[zDimension as string];
      }
      // mutation to save unnecessary loops
      // eslint-disable-next-line no-param-reassign
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
