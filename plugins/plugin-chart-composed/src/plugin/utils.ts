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
import { BarChartValue, CHART_SUB_TYPES, CHART_TYPES, Layout, LegendPosition } from '../components/utils';

export const MAX_FORM_CONTROLS = 10;
export const BREAKDOWN_SEPARATOR = '_$_';

type Metric = {
  label: string;
};

export type LabelColors = 'black' | 'white';

export type FormData = {
  [key: string]: string | string[] | Metric[] | boolean;
  layout: Layout;
  colorScheme: string;
  minBarWidth: string;
  useOrderByMetric0: boolean;
  chartType: keyof typeof CHART_TYPES;
  lineChartSubType: keyof typeof CHART_SUB_TYPES;
  areaChartSubType: keyof typeof CHART_SUB_TYPES;
  barChartSubType: keyof typeof CHART_SUB_TYPES;
  scatterChartSubType: keyof typeof CHART_SUB_TYPES;
  numbersFormat: string;
  columns: string[];
  labelsColor: LabelColors;
  xAxisLabel: string;
  showTotals: boolean;
  yAxisLabel: string;
  showLegend: boolean;
  legendPosition: LegendPosition;
  y2AxisLabel: string;
  xAxisTickLabelAngle: string;
  yAxisTickLabelAngle: string;
  y2AxisTickLabelAngle: string;
  numbersFormatDigits: string;
  useY2Axis: boolean;
  metrics: Metric[];
  groupby: string[];
  granularitySqla: string;
};

export type Data = { [key: string]: string | number };
export type ResultData = {
  rechartsDataKey: string;
  rechartsDataKeyUI: string;
  rechartsTotal?: number;
  color?: string;
  [key: string]: BarChartValue | string | number | undefined;
};

export type ColorsMap = { [key: string]: string };

export enum SortingType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const SortingTypeNames = {
  [SortingType.ASC]: t('Ascending'),
  [SortingType.DESC]: t('Descending'),
};

export const getChartSubType = (
  chartType: keyof typeof CHART_TYPES,
  barChartSubType: keyof typeof CHART_SUB_TYPES,
  lineChartSubType: keyof typeof CHART_SUB_TYPES,
  areaChartSubType: keyof typeof CHART_SUB_TYPES,
  scatterChartSubType: keyof typeof CHART_SUB_TYPES,
) => {
  switch (chartType) {
    case CHART_TYPES.LINE_CHART:
      return lineChartSubType;
    case CHART_TYPES.AREA_CHART:
      return areaChartSubType;
    case CHART_TYPES.SCATTER_CHART:
      return scatterChartSubType;
    case CHART_TYPES.BAR_CHART:
    default:
      return barChartSubType;
  }
};

const getGroupByValues = (field: string, item: Record<string, string | number>, groupByValues: string[]) => {
  if (!groupByValues.includes(field)) {
    groupByValues.push(field); // Small mutation in map, but better then one more iteration
  }
  return item[field];
};

export const addRechartsKeyAndGetGroupByValues = (
  formData: FormData,
  data: Data[],
  groupByValues: string[],
  isTimeSeries: boolean,
) =>
  data.map(item => {
    const dataKey = formData.groupby.map(field => getGroupByValues(field, item, groupByValues));
    return {
      ...item,
      rechartsDataKey: dataKey.join(', '),
      rechartsDataKeyUI: dataKey
        .filter((value, index) => isTimeSeries || formData[`useCategoryFormattingGroupBy${index}`])
        .join(', '),
    };
  });

export const addBreakdownMetricsAndGetBreakdownValues = (
  resultData: ResultData[],
  metrics: string[],
  formData: FormData,
  breakdowns: string[],
) =>
  resultData.map(item => {
    metrics.forEach(metric => {
      const breakdown = (formData.columns || []).reduce(
        (acc, column) => `${acc}${BREAKDOWN_SEPARATOR}${item[column]}`,
        '',
      );
      // Build metric name by breakdown
      const resultBreakdown = `${metric}${breakdown}`;
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

export const processNumbers = (
  resultData: ResultData[],
  breakdowns: string[],
  numbersFormat: string,
  numbersFormatDigits?: string,
) => {
  const digits = Number(numbersFormatDigits);
  if (numbersFormat === 'SMART_NUMBER' && numbersFormatDigits && !Number.isNaN(digits)) {
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
                minimumFractionDigits: digits,
                maximumFractionDigits: digits,
              })
              .replace(/,/g, ''),
          ),
        };
      }, {}),
    }));
  }
  return resultData;
};

export const checkTimeSeries = (groupBy?: string[], granularitySqla?: string, layout?: Layout) =>
  groupBy?.length === 1 && groupBy?.[0] === granularitySqla && layout === Layout.horizontal;

export const sortOrderedBars = (resultData: ResultData[], groupByValues: string[], formData: FormData) => {
  // @ts-ignore
  resultData.sort((a, b) => {
    for (let i = 0; i < MAX_FORM_CONTROLS; i++) {
      if (formData[`useOrderByGroupBy${i}`]) {
        if (a[groupByValues[i]] === b[groupByValues[i]]) {
          continue;
        }
        const sign = formData[`orderByTypeGroupBy${i}`];
        return ((a[groupByValues[i]] ?? '') > (b[groupByValues[i]] ?? '') && sign === SortingType.ASC) ||
          ((a[groupByValues[i]] ?? '') < (b[groupByValues[i]] ?? '') && sign === SortingType.DESC)
          ? 1
          : -1;
      }
      return 0;
    }
    return 0;
  });
};
