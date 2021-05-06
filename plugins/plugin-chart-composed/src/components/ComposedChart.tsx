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
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Legend,
  LegendType,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { styled } from '@superset-ui/core';
import ComposedChartTooltip from './ComposedChartTooltip';
import { LabelColors, ResultData, SortingType } from '../plugin/utils';
import {
  CHART_SUB_TYPES,
  CHART_TYPES,
  debounce,
  getCartesianGridProps,
  getLegendProps,
  getXAxisProps,
  getYAxisProps,
  Layout,
  LegendPosition,
  renderChartElement,
} from './utils';
import { useCurrentData } from './state';

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
};

export type YAxisProps = XAxisProps & {
  label2?: string;
  tickLabelAngle2?: number;
  labelAngle?: number;
  labelAngle2?: number;
};

export type ComposedChartProps = {
  orderByTypeMetric: SortingType;
  height: number;
  width: number;
  hasOrderedBars: boolean;
  showTotals: boolean;
  showLegend: boolean;
  legendPosition: LegendPosition;
  data: ResultData[];
  layout: Layout;
  metrics: string[];
  breakdowns: string[];
  colorScheme: string;
  hasY2Axis?: boolean;
  chartSubType: keyof typeof CHART_SUB_TYPES;
  isAnimationActive?: boolean;
  chartType: keyof typeof CHART_TYPES;
  xAxis: XAxisProps;
  yAxis: YAxisProps;
  labelsColor: LabelColors;
  numbersFormat: string;
  chartTypeMetrics: (keyof typeof CHART_TYPES)[];
  chartSubTypeMetrics: (keyof typeof CHART_SUB_TYPES)[];
  hasCustomTypeMetrics: boolean[];
};

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
    orderByTypeMetric,
    hasOrderedBars,
    data,
    height,
    width,
    layout,
    metrics,
    colorScheme,
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
    legendPosition,
    hasCustomTypeMetrics,
  } = props;

  const [disabledDataKeys, setDisabledDataKeys] = useState<string[]>([]);
  const [legendWidth, setLegendWidth] = useState<number>(0);
  const [updater, setUpdater] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isSideLegend =
    showLegend && (legendPosition === LegendPosition.right || legendPosition === LegendPosition.left);

  useEffect(() => {
    if (rootRef.current && !legendWidth && showLegend) {
      const legend = rootRef?.current?.querySelector('.recharts-legend-wrapper');
      const currentWidth = legend?.getBoundingClientRect()?.width || 0;
      if (currentWidth !== legendWidth) {
        setLegendWidth(currentWidth ? currentWidth + 20 : currentWidth);
      }
    }
  }, [legendWidth, showLegend]);

  useEffect(() => {
    if (isSideLegend) {
      setLegendWidth(0);
    }
  }, [isSideLegend, props]);

  const forceUpdate = useCallback(() => setUpdater(Math.random()), []);

  const xAxisClientRect = rootRef.current
    ?.querySelector('.xAxis .recharts-cartesian-axis-ticks')
    ?.getBoundingClientRect();
  const xAxisHeight = Math.ceil(xAxisClientRect?.height ?? 1);
  const xAxisWidth = Math.ceil(xAxisClientRect?.width ?? 1);

  const yAxisClientRect = rootRef.current
    ?.querySelector('.yAxis .recharts-cartesian-axis-ticks')
    ?.getBoundingClientRect();
  const yAxisHeight = Math.ceil(yAxisClientRect?.height ?? 1);
  const yAxisWidth = Math.ceil(yAxisClientRect?.width ?? 1);

  const y2AxisClientRect = rootRef.current
    ?.querySelectorAll('.yAxis .recharts-cartesian-axis-ticks')[1]
    ?.getBoundingClientRect();
  const y2AxisHeight = Math.ceil(y2AxisClientRect?.height ?? 1);
  const y2AxisWidth = Math.ceil(y2AxisClientRect?.width ?? 1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateVisibility = useCallback(
    debounce(() => {
      forceUpdate();
      setVisible(true);
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
    updateUI();
  }, [props, forceUpdate, updateUI]);

  const currentData = useCurrentData(
    data,
    disabledDataKeys,
    colorScheme,
    hasOrderedBars,
    breakdowns,
    orderByTypeMetric,
    showTotals,
  );

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

  const xMarginLeft =
    xAxis.tickLabelAngle === -45 &&
    layout === Layout.horizontal &&
    showLegend &&
    legendPosition !== LegendPosition.left &&
    !yAxis.label
      ? xAxisHeight / 2 - yAxisWidth - 10
      : 5;
  const yMarginBottom =
    yAxis.tickLabelAngle === -45 && layout === Layout.vertical ? yAxisWidth - xAxisHeight - 10 : xAxisHeight;

  return (
    <Styles key={updater} height={height} width={width} legendPosition={legendPosition} ref={rootRef}>
      <RechartsComposedChart
        key={updater}
        width={width}
        height={height}
        layout={layout}
        style={{ visibility: visible ? 'visible' : 'hidden' }}
        margin={{
          right: layout === Layout.vertical ? 10 : 5,
          left: xMarginLeft > 0 ? xMarginLeft : 5,
          top: 15,
          bottom: showLegend && legendPosition === LegendPosition.bottom ? 0 : yMarginBottom,
        }}
        data={currentData}
      >
        {showLegend && (
          <Legend
            onClick={handleLegendClick}
            {...getLegendProps(
              legendPosition,
              height,
              width,
              legendWidth,
              breakdowns,
              disabledDataKeys,
              colorScheme,
              metrics,
              xAxisHeight,
            )}
            iconType="circle"
            iconSize={10}
          />
        )}
        <CartesianGrid {...getCartesianGridProps({ layout })} />
        <XAxis
          {...getXAxisProps({
            numbersFormat,
            layout,
            currentDataSize: currentData.length,
            tickLabelAngle: xAxis.tickLabelAngle,
            axisHeight: xAxisHeight,
            axisWidth: xAxisWidth,
            xAxisClientRect,
            label: xAxis.label,
          })}
        />
        <YAxis
          {...getYAxisProps({
            rootRef,
            numbersFormat,
            currentDataSize: currentData.length,
            layout,
            tickLabelAngle: yAxis.tickLabelAngle,
            labelAngle: yAxis.labelAngle,
            label: yAxis.label,
            axisHeight: yAxisHeight,
            axisWidth: yAxisWidth,
          })}
        />
        {hasY2Axis && (
          <YAxis
            {...getYAxisProps({
              rootRef,
              numbersFormat,
              layout,
              currentDataSize: currentData.length,
              isSecondAxis: true,
              dataKey: metrics[metrics.length - 1],
              tickLabelAngle: yAxis.tickLabelAngle2,
              label: yAxis.label2,
              labelAngle: yAxis.labelAngle2,
              axisHeight: y2AxisHeight,
              axisWidth: y2AxisWidth,
            })}
          />
        )}
        <Tooltip
          content={
            <ComposedChartTooltip numbersFormat={numbersFormat} metrics={metrics} hasOrderedBars={hasOrderedBars} />
          }
        />
        {((isSideLegend && legendWidth) || !isSideLegend) &&
          breakdowns.map((breakdown, index) =>
            renderChartElement({
              hasOrderedBars,
              chartType,
              metrics,
              showTotals,
              breakdown,
              numbersFormat,
              hasY2Axis,
              labelsColor,
              isAnimationActive: isAnimationActive && visible,
              updater,
              index,
              chartSubType,
              currentData,
              hasCustomTypeMetrics,
              chartTypeMetrics,
              chartSubTypeMetrics,
              colorScheme,
              breakdowns,
              numberOfRenderedItems: breakdowns.length - (hasOrderedBars ? disabledDataKeys.length : 0),
            }),
          )}
      </RechartsComposedChart>
    </Styles>
  );
};
export default ComposedChart;
