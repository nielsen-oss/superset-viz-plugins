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
import { CategoricalColorNamespace, getNumberFormatter, styled } from '@superset-ui/core';
import {
  Cell,
  Legend,
  LegendPayload,
  LegendProps,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
  ZAxis,
} from 'recharts';
import { getChartStyles } from './utils';
import BubbleTooltip from './BubbleTooltip';
import { LegendPosition } from './types';

type BubbleStylesProps = {
  height: number;
  width: number;
};

export type BubbleChartData = {
  [key: string]: number | string;
};

export type BubbleChartProps = {
  xAxisLabel: string;
  yAxisLabel: string;
  entity: string;
  series: string;
  xAxisTickLabelAngle: number;
  yAxisLabelAngle: number;
  legendPosition: LegendPosition;
  numbersFormat: string;
  height: number;
  width: number;
  data: BubbleChartData[];
  xAxis: string;
  yAxis: string;
  zAxis: string;
  bubbleSize: number;
  colorScheme: string;
};

const Styles = styled.div<BubbleStylesProps>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  & .recharts-legend-wrapper li {
    cursor: pointer;
  }
`;

const BubbleChart: FC<BubbleChartProps> = props => {
  const {
    numbersFormat,
    data,
    height,
    width,
    legendPosition,
    yAxisLabelAngle,
    xAxisLabel,
    yAxisLabel,
    xAxisTickLabelAngle,
    xAxis,
    yAxis,
    zAxis,
    bubbleSize,
    colorScheme,
    entity,
    series,
  } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const [updater, setUpdater] = useState<number>(0);
  const [disabledItems, setDisabledItems] = useState([] as string[]);

  const forceUpdate = useCallback(() => setUpdater(Math.random()), []);

  useEffect(() => {
    forceUpdate();
  }, [forceUpdate, props]);

  const formatter = getNumberFormatter(numbersFormat);

  const xAxisClientRect = rootRef.current
    ?.querySelector('.xAxis .recharts-cartesian-axis-ticks')
    ?.getBoundingClientRect();
  const xAxisHeight = Math.ceil(xAxisClientRect?.height ?? 1) + 5;

  const yAxisClientRect = rootRef.current?.querySelector('.yAxis .recharts-label')?.getBoundingClientRect();
  const yAxisWidth = Math.ceil(yAxisClientRect?.width ?? 1);

  const { chartMargin, legendStyle } = getChartStyles(legendPosition, yAxisWidth);

  const xAxisProps: XAxisProps = {};
  if (xAxisLabel) {
    xAxisProps.label = {
      position: 'bottom',
      value: xAxisLabel,
    };
  }
  xAxisProps.height = xAxisHeight;

  const yAxisProps: YAxisProps = {};
  if (yAxisLabel) {
    yAxisProps.label = {
      value: yAxisLabel,
      angle: yAxisLabelAngle,
      position: 'left',
    };
  }

  const range = useMemo(() => {
    const values = data.reduce(
      (prev, next) => [...prev, ...Object.values(next).filter(item => !isNaN(item))],
      [] as number[],
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const delta = bubbleSize / max;
    return [min * delta, max * delta];
  }, [bubbleSize, data]);

  const handleClick = (item: { value: string }) => {
    if (disabledItems.includes(item.value)) {
      setDisabledItems(disabledItems.filter(disabledItem => disabledItem !== item.value));
    } else {
      setDisabledItems(disabledItems.concat([item.value]));
    }
  };

  const currentData = useMemo(() => data.filter(item => !disabledItems.includes(item[entity] as string)), [
    data,
    disabledItems,
    entity,
  ]);

  return (
    <Styles height={height} width={width} ref={rootRef}>
      <ScatterChart width={width} height={height} margin={chartMargin} data={currentData} key={updater}>
        <Legend
          onClick={handleClick}
          payload={data.map(item => ({
            value: item[entity],
            type: disabledItems.includes(item[entity] as string) ? 'line' : 'square',
            id: item[entity],
            color: CategoricalColorNamespace.getScale(colorScheme)(item[entity]),
          }))}
          wrapperStyle={legendStyle}
          verticalAlign={legendPosition as LegendProps['verticalAlign']}
          iconType="square"
          iconSize={10}
        />
        <XAxis
          dy={10}
          angle={xAxisTickLabelAngle}
          tickLine={false}
          type="number"
          dataKey={xAxis}
          {...xAxisProps}
          tickFormatter={formatter}
        />
        <YAxis type="number" tickLine={false} dataKey={yAxis} tickFormatter={formatter} {...yAxisProps} />
        <ZAxis dataKey={zAxis} range={range} type="number" />
        <Tooltip
          content={
            <BubbleTooltip
              numbersFormat={numbersFormat}
              entity={entity}
              series={series}
              xAxis={xAxis}
              yAxis={yAxis}
              zAxis={zAxis}
              colorScheme={colorScheme}
            />
          }
        />
        <Scatter data={currentData}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CategoricalColorNamespace.getScale(colorScheme)(entry[entity])} />
          ))}
        </Scatter>
      </ScatterChart>
    </Styles>
  );
};

export default BubbleChart;
