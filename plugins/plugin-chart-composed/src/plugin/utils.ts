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
import { JsonObject, QueryFormColumn, SetAdhocFilter, t } from '@superset-ui/core';
import { ControlPanelsContainerProps, ControlStateMapping } from '@superset-ui/chart-controls';
import {
  BarChartSubType,
  ChartType,
  LabelColors,
  Layout,
  LegendPosition,
  LineChartSubType,
  ResultData,
  ScatterChartSubType,
  SortingType,
  StickyScatters,
} from '../components/types';

export const MAX_FORM_CONTROLS = 5;
export enum QueryMode {
  aggregate = 'aggregate',
  raw = 'raw',
}

type Metric = {
  label: string;
};

export enum Sorting {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const CHART_TYPES = {
  BAR_CHART: 'BAR_CHART',
  LINE_CHART: 'LINE_CHART',
  SCATTER_CHART: 'SCATTER_CHART',
  AREA_CHART: 'AREA_CHART',
  BUBBLE_CHART: 'BUBBLE_CHART',
  NORM_CHART: 'NORM_CHART',
};

export const CHART_TYPE_NAMES = {
  [CHART_TYPES.BAR_CHART]: 'Bar',
  [CHART_TYPES.LINE_CHART]: 'Line',
  [CHART_TYPES.AREA_CHART]: 'Area',
  [CHART_TYPES.SCATTER_CHART]: 'Scatter',
  [CHART_TYPES.BUBBLE_CHART]: 'Bubble',
  [CHART_TYPES.NORM_CHART]: 'Norm',
};

export enum STICK_TYPES {
  START = 'START',
  CENTER = 'CENTER',
  END = 'END',
}

export type FormData = {
  [key: string]: string | string[] | Metric[] | Metric | boolean | SetAdhocFilter[];
  layout: Layout;
  drillDownGroupBy: string[];
  colorScheme: string;
  coloredBreakdowns: SetAdhocFilter[];
  colorSchemeByBreakdown: string;
  minBarWidth: string;
  xAxisInterval: string;
  queryMode: QueryMode;
  xColumn: string;
  yColumn: string;
  chartType: keyof typeof CHART_TYPES;
  lineChartSubType: keyof typeof CHART_SUB_TYPES;
  areaChartSubType: keyof typeof CHART_SUB_TYPES;
  barChartSubType: keyof typeof CHART_SUB_TYPES;
  scatterChartSubType: keyof typeof CHART_SUB_TYPES;
  bubbleChartSubType: keyof typeof CHART_SUB_TYPES;
  normChartSubType: keyof typeof CHART_SUB_TYPES;
  numbersFormat: string;
  columns: string[];
  labelsColor: LabelColors;
  xAxisLabel: string;
  zDimension: Metric;
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

export type ColorsMap = { [key: string]: string };

export const CHART_SUB_TYPES = {
  CIRCLE: 'circle',
  DIAMOND: 'diamond',
  SQUARE: 'square',
  WYE: 'wye',
  ARROW_UP: 'arrowUp',
  ARROW_DOWN: 'arrowDown',

  BASIS: 'basis',
  LINEAR: 'linear',
  NATURAL: 'natural',
  MONOTONE: 'monotone',
  STEP: 'step',

  DEFAULT: 'default',
  STACKED: 'stacked',
};
export const CHART_SUB_TYPE_NAMES = {
  [CHART_TYPES.BAR_CHART]: {
    [CHART_SUB_TYPES.DEFAULT]: 'Default Bar Chart',
    [CHART_SUB_TYPES.STACKED]: 'Stacked Bar Chart',
  },
  [CHART_TYPES.NORM_CHART]: {
    [CHART_SUB_TYPES.DEFAULT]: 'Default Norm Chart',
  },
  [CHART_TYPES.SCATTER_CHART]: {
    [CHART_SUB_TYPES.CIRCLE]: 'Circle Scatter Chart',
    [CHART_SUB_TYPES.DIAMOND]: 'Diamond Scatter Chart',
    [CHART_SUB_TYPES.SQUARE]: 'Square Scatter Chart',
    [CHART_SUB_TYPES.WYE]: 'Wye Scatter Chart',
    [CHART_SUB_TYPES.ARROW_UP]: 'Arrow Up Scatter Chart',
    [CHART_SUB_TYPES.ARROW_DOWN]: 'Arrow Down Scatter Chart',
  },
  [CHART_TYPES.BUBBLE_CHART]: {
    [CHART_SUB_TYPES.CIRCLE]: 'Circle Bubble Chart',
    [CHART_SUB_TYPES.DIAMOND]: 'Diamond Bubble Chart',
    [CHART_SUB_TYPES.SQUARE]: 'Square Bubble Chart',
    [CHART_SUB_TYPES.WYE]: 'Wye Bubble Chart',
    [CHART_SUB_TYPES.ARROW_UP]: 'Arrow Up Bubble Chart',
    [CHART_SUB_TYPES.ARROW_DOWN]: 'Arrow Down Bubble Chart',
  },
  [CHART_TYPES.LINE_CHART]: {
    [CHART_SUB_TYPES.BASIS]: 'Basis Line Chart',
    [CHART_SUB_TYPES.LINEAR]: 'Linear Line Chart',
    [CHART_SUB_TYPES.NATURAL]: 'Natural Line Chart',
    [CHART_SUB_TYPES.MONOTONE]: 'Monotone Line Chart',
    [CHART_SUB_TYPES.STEP]: 'Step Line Chart',
  },
  [CHART_TYPES.AREA_CHART]: {
    [CHART_SUB_TYPES.BASIS]: 'Basis Area Chart',
    [CHART_SUB_TYPES.LINEAR]: 'Linear Area Chart',
    [CHART_SUB_TYPES.NATURAL]: 'Natural Area Chart',
    [CHART_SUB_TYPES.MONOTONE]: 'Monotone Area Chart',
    [CHART_SUB_TYPES.STEP]: 'Step Area Chart',
  },
};

export const enumsMapSticky = {
  [STICK_TYPES.START]: StickyScatters.start,
  [STICK_TYPES.CENTER]: StickyScatters.center,
  [STICK_TYPES.END]: StickyScatters.end,
};

export const enumsMapChartType = {
  [CHART_TYPES.BAR_CHART]: ChartType.barChart,
  [CHART_TYPES.AREA_CHART]: ChartType.areaChart,
  [CHART_TYPES.LINE_CHART]: ChartType.lineChart,
  [CHART_TYPES.BUBBLE_CHART]: ChartType.bubbleChart,
  [CHART_TYPES.SCATTER_CHART]: ChartType.scatterChart,
  [CHART_TYPES.NORM_CHART]: ChartType.normChart,
};

export const enumsMapChartSubType = {
  [CHART_SUB_TYPES.CIRCLE]: ScatterChartSubType.circle,
  [CHART_SUB_TYPES.DEFAULT]: BarChartSubType.default,
  [CHART_SUB_TYPES.WYE]: ScatterChartSubType.wye,
  [CHART_SUB_TYPES.BASIS]: LineChartSubType.basis,
  [CHART_SUB_TYPES.STEP]: LineChartSubType.step,
  [CHART_SUB_TYPES.ARROW_DOWN]: ScatterChartSubType.arrowDown,
  [CHART_SUB_TYPES.ARROW_UP]: ScatterChartSubType.arrowUp,
  [CHART_SUB_TYPES.DIAMOND]: ScatterChartSubType.diamond,
  [CHART_SUB_TYPES.LINEAR]: LineChartSubType.linear,
  [CHART_SUB_TYPES.MONOTONE]: LineChartSubType.monotone,
  [CHART_SUB_TYPES.NATURAL]: LineChartSubType.natural,
  [CHART_SUB_TYPES.SQUARE]: ScatterChartSubType.square,
  [CHART_SUB_TYPES.STACKED]: BarChartSubType.stacked,
};

export const enumSorting = {
  [Sorting.ASC]: SortingType.asc,
  [Sorting.DESC]: SortingType.desc,
};

export const SortingTypeNames = {
  [Sorting.ASC]: t('Ascending'),
  [Sorting.DESC]: t('Descending'),
};

export const getChartSubType = (
  chartType: keyof typeof CHART_TYPES,
  barChartSubType: keyof typeof CHART_SUB_TYPES,
  lineChartSubType: keyof typeof CHART_SUB_TYPES,
  areaChartSubType: keyof typeof CHART_SUB_TYPES,
  scatterChartSubType: keyof typeof CHART_SUB_TYPES,
  bubbleChartSubType: keyof typeof CHART_SUB_TYPES,
  normChartSubType: keyof typeof CHART_SUB_TYPES,
) => {
  switch (chartType) {
    case CHART_TYPES.LINE_CHART:
      return lineChartSubType;
    case CHART_TYPES.AREA_CHART:
      return areaChartSubType;
    case CHART_TYPES.SCATTER_CHART:
      return scatterChartSubType;
    case CHART_TYPES.BUBBLE_CHART:
      return bubbleChartSubType;
    case CHART_TYPES.NORM_CHART:
      return normChartSubType;
    case CHART_TYPES.BAR_CHART:
    default:
      return barChartSubType;
  }
};

export const checkTimeSeries = (groupBy?: string[], granularitySqla?: string, layout?: Layout) =>
  groupBy?.length === 1 && groupBy?.[0] === granularitySqla && layout === Layout.horizontal;

export const sortOrderedBars = (
  resultData: ResultData[],
  yColumnValues: string[],
  formData: FormData,
  prefix = 'string',
) => {
  // @ts-ignore
  resultData.sort((a, b) => {
    for (let i = 0; i < MAX_FORM_CONTROLS; i++) {
      if (formData[`useOrderBy${prefix}${i}`]) {
        if (a[yColumnValues[i]] === b[yColumnValues[i]]) {
          continue;
        }
        const sign = formData[`orderByType${prefix}${i}`];
        return ((a[yColumnValues[i]] ?? '') > (b[yColumnValues[i]] ?? '') && sign === Sorting.ASC) ||
          ((a[yColumnValues[i]] ?? '') < (b[yColumnValues[i]] ?? '') && sign === Sorting.DESC)
          ? 1
          : -1;
      }
      return 0;
    }
    return 0;
  });
};

export const has2Queries = (fromData: JsonObject = {}) => {
  for (let i = 0; i < MAX_FORM_CONTROLS; i++) {
    const isCustomNorm =
      fromData[`use_custom_type_metric_${i}`] && fromData[`chart_type_metric_${i}`] === CHART_TYPES.NORM_CHART;
    const isMainNorm = fromData.chart_type === CHART_TYPES.NORM_CHART;
    const isIgnoreCustom = !fromData[`use_custom_type_metric_${i}`];
    if ((isMainNorm && (isIgnoreCustom || isCustomNorm)) || (!isMainNorm && isCustomNorm)) {
      return { metricOrder: i };
    }
  }
  return false;
};

export const getQueryMode = (controls: ControlStateMapping): QueryMode => {
  const mode = controls?.query_mode?.value;
  if (mode === QueryMode.aggregate || mode === QueryMode.raw) {
    return mode as QueryMode;
  }
  const rawColumns = controls?.all_columns?.value as QueryFormColumn[] | undefined;
  const hasRawColumns = rawColumns && rawColumns.length > 0;
  return hasRawColumns ? QueryMode.raw : QueryMode.aggregate;
};

export const isQueryMode = (mode: QueryMode) => ({ controls }: ControlPanelsContainerProps) =>
  getQueryMode(controls) === mode;
export const isAggMode = isQueryMode(QueryMode.aggregate);
export const isRawMode = isQueryMode(QueryMode.raw);

export const getLabel = (formData: FormData, axisLabel?: string) => {
  const moustacheRegexp = new RegExp(/{{(.*?)}}/g);
  if (axisLabel && moustacheRegexp.test(axisLabel)) {
    const filterName = axisLabel.replace(/[{}]/g, '').trim();
    let value = '';
    if (filterName) {
      const item = (formData?.extraFilters as any[])?.find(f => f.col === filterName);
      if (item) {
        if (item?.op === 'IN') {
          value = item.val.join(', ');
        } else {
          value = item.val;
        }
      }
    }
    return value;
  }
  return axisLabel || '';
};
