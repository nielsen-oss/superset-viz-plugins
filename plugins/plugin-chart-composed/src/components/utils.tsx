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
import React from 'react';
import { Area, Bar, LabelFormatter, LabelProps, LegendPayload, LegendProps, Line, Scatter } from 'recharts';
import { CategoricalColorNamespace, getNumberFormatter } from '@superset-ui/core';
import { BREAKDOWN_SEPARATOR, LabelColors, ResultData } from '../plugin/utils';
import ComposedChartTick, { ComposedChartTickProps } from './ComposedChartTick';

export enum Layout {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export const MAX_SYMBOLS_IN_TICK_LABEL = 20;
export const MIN_SYMBOL_WIDTH_FOR_TICK_LABEL = 6;
export const MIN_BAR_SIZE_FOR_LABEL = 18;
export const MIN_SYMBOL_WIDTH_FOR_LABEL = 14;
export const MIN_LABEL_MARGIN = 20;

export enum LegendPosition {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}

export const CHART_TYPES = {
  BAR_CHART: 'BAR_CHART',
  LINE_CHART: 'LINE_CHART',
  SCATTER_CHART: 'SCATTER_CHART',
  AREA_CHART: 'AREA_CHART',
};

export const CHART_SUB_TYPES = {
  CIRCLE: 'circle',
  DIAMOND: 'diamond',
  SQUARE: 'square',
  WYE: 'wye',

  BASIS: 'basis',
  LINEAR: 'linear',
  NATURAL: 'natural',
  MONOTONE: 'monotone',
  STEP: 'step',

  DEFAULT: 'default',
  STACKED: 'stacked',
};

export const CHART_TYPE_NAMES = {
  [CHART_TYPES.BAR_CHART]: 'Bar Chart',
  [CHART_TYPES.LINE_CHART]: 'Line Chart',
  [CHART_TYPES.AREA_CHART]: 'Area Chart',
  [CHART_TYPES.SCATTER_CHART]: 'Scatter Chart',
};

export const CHART_SUB_TYPE_NAMES = {
  [CHART_TYPES.BAR_CHART]: {
    [CHART_SUB_TYPES.DEFAULT]: 'Default Bar Chart',
    [CHART_SUB_TYPES.STACKED]: 'Stacked Bar Chart',
  },
  [CHART_TYPES.SCATTER_CHART]: {
    [CHART_SUB_TYPES.CIRCLE]: 'Circle Scatter Chart',
    [CHART_SUB_TYPES.DIAMOND]: 'Diamond Scatter Chart',
    [CHART_SUB_TYPES.SQUARE]: 'Square Scatter Chart',
    [CHART_SUB_TYPES.WYE]: 'Wye Scatter Chart',
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

type LegendAlign = 'left' | 'center' | 'right';
type LegendVerticalAlign = 'top' | 'middle' | 'bottom';

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

const getLabelSize = (angle: number, dataKeyLength: number, angleMin: number, angleMax: number): number =>
  angle === angleMin
    ? MIN_LABEL_MARGIN
    : dataKeyLength + (angle === angleMax ? MIN_SYMBOL_WIDTH_FOR_TICK_LABEL * 6 : 0);

export const getMetricName = (name: string, metrics: string[]) =>
  metrics.length === 1 ? name.split(BREAKDOWN_SEPARATOR).pop() : name.split(BREAKDOWN_SEPARATOR).join(', ');

export const getLegendProps = (
  legendPosition: LegendPosition,
  height: number,
  width: number,
  legendWidth: number,
  breakdowns: string[],
  disabledDataKeys: string[],
  colorScheme: string,
  metrics: string[],
): LegendProps => {
  const payload: LegendPayload[] = breakdowns.map((breakdown, index) => ({
    value: getMetricName(breakdown, metrics),
    id: breakdown,
    type: disabledDataKeys.includes(breakdown) ? 'line' : 'circle',
    color: CategoricalColorNamespace.getScale(colorScheme)(index),
  }));
  let result = {
    payload,
    width: legendWidth,
    wrapperStyle: {
      maxHeight: height,
    },
    align: 'center' as LegendAlign,
    verticalAlign: 'middle' as LegendVerticalAlign,
  };
  if (legendPosition === LegendPosition.left || legendPosition === LegendPosition.right) {
    result = {
      ...result,
      align: legendPosition as LegendAlign,
    };
  }
  switch (legendPosition) {
    case LegendPosition.left:
      return {
        ...result,
        layout: Layout.vertical,
      };
    case LegendPosition.right:
      return {
        ...result,
        layout: Layout.vertical,
        wrapperStyle: {
          ...result.wrapperStyle,
          paddingLeft: 20,
        },
      };
    case LegendPosition.bottom:
      return {
        ...result,
        layout: 'horizontal',
        verticalAlign: legendPosition as LegendVerticalAlign,
        wrapperStyle: {
          ...result.wrapperStyle,
          paddingTop: 10,
          width,
        },
      };
    case LegendPosition.top:
    default:
      return {
        ...result,
        layout: 'horizontal',
        verticalAlign: legendPosition as LegendVerticalAlign,
        wrapperStyle: {
          ...result.wrapperStyle,
          paddingBottom: 10,
          width,
        },
      };
  }
};

export type ChartsUIItem = ChartLineItem | ChartBarItem | ChartScatterItem;

export type ChartScatterItem = {
  Element: React.ElementType;
  opacity?: number;
  shape?: string;
};

export type ChartLineItem = {
  Element: React.ElementType;
  type?: string;
  strokeOpacity?: string;
  stroke?: string;
  strokeWidth?: number;
};

export type ChartBarItem = {
  Element: React.ElementType;
  fill?: string;
  opacity?: number;
  stackId?: string | boolean;
};

export const getChartElement = (
  breakdown: string,
  chartType: keyof typeof CHART_TYPES,
  chartSubType: keyof typeof CHART_SUB_TYPES,
  colorScheme: string,
  hasDifferentTypes: boolean,
  index: number,
): ChartsUIItem => {
  const color = CategoricalColorNamespace.getScale(colorScheme)(index);

  let commonProps: Partial<ChartsUIItem> & Pick<ChartsUIItem, 'Element'>;

  switch (chartType) {
    case CHART_TYPES.LINE_CHART:
      commonProps = {
        Element: Line,
        strokeWidth: 2,
        stroke: color,
        opacity: 0.8,
        type: chartSubType,
      };
      break;
    case CHART_TYPES.AREA_CHART:
      commonProps = {
        Element: Area,
        strokeWidth: 2,
        stroke: color,
        fill: color,
        opacity: 0.8,
        type: chartSubType,
      };
      break;
    case CHART_TYPES.SCATTER_CHART:
      commonProps = {
        Element: Scatter,
        fill: color,
        opacity: 0.8,
        shape: chartSubType,
      };
      break;
    case CHART_TYPES.BAR_CHART:
    default:
      commonProps = {
        Element: Bar,
        opacity: hasDifferentTypes ? 0.6 : 1,
        fill: color,
        stackId: chartSubType === CHART_SUB_TYPES.STACKED ? 'metric' : breakdown,
      };
  }

  return { ...commonProps };
};

type AxisProps = {
  layout: Layout;
  angle?: number;
  label?: string;
  isSecondAxis?: boolean;
  dataKey?: string;
  dataKeyLength: number;
  metricLength: number;
  numbersFormat: string;
};

const AXIS_OFFSET = 30;
export const getXAxisProps = ({ layout, angle = 0, label, dataKeyLength, metricLength, numbersFormat }: AxisProps) => {
  const textAnchor = angle === 0 ? 'middle' : 'end';
  const labelProps: LabelProps = {
    value: label,
    position: 'bottom',
    dy: -15,
  };
  const params = {
    dy: 5,
    label: labelProps,
    angle,
  };
  switch (layout) {
    case Layout.vertical:
      return {
        ...params,
        tick: (props: ComposedChartTickProps) => (
          <ComposedChartTick {...props} textAnchor={textAnchor} tickFormatter={getNumberFormatter(numbersFormat)} />
        ),
        height: angle === 0 ? MIN_LABEL_MARGIN + AXIS_OFFSET : metricLength + AXIS_OFFSET,
        type: 'number' as const,
      };
    case Layout.horizontal:
    default:
      return {
        ...params,
        tick: (props: ComposedChartTickProps) => <ComposedChartTick {...props} textAnchor={textAnchor} />,
        height: getLabelSize(angle, dataKeyLength, 0, -90) + AXIS_OFFSET,
        interval: 0,
        dataKey: 'rechartsDataKeyUI',
      };
  }
};

export const getYAxisProps = ({
  layout,
  angle = 0,
  label,
  dataKey,
  isSecondAxis,
  dataKeyLength,
  metricLength,
  numbersFormat,
}: AxisProps) => {
  const textAnchorPerAxis = isSecondAxis ? 'start' : 'end';
  const textAnchor = angle === -90 ? 'middle' : textAnchorPerAxis;
  const labelOffset = 0;
  const labelProps: LabelProps = {
    offset: labelOffset,
    value: label,
    angle: 90,
    position: isSecondAxis ? 'right' : 'left',
  };
  const params = {
    angle,
    orientation: isSecondAxis ? ('right' as const) : ('left' as const),
    yAxisId: isSecondAxis ? 'right' : 'left',
    label: labelProps,
  };
  switch (layout) {
    case Layout.vertical:
      return {
        ...params,
        tick: (props: ComposedChartTickProps) => <ComposedChartTick {...props} textAnchor={textAnchor} />,
        width: getLabelSize(angle, dataKeyLength, -90, 0),
        dataKey: isSecondAxis ? dataKey : 'rechartsDataKeyUI',
        type: 'category' as const,
      };
    default:
      return {
        ...params,
        width: angle === -90 ? MIN_LABEL_MARGIN : metricLength + AXIS_OFFSET,
        tick: (props: ComposedChartTickProps) => (
          <ComposedChartTick {...props} textAnchor={textAnchor} tickFormatter={getNumberFormatter(numbersFormat)} />
        ),
      };
  }
};

export const getCartesianGridProps = ({ layout }: { layout: Layout }) => {
  switch (layout) {
    case Layout.vertical:
      return {
        horizontal: false,
      };
    case Layout.horizontal:
    default:
      return {
        vertical: false,
      };
  }
};

export const getMaxLengthOfDataKey = (data: ResultData[]) =>
  Math.min(Math.max(...data.map(item => item.rechartsDataKeyUI.length)), MAX_SYMBOLS_IN_TICK_LABEL);

export const getMaxLengthOfMetric = (data: ResultData[], metrics: string[], formatter = (value: any) => `${value}`) =>
  Math.max(
    ...data.map(
      item =>
        (formatter(Math.abs(metrics.reduce((total, metric) => total + (item[metric] as number), 0))) as string).length,
    ),
  );

export const renderLabel = ({
  formatter = value => `${value}`,
  width: labelWidth = 0,
  height: labelHeight = 0,
  currentData,
  breakdown,
  index,
}: LabelProps & { currentData: ResultData[]; breakdown: string; index: number }) => {
  const formattedValue = `${formatter(currentData[index][breakdown])}`;
  if (
    Math.abs(labelHeight) < MIN_BAR_SIZE_FOR_LABEL ||
    Math.abs(labelWidth) < formattedValue.length * MIN_SYMBOL_WIDTH_FOR_LABEL
  ) {
    return '';
  }
  return formattedValue;
};

type ChartElementProps = {
  breakdown: string;
  colorScheme: string;
  useY2Axis?: boolean;
  chartSubType: keyof typeof CHART_SUB_TYPES;
  isAnimationActive?: boolean;
  chartType: keyof typeof CHART_TYPES;
  metrics: string[];
  labelsColor: LabelColors;
  chartTypeMetrics: (keyof typeof CHART_TYPES)[];
  chartSubTypeMetrics: (keyof typeof CHART_SUB_TYPES)[];
  useCustomTypeMetrics: boolean[];
  numbersFormat: string;
  updater: number;
  index: number;
  currentData: ResultData[];
};

export const renderChartElement = ({
  breakdown,
  chartType,
  currentData,
  metrics,
  numbersFormat,
  useY2Axis,
  labelsColor,
  isAnimationActive,
  updater,
  index,
  chartSubType,
  useCustomTypeMetrics,
  chartTypeMetrics,
  chartSubTypeMetrics,
  colorScheme,
}: ChartElementProps) => {
  let customChartType = chartType;
  let customChartSubType = chartSubType;
  if (useCustomTypeMetrics[index]) {
    customChartType = chartTypeMetrics[index];
    customChartSubType = chartSubTypeMetrics[index];
  }
  const { Element, ...elementProps } = getChartElement(
    breakdown,
    customChartType,
    customChartSubType,
    colorScheme,
    customChartType === CHART_TYPES.BAR_CHART && useCustomTypeMetrics.some(el => el),
    index,
  );
  return (
    <Element
      key={`${breakdown}${updater}`}
      isAnimationActive={isAnimationActive}
      label={{
        fill: labelsColor,
        position: 'center',
        formatter: getNumberFormatter(numbersFormat) as LabelFormatter,
        content: renderLabel,
        currentData,
        breakdown,
      }}
      yAxisId={useY2Axis && breakdown.split(BREAKDOWN_SEPARATOR)[0] === metrics[metrics.length - 1] ? 'right' : 'left'}
      dataKey={breakdown}
      {...elementProps}
    />
  );
};
