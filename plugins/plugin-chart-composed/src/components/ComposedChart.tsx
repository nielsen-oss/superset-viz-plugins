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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Legend,
  LegendType,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getNumberFormatter, styled } from '@superset-ui/core';
import ComposedChartTooltip from './ComposedChartTooltip';
import { LabelColors, ResultData } from '../plugin/utils';
import {
  CHART_SUB_TYPES,
  CHART_TYPES,
  getCartesianGridProps,
  getLegendProps,
  getMaxLengthOfDataKey,
  getMaxLengthOfMetric,
  getXAxisProps,
  getYAxisProps,
  Layout,
  LegendPosition,
  MIN_SYMBOL_WIDTH_FOR_TICK_LABEL,
  renderChartElement,
} from './utils';

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
};

export type ComposedChartProps = {
  height: number;
  width: number;
  showTotals: boolean;
  showLegend: boolean;
  legendPosition: LegendPosition;
  data: ResultData[];
  layout: Layout;
  metrics: string[];
  breakdowns: string[];
  colorScheme: string;
  useY2Axis?: boolean;
  chartSubType: keyof typeof CHART_SUB_TYPES;
  isAnimationActive?: boolean;
  chartType: keyof typeof CHART_TYPES;
  xAxis: XAxisProps;
  yAxis: YAxisProps;
  labelsColor: LabelColors;
  numbersFormat: string;
  chartTypeMetrics: (keyof typeof CHART_TYPES)[];
  chartSubTypeMetrics: (keyof typeof CHART_SUB_TYPES)[];
  useCustomTypeMetrics: boolean[];
};

const Styles = styled.div<ComposedChartStylesProps>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  overflow: auto;

  & .recharts-legend-item {
    cursor: pointer;
    white-space: nowrap;
  }
`;

export default function ComposedChart(props: ComposedChartProps) {
  const {
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
    useY2Axis,
    numbersFormat,
    chartTypeMetrics,
    chartSubTypeMetrics,
    showLegend,
    showTotals,
    legendPosition,
    useCustomTypeMetrics,
  } = props;

  const [disabledDataKeys, setDisabledDataKeys] = useState<string[]>([]);
  const [legendWidth, setLegendWidth] = useState<number>(0);
  const [updater, setUpdater] = useState<number>(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const isSideLegend =
    showLegend && (legendPosition === LegendPosition.right || legendPosition === LegendPosition.left);

  useEffect(() => {
    if (rootRef.current && !legendWidth) {
      const legend = rootRef.current.querySelector('.recharts-legend-wrapper');
      const currentWidth = legend?.getBoundingClientRect()?.width || 0;
      if (currentWidth !== legendWidth) {
        setLegendWidth(currentWidth ? currentWidth + 20 : currentWidth);
      }
    }
  }, [legendWidth, updater]);

  useEffect(() => {
    if (isSideLegend) {
      setLegendWidth(0);
    }
  }, [isSideLegend, props]);

  const forceUpdate = useCallback(() => setUpdater(Math.random()), []);

  useEffect(() => {
    forceUpdate();
  }, [forceUpdate, props]);

  const currentData = data.map(item => {
    const newItem = { ...item };
    disabledDataKeys.forEach(dataKey => delete newItem[dataKey]);
    return newItem;
  });

  const dataKeyLength = getMaxLengthOfDataKey(currentData) * MIN_SYMBOL_WIDTH_FOR_TICK_LABEL;

  const metricLength =
    getMaxLengthOfMetric(currentData, metrics, getNumberFormatter(numbersFormat)) * MIN_SYMBOL_WIDTH_FOR_TICK_LABEL;

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
  return (
    <Styles key={updater} height={height} width={width} legendPosition={legendPosition} ref={rootRef}>
      <RechartsComposedChart
        key={updater}
        width={width}
        height={height}
        layout={layout}
        margin={{ left: 10, right: 10 }}
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
            )}
            iconType="circle"
            iconSize={10}
          />
        )}
        <CartesianGrid {...getCartesianGridProps({ layout })} />
        <XAxis
          {...getXAxisProps({
            dataKeyLength,
            metricLength,
            numbersFormat,
            layout,
            angle: xAxis.tickLabelAngle,
            label: xAxis.label,
          })}
        />
        <YAxis
          {...getYAxisProps({
            dataKeyLength,
            metricLength,
            numbersFormat,
            layout,
            angle: yAxis.tickLabelAngle,
            label: yAxis.label,
          })}
        />
        {useY2Axis && (
          <YAxis
            {...getYAxisProps({
              dataKeyLength,
              metricLength,
              numbersFormat,
              layout,
              isSecondAxis: true,
              dataKey: metrics[metrics.length - 1],
              angle: yAxis.tickLabelAngle2,
              label: yAxis.label2,
            })}
          />
        )}
        <Tooltip content={<ComposedChartTooltip numbersFormat={numbersFormat} metrics={metrics} />} />
        {((isSideLegend && legendWidth) || !isSideLegend) &&
          breakdowns.map((breakdown, index) =>
            renderChartElement({
              chartType,
              metrics,
              showTotals,
              breakdown,
              numbersFormat,
              useY2Axis,
              labelsColor,
              isAnimationActive,
              updater,
              index,
              chartSubType,
              currentData,
              useCustomTypeMetrics,
              chartTypeMetrics,
              chartSubTypeMetrics,
              colorScheme,
              numberOfRenderedItems: breakdowns.length,
            }),
          )}
      </RechartsComposedChart>
    </Styles>
  );
}
