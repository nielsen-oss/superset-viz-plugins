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
import React, { createRef, useEffect, useState } from 'react';
import styled from '@superset-ui/style';
import {
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart as RechartsComposedChart,
  LabelFormatter,
} from 'recharts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getNumberFormatter } from '@superset-ui/number-format';
import BarChartTooltip from './BarChartTooltip';
import { TLabelColors, ResultData } from '../plugin/transformProps';
import {
  CHART_TYPES,
  Layout,
  getCartesianGridProps,
  getMaxLengthOfDataKey,
  getMaxLengthOfMetric,
  getXAxisProps,
  getYAxisProps,
  MIN_SYMBOL_WIDTH_FOR_TICK_LABEL,
  renderLabel,
  getChartElement,
  CHART_SUB_TYPES,
} from './utils';

type ComposedChartStylesProps = {
  height: number;
  width: number;
};

type Axis = {
  label: string;
  tickLabelAngle: number;
};

export type ComposedChartProps = {
  height: number;
  width: number;
  data: ResultData[];
  layout: Layout;
  metrics: string[];
  colorScheme: string;
  chartSubType: keyof typeof CHART_SUB_TYPES;
  isAnimationActive?: boolean;
  chartType: keyof typeof CHART_TYPES;
  xAxis: Axis;
  yAxis: Axis;
  labelsColor: TLabelColors;
  numbersFormat: string;
};

const Styles = styled.div<ComposedChartStylesProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  overflow-y: scroll;
  h3 {
    /* You can use your props to control CSS! */
    font-size: ${({ theme }) => theme?.typography?.sizes?.xxl};
    font-weight: bold;
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
    numbersFormat,
  } = props;

  const rootElem = createRef<HTMLDivElement>();
  const [exploreCounter, setExploreCounter] = useState<number>(0);
  const dataKeyLength = getMaxLengthOfDataKey(data) * MIN_SYMBOL_WIDTH_FOR_TICK_LABEL;
  const metricLength =
    getMaxLengthOfMetric(data, metrics, getNumberFormatter(numbersFormat)) *
    MIN_SYMBOL_WIDTH_FOR_TICK_LABEL;

  useEffect(() => {
    // In explore need rerender chart when change `renderTrigger` props
    setExploreCounter(exploreCounter + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xAxis, yAxis, labelsColor, numbersFormat, chartType, colorScheme, layout, chartSubType]);

  const renderChartElement = (metric: string) => {
    const { Element, ...elementProps } = getChartElement(
      chartType,
      chartSubType,
      metric,
      colorScheme,
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
        dataKey={metric}
        {...elementProps}
      />
    );
  };

  return (
    <Styles ref={rootElem} height={height} width={width}>
      <RechartsComposedChart
        margin={{
          bottom: 60,
          top: 0,
          right: 0,
          left: 60,
        }}
        layout={layout}
        height={height - 40}
        width={width}
        data={data}
      >
        <Legend verticalAlign="top" height={40} iconType="circle" iconSize={10} />
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
        <Tooltip content={<BarChartTooltip />} />
        {metrics.map(renderChartElement)}
      </RechartsComposedChart>
    </Styles>
  );
}
