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
import React, { RefObject } from 'react';
import {
  Area,
  Bar,
  LabelFormatter,
  LabelProps,
  LegendPayload,
  LegendProps,
  Line,
  Scatter,
  LabelList,
  LabelListProps,
  XAxisProps,
  AxisInterval,
} from 'recharts';
import { CategoricalColorNamespace, getNumberFormatter, JsonObject } from '@superset-ui/core';
import { BREAKDOWN_SEPARATOR, LabelColors, ResultData, Z_SEPARATOR } from '../plugin/utils';
import ComposedChartTick, { ComposedChartTickProps } from './ComposedChartTick';
import { ResetProps } from './ComposedChart';
import {
  BarChartValueMap,
  CHART_SUB_TYPES,
  CHART_TYPES,
  Layout,
  LegendAlign,
  LegendPosition,
  LegendVerticalAlign,
  MIN_BAR_SIZE_FOR_LABEL,
  MIN_SYMBOL_WIDTH_FOR_LABEL,
} from './types';
import { checkIsMetricStacked, getValueForBarChart } from './utils';

const emptyRender = () => null;

export const getMetricName = (name: string, yColumns: string[], zDimension?: string) => {
  if (name?.startsWith(Z_SEPARATOR)) {
    return zDimension;
  }
  return yColumns.length === 1 ? name?.split(BREAKDOWN_SEPARATOR).pop() : name?.split(BREAKDOWN_SEPARATOR).join(', ');
};

export const renderLabel = ({
  formatter = value => `${value}`,
  width: labelWidth = 0,
  height: labelHeight = 0,
  currentData,
  breakdown,
  index,
}: LabelProps & {
  currentData: ResultData[];
  breakdown: string;
  index: number;
  hasOrderedBars: boolean;
  breakdowns: string[];
}) => {
  const formattedValue = `${formatter(currentData[index][breakdown] as number)}`;
  if (
    Math.abs(labelHeight) < MIN_BAR_SIZE_FOR_LABEL ||
    Math.abs(labelWidth) < formattedValue.length * MIN_SYMBOL_WIDTH_FOR_LABEL
  ) {
    return '';
  }
  return formattedValue;
};

