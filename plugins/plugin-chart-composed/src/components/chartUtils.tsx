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
import React, { ReactElement, RefObject } from 'react';
import {
  Area,
  AxisInterval,
  Bar,
  Cell,
  LabelFormatter,
  LabelList,
  LabelListProps,
  LabelProps,
  LegendPayload,
  LegendProps,
  Line,
  Scatter,
  XAxisProps,
} from 'recharts';
import { getNumberFormatter, JsonObject } from '@superset-ui/core';
import ComposedChartTick, { ComposedChartTickProps } from './ComposedChartTick';
import {
  BarChartValueMap,
  Layout,
  LegendAlign,
  LegendPosition,
  LegendType,
  LegendVerticalAlign,
  MIN_BAR_SIZE_FOR_LABEL,
  MIN_SYMBOL_WIDTH_FOR_LABEL,
  NumbersFormat,
  ResetProps,
  YAxisProps,
  YColumnsMeta,
  LabelColors,
  ResultData,
  SortingType,
  ChartType,
  ScatterChartSubType,
  StickyScatters,
  LineChartSubType,
  BarChartSubType,
  ChartConfig,
  NormChartSubType,
} from './types';
import {
  checkIsMetricStacked,
  getBreakdownsOnly,
  getMetricByChartType,
  getMetricFromBreakdown,
  Z_SEPARATOR,
  BREAKDOWN_SEPARATOR,
} from './utils';
import ComposedBar from './ComposedBar';
import icons from './icons';
import ComposedNorm from './ComposedNorm';
import { CHART_SUB_TYPES } from '../plugin/utils';

const emptyRender = () => null;

export const getMetricName = (name: string, numberOfMetrics: number, zDimension?: string) => {
  if (name?.startsWith(Z_SEPARATOR)) {
    return zDimension;
  }
  const metric = name?.split(BREAKDOWN_SEPARATOR);
  if (numberOfMetrics === 1 && metric.length > 1) {
    return metric.splice(1).join(', ');
  }
  return metric.join(', ');
};

export const renderLabel = ({
  formatter = value => `${value}`,
  width: labelWidth = 0,
  height: labelHeight = 0,
  currentData,
  breakdown,
  index,
  isMainChartStacked,
  excludedMetricsForStackedBars,
  includedMetricsForStackedBars,
  yColumnSortingType,
  keyIndex,
}: LabelProps & {
  currentData: ResultData[];
  breakdown: string;
  index: number;
  yColumnSortingType?: boolean;
  breakdowns: string[];
  excludedMetricsForStackedBars: string[];
  includedMetricsForStackedBars: string[];
  isMainChartStacked: boolean;
  keyIndex: number;
}) => {
  let formattedValue = `${formatter(currentData[index][breakdown] as number)}`;
  if (
    yColumnSortingType &&
    checkIsMetricStacked(isMainChartStacked, breakdown, excludedMetricsForStackedBars, includedMetricsForStackedBars)
  ) {
    const item = currentData[index];
    // @ts-ignore
    formattedValue = `${formatter(item[item?.orderedBarsDataMap?.[keyIndex]]?.value) ?? ''}`;
  }
  if (
    Math.abs(labelHeight) < MIN_BAR_SIZE_FOR_LABEL ||
    Math.abs(labelWidth) < formattedValue.length * MIN_SYMBOL_WIDTH_FOR_LABEL
  ) {
    return '';
  }
  return formattedValue;
};

