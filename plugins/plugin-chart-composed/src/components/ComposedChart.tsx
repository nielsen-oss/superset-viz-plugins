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
import React, { useEffect, useState } from 'react';
import styled from '@superset-ui/style';
import {
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  LabelFormatter,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getNumberFormatter } from '@superset-ui/number-format';
import ComposedChartTooltip from './ComposedChartTooltip';
import { ResultData, TLabelColors } from '../plugin/transformProps';
import {
  CHART_SUB_TYPES,
  CHART_TYPES,
  getCartesianGridProps,
  getChartElement,
  getLegendProps,
  getMaxLengthOfDataKey,
  getMaxLengthOfMetric,
  getXAxisProps,
  getYAxisProps,
  Layout,
  LegendPosition,
  MIN_SYMBOL_WIDTH_FOR_TICK_LABEL,
  renderLabel,
} from './utils';

type ComposedChartStylesProps = {
  height: number;
  width: number;
  legendPosition: LegendPosition;
};

type Axis = {
  label: string;
  tickLabelAngle: number;
  label2?: string;
  tickLabelAngle2?: number;
};

export type ComposedChartProps = {
  height: number;
  width: number;
  showLegend: boolean;
  legendPosition: LegendPosition;
  data: ResultData[];
  layout: Layout;
  metrics: string[];
  colorScheme: string;
  useY2Axis?: boolean;
  chartSubType: keyof typeof CHART_SUB_TYPES;
  isAnimationActive?: boolean;
  chartType: keyof typeof CHART_TYPES;
  xAxis: Axis;
  yAxis: Axis;
  labelsColor: TLabelColors;
  numbersFormat: string;
  chartTypeMetrics: (keyof typeof CHART_TYPES)[];
  chartSubTypeMetrics: (keyof typeof CHART_SUB_TYPES)[];
  useCustomTypeMetrics: boolean[];
};

const Styles = styled.div<ComposedChartStylesProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  overflow-y: scroll;

  & .recharts-legend-item {
    white-space: nowrap;
    ${({ legendPosition }) =>
      legendPosition === LegendPosition.left || legendPosition === LegendPosition.right
        ? 'display: block !important;'
        : ''}
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
    isAnimationActive,
    labelsColor,
    useY2Axis,
    numbersFormat,
    chartTypeMetrics,
    chartSubTypeMetrics,
    showLegend,
    legendPosition,
    useCustomTypeMetrics,
  } = props;

  const [exploreCounter, setExploreCounter] = useState<number>(0);
  const dataKeyLength = getMaxLengthOfDataKey(data) * MIN_SYMBOL_WIDTH_FOR_TICK_LABEL;

  const metricLength =
    getMaxLengthOfMetric(data, metrics, getNumberFormatter(numbersFormat)) * MIN_SYMBOL_WIDTH_FOR_TICK_LABEL;

  useEffect(() => {
    // In explore need rerender chart when change `renderTrigger` props
    setExploreCounter(exploreCounter + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    xAxis,
    yAxis,
    labelsColor,
    numbersFormat,
    chartType,
    colorScheme,
    layout,
    chartSubType,
    legendPosition,
    showLegend,
  ]);

  const renderChartElement = (metric: string, index: number) => {
    let customChartType = chartType;
    let customChartSubType = chartSubType;
    if (useCustomTypeMetrics[index]) {
      customChartType = chartTypeMetrics[index];
      customChartSubType = chartSubTypeMetrics[index];
    }
    const { Element, ...elementProps } = getChartElement(
      customChartType,
      customChartSubType,
      metric,
      colorScheme,
      customChartType === CHART_TYPES.BAR_CHART && useCustomTypeMetrics.some(el => el),
    );
    return (
      <Element
        key={`${metric}_${exploreCounter}`}
        isAnimationActive={isAnimationActive}
        label={{
          fill: labelsColor,
          position: 'center',
          formatter: getNumberFormatter(numbersFormat) as LabelFormatter,
          content: renderLabel,
        }}
        yAxisId={useY2Axis && index === metrics.length - 1 ? 'right' : 'left'}
        dataKey={metric}
        {...elementProps}
      />
    );
  };

  return (
    <Styles height={height} width={width} legendPosition={legendPosition}>
      <ResponsiveContainer>
        <RechartsComposedChart
          margin={{
            bottom: 0,
            top: 0,
            right: (showLegend && legendPosition === LegendPosition.right ? width * 0.2 : 20) + (useY2Axis ? 40 : 20),
            left: showLegend && legendPosition === LegendPosition.left ? width * 0.2 : 40,
          }}
          layout={layout}
          data={data}
        >
          {showLegend && <Legend {...getLegendProps(legendPosition, height, width)} iconType="circle" iconSize={10} />}
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
          <Tooltip content={<ComposedChartTooltip />} />
          {metrics.map(renderChartElement)}
        </RechartsComposedChart>
      </ResponsiveContainer>
    </Styles>
  );
}
