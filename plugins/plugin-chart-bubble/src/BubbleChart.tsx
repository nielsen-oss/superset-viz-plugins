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
  CartesianGrid,
  Cell,
  Legend,
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
  xAxisLogScale: boolean;
  yAxisLogScale: boolean;
  legendPosition: LegendPosition;
  maxNumberOfLegends: number;
  showGridLines: boolean;
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
    maxNumberOfLegends,
    showGridLines,
    yAxisLabelAngle,
    xAxisLogScale,
    xAxisLabel,
    yAxisLabel,
    xAxisTickLabelAngle,
    yAxisLogScale,
    xAxis,
    yAxis,
    zAxis,
    bubbleSize,
    colorScheme,
    entity,
    series,
  } = props;
  const colorFn = CategoricalColorNamespace.getScale(colorScheme);
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
      offset: 10,
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

  // sort the data with larger bubble to match with legend color. Otherwise, scatter chart sorts the data anyway
  // to display the largest bubble first and legend color will be out of sync
  data.sort((a: BubbleChartData, b: BubbleChartData) => parseFloat(b[zAxis]) - parseFloat(a[zAxis]));

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

  // if log scale is selected in x or y axis, then remove data with 0 for that axis
  let dataForPlot: BubbleChartData[];
  if (xAxisLogScale && yAxisLogScale) {
    dataForPlot = data.filter(item => item[xAxis] && item[yAxis]);
  } else if (xAxisLogScale) {
    dataForPlot = data.filter(item => item[xAxis]);
  } else if (yAxisLogScale) {
    dataForPlot = data.filter(item => item[yAxis]);
  } else {
    dataForPlot = data;
  }

  const currentData = useMemo(() => dataForPlot.filter(item => !disabledItems.includes(item[entity] as string)), [
    dataForPlot,
    disabledItems,
    entity,
  ]);
  const legendIds: any[] = [];
  let legends: any[] = [];
  const groupingField = series || entity;
  // eslint-disable-next-line
  data.map(item =>
    legendIds.includes(item[groupingField])
      ? null
      : legendIds.push(item[groupingField]) &&
        legends.push({
          value: item[groupingField],
          type: disabledItems.includes(item[groupingField] as string) ? 'line' : 'square',
          id: item[groupingField],
          color: colorFn(item[groupingField]),
        }),
  );

  legends = legends.slice(0, maxNumberOfLegends);

  return (
    <Styles height={height} width={width} ref={rootRef}>
      <ScatterChart width={width} height={height} margin={chartMargin} data={currentData} key={updater}>
        <CartesianGrid vertical={showGridLines} horizontal={showGridLines} />
        <Legend
          onClick={handleClick}
          payload={legends}
          wrapperStyle={legendStyle}
          verticalAlign={
            ['left', 'right'].includes(legendPosition) ? 'middle' : (legendPosition as LegendProps['verticalAlign'])
          }
          iconType="square"
          align={['top', 'bottom'].includes(legendPosition) ? 'center' : (legendPosition as LegendProps['align'])}
          layout={['top', 'bottom'].includes(legendPosition) ? 'horizontal' : 'vertical'}
          iconSize={10}
        />
        <XAxis
          dy={5}
          angle={xAxisTickLabelAngle}
          tickLine={false}
          type="number"
          {...(xAxisLogScale && { scale: 'log', domain: ['auto', 'auto'] })}
          dataKey={xAxis}
          {...xAxisProps}
          tickFormatter={formatter}
        />
        <YAxis
          type="number"
          {...(yAxisLogScale && { scale: 'log', domain: ['auto', 'auto'] })}
          tickLine={false}
          dataKey={yAxis}
          tickFormatter={formatter}
          {...yAxisProps}
        />

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
              colorFn={colorFn}
            />
          }
        />
        <Scatter data={currentData}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colorFn(entry[groupingField])} />
          ))}
        </Scatter>
      </ScatterChart>
    </Styles>
  );
};

export default BubbleChart;
