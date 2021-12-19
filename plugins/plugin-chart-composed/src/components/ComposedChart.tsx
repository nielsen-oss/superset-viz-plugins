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
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AxisInterval,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Legend,
  LegendType,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { JsonObject, styled } from '@superset-ui/core';
import ComposedChartTooltip from './ComposedChartTooltip';
import { LabelColors, ResultData, SortingType, Z_SEPARATOR } from '../plugin/utils';
import { debounce, isStackedBar } from './utils';
import { getCartesianGridProps, getLegendProps, getXAxisProps, getYAxisProps, renderChartElement } from './chartUtils';
import { useCurrentData, useZAxisRange } from './state';
import { CHART_SUB_TYPES, CHART_TYPES, ColorSchemeBy, Layout, LegendPosition, NORM_SPACE } from './types';
import ScatterChartTooltip from './ScatterChartTooltip';

type EventData = {
  color: string;
  id: string;
  type: LegendType;
  value: string;
};

type ComposedChartStylesProps = {
  height: number;
  width: number;
  legendPosition: LegendPosition;
};

type XAxisProps = {
  label: string;
  tickLabelAngle: number;
  interval: AxisInterval;
};

export type YAxisProps = {
  label: string;
  tickLabelAngle: number;
  label2?: string;
  tickLabelAngle2?: number;
  labelAngle?: number;
  labelAngle2?: number;
};

export type ComposedChartProps = {
  orderByYColumn: SortingType;
  isTimeSeries: boolean;
  scattersStickToBars: JsonObject;
  /**
   * Height of chart */
  height: number;
  bubbleSize: number;
  width: number;
  hasOrderedBars: boolean;
  showTotals: boolean;
  /**
   * Show legend */
  showLegend: boolean;
  legendPosition: LegendPosition;
  data: ResultData[];
  layout: Layout;
  /**
   * List of metrics */
  hideLegendByMetric: boolean[];
  yColumns: string[];
  breakdowns: string[];
  xColumns: string[];
  minBarWidth: string;
  zDimension?: string;
  hasY2Axis?: boolean;
  chartSubType: keyof typeof CHART_SUB_TYPES;
  isAnimationActive?: boolean;
  chartType: keyof typeof CHART_TYPES;
  xAxis: XAxisProps;
  yAxis: YAxisProps;
  labelsColor: LabelColors;
  colorSchemeBy: ColorSchemeBy;
  numbersFormat: string;
  chartTypeMetrics: (keyof typeof CHART_TYPES)[];
  chartSubTypeMetrics: (keyof typeof CHART_SUB_TYPES)[];
  hasCustomTypeMetrics: boolean[];
};

export type ResetProps = { xAxisTicks?: boolean };

const Styles = styled.div<ComposedChartStylesProps>`
  position: relative;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  overflow: auto;

  & .recharts-cartesian-axis-tick-line {
    display: none;
  }

  & .recharts-legend-item {
    cursor: pointer;
    white-space: nowrap;
  }
`;

