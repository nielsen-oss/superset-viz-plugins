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
import React, { FC, useCallback, useEffect, useState } from 'react';
import { getNumberFormatter, styled, t } from '@superset-ui/core';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ContentRenderer,
  LabelList,
  LabelProps,
  Legend,
  LegendProps,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import WaterfallTick from './WaterfallTick';
import { getChartStyles, LEGEND, LegendPosition, renderLabel } from './utils';
import WaterfallBar from './WaterfallBar';
import WaterfallTooltip from './WaterfallTooltip';

type WaterfallStylesProps = {
  height: number;
  width: number;
};

export type BarValue = [number, number];

export type WaterfallChartData = {
  [key: string]: string | boolean | number | BarValue;
};

export type WaterfallChartProps = {
  xAxisDataKey?: string;
  dataKey: string;
  legendPosition: LegendPosition;
  error?: string;
  numbersFormat?: string;
  height: number;
  resetFilters?: Function;
  onBarClick?: Function;
  width: number;
  data?: WaterfallChartData[];
};

const Styles = styled.div<WaterfallStylesProps>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
`;

const Error = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  color: ${({ theme }) => theme.colors.warning.dark1};
  background-color: ${({ theme }) => theme.colors.warning.light1};
`;

const Notification = styled.div`
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  color: ${({ theme }) => theme.colors.info.dark1};
  background-color: ${({ theme }) => theme.colors.info.light1};
`;

const WaterfallChart: FC<WaterfallChartProps> = props => {
  const {
    onBarClick = () => {},
    xAxisDataKey,
    dataKey,
    numbersFormat,
    data,
    height,
    width,
    error,
    legendPosition,
  } = props;
  const [notification, setNotification] = useState<string | null>(null);
  const [updater, setUpdater] = useState<number>(0);

  const forceUpdate = useCallback(() => setUpdater(Math.random()), []);
  useEffect(() => {
    forceUpdate();
  }, [forceUpdate, props]);

  const handleBarClick = (barData: WaterfallChartData) => {
    if (window.location.pathname.includes('/explore')) {
      onBarClick(barData);
      setNotification(t('Bar was clicked, filter will be emitted on a dashboard'));
    }
  };
  const closeNotification = () => setNotification(null);
  const formatter = getNumberFormatter(numbersFormat);
  const { chartMargin, legendStyle } = getChartStyles(legendPosition);

  return (
    <Styles height={height} width={width}>
      {notification && <Notification onClick={closeNotification}>{notification}</Notification>}
      {error ? (
        <Error>{error}</Error>
      ) : (
        <div>
          <BarChart width={width} height={height} margin={chartMargin} data={data} barCategoryGap={0} key={updater}>
            <Legend
              wrapperStyle={legendStyle}
              verticalAlign={legendPosition as LegendProps['verticalAlign']}
              iconType="circle"
              iconSize={10}
              payload={LEGEND}
            />
            <CartesianGrid vertical={false} />
            <XAxis dataKey={xAxisDataKey} dy={10} angle={-45} tick={WaterfallTick} interval={0} />
            <YAxis tickFormatter={formatter} />
            <Tooltip content={<WaterfallTooltip formatter={formatter} />} />
            <Bar
              dataKey={dataKey}
              shape={props => <WaterfallBar {...props} numberOfBars={data?.length} />}
              onClick={handleBarClick}
            >
              <LabelList
                dataKey={dataKey}
                position="top"
                content={(renderLabel(formatter) as unknown) as ContentRenderer<LabelProps>}
              />
            </Bar>
          </BarChart>
        </div>
      )}
    </Styles>
  );
};

export default WaterfallChart;