export const getLegendProps = (
  legend: LegendType,
  height: number,
  width: number,
  breakdowns: string[],
  disabledDataKeys: string[],
  yColumns: string[],
  xAxisHeight: number,
  yAxisWidth: number,
  yColumnsMeta: YColumnsMeta,
  resultColors: JsonObject,
  chartType: ChartType,
): LegendProps => {
  const resultBreakdowns = breakdowns.filter(breakdown => {
    const metric = getMetricFromBreakdown(breakdown);
    const meta = yColumnsMeta?.[metric];
    return (
      !meta?.hideLegend &&
      !getMetricByChartType(ChartType.normChart as ChartType, yColumns, yColumnsMeta, chartType).includes(metric)
    );
  });
  const payload: LegendPayload[] = resultBreakdowns.map(breakdown => ({
    value: getMetricName(
      breakdown,
      yColumns.length - Object.values(yColumnsMeta ?? {}).filter(({ hideLegend }) => hideLegend).length,
    ),
    id: breakdown,
    type: disabledDataKeys.includes(breakdown) ? 'line' : 'square',
    color: resultColors[breakdown],
  }));

  let result = {
    payload,
    wrapperStyle: {
      maxHeight: height,
    },
    align: 'center' as LegendAlign,
    verticalAlign: 'middle' as LegendVerticalAlign,
  };
  if (legend?.position === LegendPosition.left || legend?.position === LegendPosition.right) {
    result = {
      ...result,
      align: legend?.position as LegendAlign,
    };
  }
  switch (legend?.position) {
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
        verticalAlign: legend?.position as LegendVerticalAlign,
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
        verticalAlign: legend?.position as LegendVerticalAlign,
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
  shape: ReactElement | Function;
  Element: React.ElementType;
  fill?: string;
  opacity?: number;
  stackId?: string | boolean;
  onClick?: Function;
};

type Shape = {
  cx: number;
  cy: number;
  opacity: number;
  fill: string;
};

const ICON_SIZE = 12;

const isCustomIcon = (chartSubType: ScatterChartSubType) =>
  chartSubType === ScatterChartSubType.arrowUp ||
  chartSubType === ScatterChartSubType.arrowDown ||
  chartSubType === ScatterChartSubType.circle;

const ICONS_VERTICAL_MAP = {
  [ScatterChartSubType.arrowUp]: 'arrowRight',
  [ScatterChartSubType.arrowDown]: 'arrowLeft',
};

const BARS_SPACE = 2;

const getCustomScatterIcon = (
  breakdown: string,
  chartSubType: ScatterChartSubType,
  barsUIPositionsRef: RefObject<JsonObject>,
  layout: Layout,
  stickyScatters?: JsonObject,
) => {
  const IconElement =
    // @ts-ignore
    icons[layout === Layout.vertical ? ICONS_VERTICAL_MAP[chartSubType] ?? chartSubType : chartSubType];
  return (props: Shape) => {
    const stickData =
      // @ts-ignore
      barsUIPositionsRef.current[
        // @ts-ignore
        `${props.rechartsDataKey}${BREAKDOWN_SEPARATOR}${getBreakdownsOnly(breakdown).join()}`
      ];

    const params: JsonObject = {
      fill: props.fill,
      opacity: props.opacity,
    };

    if (layout === Layout.horizontal) {
      params.y = props.cy - ICON_SIZE;
      switch (stickData && stickyScatters?.[getMetricFromBreakdown(breakdown)]) {
        case StickyScatters.center: {
          params.x = stickData?.x + stickData.width / 2;
          break;
        }
        case StickyScatters.end: {
          params.x = stickData?.x + stickData.width + BARS_SPACE;
          break;
        }
        case StickyScatters.start: {
          params.x = stickData?.x - BARS_SPACE;
          break;
        }
        default:
          params.x = props.cx;
      }
      params.x -= ICON_SIZE;
    } else {
      params.x = props.cx - ICON_SIZE;
      switch (stickData && stickyScatters?.[getMetricFromBreakdown(breakdown)]) {
        case StickyScatters.center: {
          params.y = stickData?.y + stickData.height / 2;
          break;
        }
        case StickyScatters.end: {
          params.x = stickData?.y + stickData.height + BARS_SPACE;
          break;
        }
        case StickyScatters.start: {
          params.y = stickData?.y - BARS_SPACE;
          break;
        }
        default:
          params.y = props.cy;
      }
      params.y -= ICON_SIZE;
    }

    return props.cx && props.cy ? <IconElement {...params} /> : null;
  };
};

export const getChartElement = (
  breakdown: string,
  chartType: ChartType,
  chartSubType: LineChartSubType | BarChartSubType | ScatterChartSubType | NormChartSubType,
  color: string,
  hasDifferentTypes: boolean,
  index: number,
  barsUIPositionsRef: React.RefObject<JsonObject>,
  layout: Layout,
  yColumns: string[],
  xColumns: string[],
  firstItem: string,
  xAxisClientRect?: ClientRect | undefined,
  yAxisClientRect?: ClientRect | undefined,
  handleChartClick?: ((arg?: JsonObject) => void) | undefined,
  stickyScatters?: JsonObject,
  numbersFormat?: NumbersFormat | undefined,
): ChartsUIItem => {
  let commonProps: Partial<ChartsUIItem> & Pick<ChartsUIItem, 'Element'>;
  switch (chartType) {
    case ChartType.lineChart:
      commonProps = {
        Element: Line,
        strokeWidth: 2,
        stroke: color,
        opacity: 0.8,
        type: (chartSubType as unknown) as BarChartSubType,
        connectNulls: true,
      };
      break;
    case ChartType.areaChart:
      commonProps = {
        Element: Area,
        strokeWidth: 2,
        stroke: color,
        fill: color,
        opacity: 0.8,
        type: (chartSubType as unknown) as LineChartSubType,
      };
      break;
    case ChartType.scatterChart:
      commonProps = {
        Element: Scatter,
        fill: color,
        opacity: 1,
        // @ts-ignore
        shape: isCustomIcon(chartSubType as ScatterChartSubType)
          ? getCustomScatterIcon(
              breakdown,
              chartSubType as ScatterChartSubType,
              barsUIPositionsRef,
              layout,
              stickyScatters,
            )
          : chartSubType,
      };
      break;
    case ChartType.bubbleChart:
      commonProps = {
        Element: Scatter,
        fill: color,
        opacity: 0.8,
        zAxisId: index,
        shape: chartSubType as ScatterChartSubType,
      };
      break;
    case ChartType.normChart:
      commonProps = {
        Element: Scatter,
        opacity: 1,
        zAxisId: index,
        shape: (props: JsonObject) => (
          <ComposedNorm
            layout={layout}
            xAxisClientRect={xAxisClientRect}
            yAxisClientRect={yAxisClientRect}
            xColumns={xColumns}
            yColumns={yColumns}
            breakdown={breakdown}
            numbersFormat={numbersFormat}
            firstItem={firstItem}
            {...props}
          />
        ),
      };
      break;
    case ChartType.barChart:
    default:
      commonProps = {
        onClick: ({ rechartsDataKey }: JsonObject) => {
          if (handleChartClick) {
            handleChartClick({ value: rechartsDataKey });
          }
        },
        Element: Bar,
        opacity: hasDifferentTypes ? 0.6 : 1,
        fill: color,
        stackId: chartSubType === CHART_SUB_TYPES.STACKED ? 'metric' : breakdown,
      };
      if (stickyScatters && Object.keys(stickyScatters).length) {
        commonProps.shape = (
          // @ts-ignore
          <ComposedBar breakdown={breakdown} barsUIPositionsRef={barsUIPositionsRef} />
        );
      }
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
  numbersFormat?: NumbersFormat;
  currentData: ResultData[];
  axisHeight: number;
  axisWidth: number;
  hasTimeSeries?: boolean;
  xColumns?: string[];
  xAxisClientRect?: ClientRect;
  rootRef?: RefObject<HTMLDivElement>;
  chartType?: ChartType;
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
  hasTimeSeries,
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
    dy: axisHeight + 5,
  };

  const params: XAxisProps = {
    angle: tickLabelAngle,
    label: labelProps,
    interval: interval ?? 0,
  };

  const times: JsonObject = {};
  if (hasTimeSeries) {
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
        axisLine: chartType === ChartType.bubbleChart,
        tick: (props: ComposedChartTickProps) => (
          <ComposedChartTick
            {...props}
            textAnchor={textAnchor}
            verticalAnchor={verticalAnchor}
            tickFormatter={getNumberFormatter(numbersFormat?.type)}
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
            hasTimeSeries={hasTimeSeries}
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
    dyLabel = undefined;
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
      : 20;
  const labelWidth = label?.length ? labelPerAngle : 0;

  const params = {
    dx: isSecondAxis && tickLabelAngle === -90 ? axisInverseSign * 5 : 0,
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
        axisLine: chartType === ChartType.bubbleChart,
        tick: (props: ComposedChartTickProps) => (
          <ComposedChartTick
            {...props}
            verticalAnchor={verticalAnchor}
            textAnchor={textAnchor}
            tickFormatter={getNumberFormatter(numbersFormat?.type)}
            {...getActualYAxisSize(axisWidth, 5, axisHeight, tickLabelAngle)}
          />
        ),
      };
  }
};

export const getCartesianGridProps = ({ layout, chartType }: { layout: Layout; chartType: ChartType }) => {
  if (chartType === ChartType.bubbleChart) {
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

export const getValueForBarChart = (obj: BarChartValueMap, key: string) => obj?.[key]?.value;

type ChartElementProps = {
  yColumnSortingType?: SortingType;
  breakdown: string;
  layout: Layout;
  breakdowns: string[];
  y2Axis?: YAxisProps;
  hasTotals?: boolean;
  isAnimationActive?: boolean;
  labelsColor: LabelColors;
  yColumnsMeta: YColumnsMeta;
  numbersFormat?: NumbersFormat;
  updater: number;
  index: number;
  currentData: ResultData[];
  includedMetricsForStackedBars: string[];
  excludedMetricsForStackedBars: string[];
  isMainChartStacked: boolean;
  resultColors: JsonObject;
  stickyScatters?: JsonObject;
  barsUIPositions: JsonObject;
  setBarsUIPositions: Function;
  barsUIPositionsRef: RefObject<JsonObject>;
  xAxisClientRect?: ClientRect;
  yAxisClientRect?: ClientRect;
  xColumns: string[];
  yColumns: string[];
  initYColumns: string[];
  firstItem: string;
  handleChartClick?: (arg?: JsonObject) => void;
} & ChartConfig;

export const renderChartElement = ({
  yColumnSortingType,
  breakdown,
  breakdowns,
  chartType,
  currentData,
  yColumns,
  numbersFormat,
  y2Axis,
  labelsColor,
  stickyScatters,
  isAnimationActive,
  updater,
  index,
  chartSubType,
  yColumnsMeta,
  hasTotals,
  layout,
  excludedMetricsForStackedBars,
  includedMetricsForStackedBars,
  isMainChartStacked,
  resultColors,
  barsUIPositionsRef,
  xColumns,
  firstItem,
  xAxisClientRect,
  yAxisClientRect,
  handleChartClick,
  initYColumns,
}: ChartElementProps) => {
  const metric = getMetricFromBreakdown(breakdown);
  const yColumnMeta = yColumnsMeta?.[metric];
  const customChartType = yColumnMeta?.chartType ?? chartType;
  const customChartSubType = yColumnMeta?.chartSubType ?? chartSubType;
  const { Element, ...elementProps } = getChartElement(
    breakdown,
    customChartType,
    customChartSubType,
    resultColors[breakdown],
    customChartType === ChartType.barChart &&
      Object.entries(yColumnsMeta ?? {}).some(
        ([key, { chartType }]) => chartType !== ChartType.barChart && key !== metric,
      ),
    index,
    barsUIPositionsRef,
    layout,
    yColumns,
    xColumns,
    firstItem,
    xAxisClientRect,
    yAxisClientRect,
    handleChartClick,
    stickyScatters,
    numbersFormat,
  );

  const labelListExtraPropsWithTotal: LabelListProps & { fill: string } = {
    fill: 'black',
    dataKey: 'rechartsTotal',
    position: layout === Layout.horizontal ? 'top' : 'right',
    formatter: getNumberFormatter(numbersFormat?.type) as LabelFormatter,
  };

  const lastNotExcludedBarIndex =
    breakdowns.length -
    1 -
    [...breakdowns]
      .reverse()
      .findIndex(b =>
        checkIsMetricStacked(isMainChartStacked, b, excludedMetricsForStackedBars, includedMetricsForStackedBars),
      );

  if (index !== lastNotExcludedBarIndex) {
    labelListExtraPropsWithTotal.content = emptyRender;
  }
  let dataKey: string | Function = breakdown;
  if (
    yColumnSortingType &&
    checkIsMetricStacked(isMainChartStacked, breakdown, excludedMetricsForStackedBars, includedMetricsForStackedBars)
  ) {
    dataKey = (val: BarChartValueMap) =>
      // @ts-ignore
      getValueForBarChart(val, String(val?.orderedBarsDataMap?.[index])) ?? 0; // Not sure why but it works (about 0);
  }

  if (chartType !== ChartType.bubbleChart) {
    // @ts-ignore
    elementProps.label = {
      fill: labelsColor,
      position: 'center',
      formatter: getNumberFormatter(numbersFormat?.type) as LabelFormatter,
      content: renderLabel,
      keyIndex: index,
      currentData,
      breakdown,
      breakdowns,
      yColumnSortingType,
      isMainChartStacked,
      excludedMetricsForStackedBars,
      includedMetricsForStackedBars,
    };
  }

  return (
    <Element
      key={`${breakdown}${updater}`}
      isAnimationActive={isAnimationActive}
      yAxisId={y2Axis && getMetricFromBreakdown(breakdown) === initYColumns[initYColumns.length - 1] ? 'right' : 'left'}
      dataKey={dataKey}
      {...elementProps}
    >
      {yColumnSortingType &&
        checkIsMetricStacked(
          isMainChartStacked,
          breakdown,
          excludedMetricsForStackedBars,
          includedMetricsForStackedBars,
        ) &&
        currentData.map(entry => {
          const breakdownItem = (entry[entry?.orderedBarsDataMap?.[index]] as JsonObject)?.id;
          return <Cell fill={resultColors[breakdownItem]} />;
        })}
      {hasTotals && <LabelList {...labelListExtraPropsWithTotal} />}
    </Element>
  );
};