const ComposedChart: FC<ComposedChartProps> = props => {
  const {
    orderByYColumn,
    hasOrderedBars,
    data,
    height,
    width,
    layout,
    yColumns,
    chartType,
    xAxis,
    chartSubType,
    yAxis,
    breakdowns,
    isAnimationActive,
    labelsColor,
    hasY2Axis,
    numbersFormat,
    chartTypeMetrics,
    chartSubTypeMetrics,
    showLegend,
    showTotals,
    hideLegendByMetric,
    legendPosition,
    hasCustomTypeMetrics,
    isTimeSeries,
    xColumns,
    minBarWidth,
    bubbleSize,
    zDimension,
    colorSchemeBy,
    scattersStickToBars,
  } = props;

  const [disabledDataKeys, setDisabledDataKeys] = useState<string[]>([]);
  const [updater, setUpdater] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [barsUIPositions, setBarsUIPositions] = useState<JsonObject>({});
  const barsUIPositionsRef = useRef<JsonObject>({});
  const [resetProps, setResetProps] = useState<ResetProps>({});
  const rootRef = useRef<HTMLDivElement>(null);

  const forceUpdate = useCallback(() => setUpdater(Math.random()), []);

  const xAxisClientRect = rootRef.current
    ?.querySelector('.xAxis .recharts-cartesian-axis-ticks')
    ?.getBoundingClientRect();
  const xAxisHeight = Math.ceil(xAxisClientRect?.height || 1);
  const xAxisWidth = Math.ceil(xAxisClientRect?.width || 1);

  const yAxisClientRect = rootRef.current
    ?.querySelector('.yAxis .recharts-cartesian-axis-ticks')
    ?.getBoundingClientRect();
  const yAxisHeight = Math.ceil(yAxisClientRect?.height || 1);
  const yAxisWidth = Math.ceil(yAxisClientRect?.width || 1);

  const y2AxisClientRect = rootRef.current
    ?.querySelectorAll('.yAxis .recharts-cartesian-axis-ticks')[1]
    ?.getBoundingClientRect();
  const y2AxisHeight = Math.ceil(y2AxisClientRect?.height || 1);
  const y2AxisWidth = Math.ceil(y2AxisClientRect?.width || 1);

  const { excludedMetricsForStackedBars, includedMetricsForStackedBars, isMainChartStacked } = useMemo(() => {
    const excludedMetricsForStackedBars = yColumns.filter(
      (metric, i) => hasCustomTypeMetrics[i] && !isStackedBar(chartTypeMetrics[i], chartSubTypeMetrics[i]),
    );
    const includedMetricsForStackedBars = yColumns.filter(
      (metric, i) => hasCustomTypeMetrics[i] && isStackedBar(chartTypeMetrics[i], chartSubTypeMetrics[i]),
    );
    return {
      excludedMetricsForStackedBars,
      includedMetricsForStackedBars,
      isMainChartStacked: isStackedBar(chartType, chartSubType),
    };
  }, [chartSubType, chartSubTypeMetrics, chartType, chartTypeMetrics, hasCustomTypeMetrics, yColumns]);

  const currentData = useCurrentData(
    data,
    disabledDataKeys,
    hasOrderedBars,
    breakdowns,
    orderByYColumn,
    showTotals,
    yColumns,
    excludedMetricsForStackedBars,
    includedMetricsForStackedBars,
    isMainChartStacked,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateVisibility = useCallback(
    debounce(() => {
      forceUpdate();
      setVisible(true);
      setResetProps({});
    }, 5),
    [],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateUI = useCallback(
    debounce(() => {
      forceUpdate();
      updateVisibility();
    }, 1),
    [],
  );

  useEffect(() => {
    setResetProps({ xAxisTicks: true });
    updateUI();
  }, [props, forceUpdate, updateUI, currentData]);

  const handleLegendClick = ({ id }: EventData) => {
    let resultKeys;
    if (disabledDataKeys.includes(id)) {
      resultKeys = disabledDataKeys.filter(item => item !== id);
    } else {
      resultKeys = [...disabledDataKeys];
      resultKeys.push(id);
    }
    setDisabledDataKeys(resultKeys);
  };

  let xMarginLeft =
    xAxis.tickLabelAngle === -45 &&
    layout === Layout.horizontal &&
    showLegend &&
    legendPosition !== LegendPosition.left &&
    !yAxis.label
      ? xAxisHeight / 2 - yAxisWidth + 5
      : 10;

  let yMarginBottom =
    yAxis.tickLabelAngle === -45 && layout === Layout.vertical ? yAxisWidth - xAxisHeight - 10 : xAxisHeight;
  const hasNormChart = [...chartTypeMetrics, chartType].includes(CHART_TYPES.NORM_CHART as keyof typeof CHART_TYPES);

  if (hasNormChart && layout === Layout.horizontal) {
    yMarginBottom += NORM_SPACE * 2;
  }

  if (hasNormChart && layout === Layout.vertical) {
    xMarginLeft += NORM_SPACE * 2;
  }

  let newWidth = width;
  let newHeight = height;
  if (layout === Layout.horizontal) {
    newWidth = minBarWidth ? currentData.length * (Number(minBarWidth) + 4) : width;
    newWidth = width > newWidth ? width : newWidth;
  } else if (layout === Layout.vertical) {
    newHeight = minBarWidth ? currentData.length * (Number(minBarWidth) + 4) : height;
    newHeight = height > newHeight ? height : newHeight;
  }

  const getZAxisRange = useZAxisRange(currentData, bubbleSize);

  let ChartContainer = RechartsComposedChart;
  let tooltipContent = (
    <ComposedChartTooltip
      numbersFormat={numbersFormat}
      yColumns={yColumns}
      hasOrderedBars={hasOrderedBars}
      isTimeSeries={isTimeSeries}
      zDimension={zDimension}
      breakdowns={breakdowns}
      colorSchemeBy={colorSchemeBy}
      hasExcludedBars={!!excludedMetricsForStackedBars.length}
    />
  );
  if (chartType === CHART_TYPES.BUBBLE_CHART && !hasCustomTypeMetrics.some(has => has)) {
    ChartContainer = ScatterChart;
    tooltipContent = (
      <ScatterChartTooltip
        breakdowns={breakdowns}
        numbersFormat={numbersFormat}
        yColumns={yColumns}
        zDimension={zDimension}
        colorSchemeBy={colorSchemeBy}
      />
    );
  }

  return (
    <Styles
      key={updater}
      height={height}
      width={width}
      legendPosition={legendPosition}
      ref={rootRef}
      style={{ overflowX: newWidth === width ? 'hidden' : 'auto', overflowY: newHeight === height ? 'hidden' : 'auto' }}
    >
      <ChartContainer
        key={updater}
        width={newWidth}
        height={newHeight}
        layout={layout}
        style={{ visibility: visible ? 'visible' : 'hidden' }}
        margin={{
          right: layout === Layout.vertical ? 10 : 10,
          left: xMarginLeft > 0 ? xMarginLeft : 10,
          top: 15,
          bottom: (showLegend && legendPosition === LegendPosition.bottom ? 0 : yMarginBottom) + 16,
        }}
        data={currentData}
      >
        {showLegend && (
          <Legend
            onClick={handleLegendClick}
            {...getLegendProps(
              legendPosition,
              height,
              newWidth,
              breakdowns,
              disabledDataKeys,
              yColumns,
              xAxisHeight,
              yAxisWidth,
              hideLegendByMetric,
              colorSchemeBy,
            )}
            iconType="circle"
            iconSize={10}
          />
        )}
        <CartesianGrid {...getCartesianGridProps({ layout, chartType })} />
        <XAxis
          {...getXAxisProps({
            resetProps,
            numbersFormat,
            layout,
            currentData,
            interval: xAxis.interval,
            tickLabelAngle: xAxis.tickLabelAngle,
            axisHeight: xAxisHeight,
            axisWidth: xAxisWidth,
            xAxisClientRect,
            label: xAxis.label,
            isTimeSeries,
            xColumns,
            rootRef,
            chartType,
          })}
        />
        <YAxis
          {...getYAxisProps({
            rootRef,
            numbersFormat,
            currentData,
            layout,
            height: newHeight,
            tickLabelAngle: yAxis.tickLabelAngle,
            labelAngle: yAxis.labelAngle,
            label: yAxis.label,
            axisHeight: yAxisHeight,
            axisWidth: yAxisWidth,
            chartType,
          })}
        />
        {chartType === CHART_TYPES.BUBBLE_CHART &&
          breakdowns.map((breakdown, i) => (
            // eslint-disable-next-line no-underscore-dangle
            <ZAxis type="number" zAxisId={i} range={getZAxisRange(breakdown)} dataKey={`${breakdown}${Z_SEPARATOR}`} />
          ))}
        {hasY2Axis && (
          <YAxis
            {...getYAxisProps({
              rootRef,
              numbersFormat,
              layout,
              currentData,
              height: newHeight,
              isSecondAxis: true,
              dataKey: yColumns[yColumns.length - 1],
              tickLabelAngle: yAxis.tickLabelAngle2,
              label: yAxis.label2,
              labelAngle: yAxis.labelAngle2,
              axisHeight: y2AxisHeight,
              axisWidth: y2AxisWidth,
              chartType,
            })}
          />
        )}
        <Tooltip content={tooltipContent} />
        {breakdowns.map((breakdown, index) =>
          renderChartElement({
            hasOrderedBars,
            chartType,
            layout,
            yColumns,
            showTotals,
            breakdown,
            numbersFormat,
            hasY2Axis,
            labelsColor,
            scattersStickToBars,
            barsUIPositions,
            setBarsUIPositions,
            isAnimationActive: isAnimationActive && visible,
            updater,
            index,
            chartSubType,
            currentData,
            hasCustomTypeMetrics,
            chartTypeMetrics,
            chartSubTypeMetrics,
            breakdowns,
            excludedMetricsForStackedBars,
            includedMetricsForStackedBars,
            isMainChartStacked,
            colorSchemeBy,
            barsUIPositionsRef,
            xAxisClientRect,
            yAxisClientRect,
            xColumns,
            firstItem: data[0]?.rechartsDataKey,
          }),
        )}
      </ChartContainer>
    </Styles>
  );
};
export default ComposedChart;