export const getLegendProps = (
  legendPosition: LegendPosition,
  height: number,
  width: number,
  breakdowns: string[],
  disabledDataKeys: string[],
  colorScheme: string,
  yColumns: string[],
  xAxisHeight: number,
  yAxisWidth: number,
): LegendProps => {
  const payload: LegendPayload[] = breakdowns.map(breakdown => ({
    value: getMetricName(breakdown, yColumns),
    id: breakdown,
    type: disabledDataKeys.includes(breakdown) ? 'line' : 'square',
    color: CategoricalColorNamespace.getScale(colorScheme)(breakdown),
  }));
  let result = {
    payload,
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
        margin: { right: yAxisWidth },
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
          paddingTop: xAxisHeight,
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
          paddingBottom: 15,
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
  zAxisId?: number;
};

export type ChartLineItem = {
  Element: React.ElementType;
  type?: string;
  strokeOpacity?: string;
  stroke?: string;
  strokeWidth?: number;
  connectNulls?: boolean;
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
  color: string,
  hasDifferentTypes: boolean,
  index: number,
): ChartsUIItem => {
  let commonProps: Partial<ChartsUIItem> & Pick<ChartsUIItem, 'Element'>;

  switch (chartType) {
    case CHART_TYPES.LINE_CHART:
      commonProps = {
        Element: Line,
        strokeWidth: 2,
        stroke: color,
        opacity: 0.8,
        type: chartSubType,
        connectNulls: true,
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
    case CHART_TYPES.BUBBLE_CHART:
      commonProps = {
        Element: Scatter,
        fill: color,
        opacity: 0.8,
        zAxisId: index,
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
  tickLabelAngle?: number;
  label?: string;
  labelAngle?: number;
  interval?: AxisInterval;
  isSecondAxis?: boolean;
  resetProps?: ResetProps;
  dataKey?: string;
  height?: number;
  numbersFormat: string;
  currentData: ResultData[];
  axisHeight: number;
  axisWidth: number;
  isTimeSeries?: boolean;
  xColumns?: string[];
  xAxisClientRect?: ClientRect;
  rootRef?: RefObject<HTMLDivElement>;
  chartType?: keyof typeof CHART_TYPES;
};

const getActualXAxisSize = (
  axisWidth: number,
  numberOfTicks: number,
  axisHeight: number,
  tickLabelAngle: number,
): {
  actualWidth?: number;
  actualHeight?: number;
} => {
  const tickWidth = axisWidth / numberOfTicks;
  switch (tickLabelAngle) {
    case 0:
      return { actualWidth: Number.isNaN(tickWidth) ? 1 : tickWidth };
    case -45:
      return { actualWidth: 1.5 * (Number.isNaN(tickWidth) ? 1 : tickWidth) };
    case -90:
    default:
      return {
        actualHeight: Number.isNaN(tickWidth) ? 1 : tickWidth,
        actualWidth: axisHeight,
      };
  }
};

const getActualYAxisSize = (
  axisWidth: number,
  numberOfTicks: number,
  axisHeight: number,
  tickLabelAngle: number,
): {
  actualWidth?: number;
  actualHeight?: number;
} => {
  const tickWidth = axisWidth / numberOfTicks;
  switch (tickLabelAngle) {
    case 0:
      return { actualWidth: 1.2 * axisWidth };
    case -45:
      return { actualWidth: 1.4 * axisWidth };
    case -90:
    default:
      return {
        actualWidth: tickWidth,
      };
  }
};

export const getXAxisProps = ({
  layout,
  tickLabelAngle = 0,
  numbersFormat,
  currentData,
  axisHeight,
  axisWidth,
  label,
  isTimeSeries,
  xColumns,
  rootRef,
  interval,
  resetProps,
  chartType,
}: AxisProps) => {
  const textAnchor = tickLabelAngle === 0 ? 'middle' : 'end';
  const verticalAnchor = tickLabelAngle === 0 ? 'start' : 'middle';
  const labelProps: LabelProps = {
    value: label,
    position: 'insideBottom',
    dy: axisHeight,
  };

  const params: XAxisProps = {
    angle: tickLabelAngle,
    label: labelProps,
    interval: interval ?? 0,
  };

  const times: JsonObject = {};
  if (isTimeSeries) {
    const texts = [...(rootRef?.current?.querySelectorAll('.composed-chart-tick-time-text') ?? [])];
    let prevIt = 0;
    [...currentData, {}].forEach((item, index) => {
      const prev = new Date(Number(currentData[index - 1]?.[xColumns?.[0] as string])).getMonth();
      const currentDate = new Date(Number(currentData[index]?.[xColumns?.[0] as string]));
      if (currentDate.getMonth() !== prev) {
        const isBreakText = !resetProps?.xAxisTicks && texts.some(el => el.childNodes.length > 1);
        times[index] = {
          text: `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`,
          isBreakText,
        };
        if (times[prevIt]) {
          times[prevIt].long = index - prevIt;
        }
        prevIt = index;
      }
    });
  }

  switch (layout) {
    case Layout.vertical:
      return {
        ...params,
        axisLine: chartType === CHART_TYPES.BUBBLE_CHART,
        tick: (props: ComposedChartTickProps) => (
          <ComposedChartTick
            {...props}
            textAnchor={textAnchor}
            verticalAnchor={verticalAnchor}
            tickFormatter={getNumberFormatter(numbersFormat)}
            {...getActualXAxisSize(axisWidth, 5, axisHeight, tickLabelAngle)}
          />
        ),
        type: 'number' as const,
      };
    case Layout.horizontal:
    default:
      return {
        ...params,
        dy: tickLabelAngle === -45 ? 15 : 5,
        tick: (props: ComposedChartTickProps) => (
          <ComposedChartTick
            {...props}
            isTimeSeries={isTimeSeries}
            times={times}
            textAnchor={textAnchor}
            verticalAnchor={verticalAnchor}
            {...getActualXAxisSize(axisWidth, currentData.length, axisHeight, tickLabelAngle)}
          />
        ),
        dataKey: 'rechartsDataKeyUI',
      };
  }
};

export const getYAxisProps = ({
  layout,
  tickLabelAngle = 0,
  label,
  dataKey,
  isSecondAxis,
  labelAngle = 90,
  numbersFormat,
  height = 0,
  currentData,
  axisHeight,
  axisWidth,
  rootRef,
  chartType,
}: AxisProps) => {
  const textAnchorPerAxis = isSecondAxis ? 'start' : 'end';
  const textAnchor = tickLabelAngle === -90 ? 'middle' : textAnchorPerAxis;
  const verticalAnchor = tickLabelAngle === -90 ? 'end' : 'middle';
  const axisInverseSign = isSecondAxis ? 1 : -1;

  let dyLabel;
  if (labelAngle === 0) {
    dyLabel = 0;
  } else if ((labelAngle === -90 && !isSecondAxis) || (labelAngle === -270 && isSecondAxis)) {
    dyLabel = -axisHeight / 2 + height / 2;
  } else {
    dyLabel = axisHeight / 4 - height / 4;
  }
  const labelProps: LabelProps = {
    value: label,
    angle: labelAngle,
    position: isSecondAxis ? 'insideRight' : 'insideLeft',
    dx: isSecondAxis ? 5 : -5,
    dy: dyLabel,
  };

  const labelPerAngle =
    labelAngle === 0
      ? Number(
          rootRef?.current?.querySelectorAll('.yAxis .recharts-label')?.[isSecondAxis ? 1 : 0]?.getBoundingClientRect()
            ?.width ?? 1,
        ) + 10
      : 15;
  const labelWidth = label?.length ? labelPerAngle : 0;

  const dxPerAxis = isSecondAxis ? -5 : 5;
  const params = {
    dx: isSecondAxis && tickLabelAngle === -90 ? axisInverseSign * 5 : dxPerAxis,
    width: axisWidth + labelWidth,
    angle: tickLabelAngle,
    orientation: isSecondAxis ? ('right' as const) : ('left' as const),
    yAxisId: isSecondAxis ? 'right' : 'left',
    label: labelProps,
  };

  switch (layout) {
    case Layout.vertical:
      return {
        ...params,
        tick: (props: ComposedChartTickProps) => (
          <ComposedChartTick
            {...props}
            verticalAnchor={verticalAnchor}
            textAnchor={textAnchor}
            {...getActualYAxisSize(axisWidth, currentData.length, axisHeight, tickLabelAngle)}
          />
        ),
        dataKey: isSecondAxis ? dataKey : 'rechartsDataKeyUI',
        type: 'category' as const,
      };
    case Layout.horizontal:
    default:
      return {
        ...params,
        axisLine: chartType === CHART_TYPES.BUBBLE_CHART,
        tick: (props: ComposedChartTickProps) => (
          <ComposedChartTick
            {...props}
            verticalAnchor={verticalAnchor}
            textAnchor={textAnchor}
            tickFormatter={getNumberFormatter(numbersFormat)}
            {...getActualYAxisSize(axisWidth, 5, axisHeight, tickLabelAngle)}
          />
        ),
      };
  }
};

export const getCartesianGridProps = ({
  layout,
  chartType,
}: {
  layout: Layout;
  chartType: keyof typeof CHART_TYPES;
}) => {
  if (chartType === CHART_TYPES.BUBBLE_CHART) {
    return {
      horizontal: false,
      vertical: false,
    };
  }
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

type ChartElementProps = {
  hasOrderedBars: boolean;
  breakdown: string;
  layout: Layout;
  breakdowns: string[];
  colorScheme: string;
  hasY2Axis?: boolean;
  showTotals: boolean;
  chartSubType: keyof typeof CHART_SUB_TYPES;
  isAnimationActive?: boolean;
  chartType: keyof typeof CHART_TYPES;
  yColumns: string[];
  labelsColor: LabelColors;
  chartTypeMetrics: (keyof typeof CHART_TYPES)[];
  chartSubTypeMetrics: (keyof typeof CHART_SUB_TYPES)[];
  hasCustomTypeMetrics: boolean[];
  numbersFormat: string;
  updater: number;
  index: number;
  currentData: ResultData[];
  includedMetricsForStackedBars: string[];
  excludedMetricsForStackedBars: string[];
  isMainChartStacked: boolean;
};

export const renderChartElement = ({
  hasOrderedBars,
  breakdown,
  breakdowns,
  chartType,
  currentData,
  yColumns,
  numbersFormat,
  hasY2Axis,
  labelsColor,
  isAnimationActive,
  updater,
  index,
  chartSubType,
  hasCustomTypeMetrics,
  chartTypeMetrics,
  chartSubTypeMetrics,
  showTotals,
  colorScheme,
  layout,
  excludedMetricsForStackedBars,
  includedMetricsForStackedBars,
  isMainChartStacked,
}: ChartElementProps) => {
  let customChartType = chartType;
  let customChartSubType = chartSubType;
  const actualMetricIndex = yColumns.findIndex(metric => metric === breakdown?.split(BREAKDOWN_SEPARATOR)[0]);
  if (hasCustomTypeMetrics[actualMetricIndex]) {
    customChartType = chartTypeMetrics[actualMetricIndex];
    customChartSubType = chartSubTypeMetrics[actualMetricIndex];
  }
  const color = CategoricalColorNamespace.getScale(colorScheme)(breakdown);
  const { Element, ...elementProps } = getChartElement(
    breakdown,
    customChartType,
    customChartSubType,
    color,
    customChartType === CHART_TYPES.BAR_CHART && hasCustomTypeMetrics.some(el => el),
    index,
  );

  const labelListExtraPropsWithTotal: LabelListProps & { fill: string } = {
    fill: 'black',
    dataKey: 'rechartsTotal',
    position: layout === Layout.horizontal ? 'top' : 'right',
    formatter: getNumberFormatter(numbersFormat) as LabelFormatter,
  };

  const lastNotExcludedBarIndex =
    breakdowns.length -
    1 -
    [...breakdowns]
      .reverse()
      .findIndex(breakdown =>
        checkIsMetricStacked(
          isMainChartStacked,
          breakdown,
          excludedMetricsForStackedBars,
          includedMetricsForStackedBars,
        ),
      );

  if (index !== lastNotExcludedBarIndex) {
    labelListExtraPropsWithTotal.content = emptyRender;
  }
  let dataKey: string | Function = breakdown;
  if (
    hasOrderedBars &&
    checkIsMetricStacked(isMainChartStacked, breakdown, excludedMetricsForStackedBars, includedMetricsForStackedBars)
  ) {
    dataKey = (val: BarChartValueMap) =>
      // @ts-ignore
      getValueForBarChart(val, String(val?.orderedBarsDataMap?.[breakdown])) ?? 0; // Not sure why but it works (about 0);
  }

  if (chartType !== CHART_TYPES.BUBBLE_CHART) {
    // @ts-ignore
    elementProps.label = {
      fill: labelsColor,
      position: 'center',
      formatter: getNumberFormatter(numbersFormat) as LabelFormatter,
      content: renderLabel,
      currentData,
      breakdown,
      breakdowns,
      hasOrderedBars,
    };
  }

  return (
    <Element
      key={`${breakdown}${updater}`}
      isAnimationActive={isAnimationActive}
      yAxisId={
        hasY2Axis && breakdown?.split(BREAKDOWN_SEPARATOR)[0] === yColumns[yColumns.length - 1] ? 'right' : 'left'
      }
      dataKey={dataKey}
      {...elementProps}
    >
      {showTotals && <LabelList {...labelListExtraPropsWithTotal} />}
    </Element>
  );
};
