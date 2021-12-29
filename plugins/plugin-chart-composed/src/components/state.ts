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
import { useCallback, useMemo } from 'react';
import {
  checkIsMetricStacked,
  getMetricByChartType,
  getMetricFromBreakdown,
  mergeBy,
  processBarChartOrder,
  processNumbers,
  addBreakdownYColumnsAndGetBreakdownValues,
  addRechartsKeyAndGetXColumnValues,
  HIDDEN_DATA,
  NORM_SEPARATOR,
  Z_SEPARATOR,
} from './utils';
import { HiddenTickLabels, NormChart, NumbersFormat, YColumnsMeta, ResultData, SortingType, ChartType } from './types';

export const useCurrentData = (
  data: ResultData[],
  disabledDataKeys: string[],
  breakdowns: string[],
  showTotals: boolean,
  yColumns: string[],
  excludedMetricsForStackedBars: string[],
  includedMetricsForStackedBars: string[],
  isMainChartStacked: boolean,
  yColumnSortingType?: SortingType,
): ResultData[] => {
  let currentData = useMemo(
    () =>
      data.map(item => {
        const newItem = { ...item };
        disabledDataKeys.forEach(dataKey => delete newItem[dataKey]);
        return newItem;
      }),
    [data, disabledDataKeys],
  );

  currentData = useMemo(
    () =>
      processBarChartOrder(
        breakdowns,
        yColumns,
        currentData,
        excludedMetricsForStackedBars,
        includedMetricsForStackedBars,
        isMainChartStacked,
        yColumnSortingType,
      ),
    [
      breakdowns,
      yColumns,
      currentData,
      yColumnSortingType,
      excludedMetricsForStackedBars,
      includedMetricsForStackedBars,
      isMainChartStacked,
    ],
  );

  currentData = useMemo(
    () =>
      currentData.map(item => ({
        ...item,
        rechartsTotal: showTotals
          ? breakdowns.reduce(
              (total, breakdown) =>
                total +
                (checkIsMetricStacked(
                  isMainChartStacked,
                  breakdown,
                  excludedMetricsForStackedBars,
                  includedMetricsForStackedBars,
                )
                  ? (item[breakdown] as number) ?? 0
                  : 0),
              0,
            )
          : undefined,
      })),
    [
      breakdowns,
      currentData,
      excludedMetricsForStackedBars,
      includedMetricsForStackedBars,
      isMainChartStacked,
      showTotals,
    ],
  );

  return currentData;
};
export const useZAxisRange = (currentData: ResultData[], bubbleSize = 1000) =>
  useCallback<(arg: string) => number[]>(
    breakdown => {
      const axisValues = [
        ...currentData.map(item => item[`${breakdown}${Z_SEPARATOR}`]).filter(item => item !== undefined),
      ] as number[];
      const min = Math.min(...axisValues);
      const max = Math.max(...axisValues);

      const allAxisValues = [
        ...currentData
          .map(item =>
            Object.keys(item)
              .map(z => (z.startsWith(Z_SEPARATOR) ? item[z] : undefined))
              .filter(u => u !== undefined),
          )
          .flat(),
      ] as number[];
      const allMax = Math.max(...allAxisValues);

      const delta = bubbleSize / allMax;

      return [min * delta, max * delta];
    },
    [bubbleSize, currentData],
  );

type PreparationData = {
  columnNames: string[];
  yColumns: string[];
  yColumnsMeta: YColumnsMeta;
  data: ResultData[];
  numbersFormat?: NumbersFormat;
  normChart?: NormChart;
  xColumns: string[];
  chartType: ChartType;
  zDimension?: string;
  hasTimeSeries?: boolean;
  hiddenTickLabels?: HiddenTickLabels;
};

export const useDataPreparation = ({
  columnNames,
  yColumns,
  yColumnsMeta,
  data,
  numbersFormat,
  normChart,
  xColumns,
  hasTimeSeries,
  hiddenTickLabels,
  chartType,
  zDimension,
}: PreparationData) =>
  useMemo(() => {
    const breakdowns: string[] = [];
    let resultData = addBreakdownYColumnsAndGetBreakdownValues(
      data,
      yColumns,
      columnNames,
      breakdowns,
      chartType,
      zDimension,
    );

    // Unit data elements by groupBy values
    resultData = mergeBy(resultData, 'rechartsDataKey');
    resultData = processNumbers(resultData, [...breakdowns, ...yColumns], numbersFormat?.type, numbersFormat?.digits);

    if (normChart) {
      const xColumnValues: string[] = [];
      const secondQueryData = mergeBy(
        addRechartsKeyAndGetXColumnValues(normChart?.data, xColumnValues, hasTimeSeries, xColumns, hiddenTickLabels),
        'rechartsDataKey',
      );
      const foundMetric = getMetricByChartType(ChartType.normChart as ChartType, yColumns, yColumnsMeta, chartType)[0];
      resultData = resultData.map(item => {
        const secondQueryFound = secondQueryData.find(sqd => sqd.rechartsDataKey === item.rechartsDataKey);
        return {
          ...item,
          [`${foundMetric}${NORM_SEPARATOR}`]: secondQueryFound?.[foundMetric] ?? '-',
          [foundMetric]: HIDDEN_DATA,
        };
      });
    }

    return {
      breakdowns: [...breakdowns].sort(
        (a, b) =>
          yColumns.findIndex(yColumn => yColumn === getMetricFromBreakdown(a)) -
          yColumns.findIndex(yColumn => yColumn === getMetricFromBreakdown(b)),
      ),
      yColumns: [...yColumns].sort((a, b) =>
        `${yColumnsMeta?.[a]?.chartType}${yColumnsMeta?.[a]?.chartSubType}` >
        `${yColumnsMeta?.[b]?.chartType}${yColumnsMeta?.[b]?.chartSubType}`
          ? 1
          : -1,
      ),
      data: resultData,
    };
  }, [
    chartType,
    columnNames,
    data,
    hasTimeSeries,
    hiddenTickLabels,
    normChart,
    numbersFormat?.digits,
    numbersFormat?.type,
    xColumns,
    yColumns,
    yColumnsMeta,
    zDimension,
  ]);
