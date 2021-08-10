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

import { supersetTheme, t } from '@superset-ui/core';
import { AxisDomain, LegendPayload } from 'recharts';
import { useMemo } from 'react';
import { BarValue, WaterfallChartData } from './WaterfallChart';

export const MIN_LABEL_MARGIN = 20;
export const MIN_SYMBOL_WIDTH_FOR_TICK_LABEL = 7;

export const LEGEND: LegendPayload[] = [
  { value: t('Increase'), color: supersetTheme.colors.success.base, id: 'increase', type: 'square' },
  { value: t('Decrease'), color: supersetTheme.colors.error.base, id: 'decrease', type: 'square' },
  { value: t('Total'), color: supersetTheme.colors.info.base, id: 'total', type: 'square' },
];

export enum LegendPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export const renderLabel = (
  formatter: Function,
  domain: [AxisDomain, AxisDomain],
  data: WaterfallChartData[],
) => (item: { value: BarValue; index: number }) => {
  let result = `${formatter(item.value?.[1] - item.value?.[0])}`;
  // eslint-disable-next-line no-underscore-dangle
  if (data[item.index].__TOTAL__ !== undefined) {
    result = `${formatter(item.value?.[1] - item.value?.[0] + (domain[0] as number))}`;
  }
  return result;
};

export const BOTTOM_PADDING = 25;

export const getChartStyles = (legendPosition: LegendPosition, yAxisWidth: number) => {
  let legendStyle: object = {
    paddingBottom: 20,
  };
  let chartMargin: object = { bottom: BOTTOM_PADDING, left: yAxisWidth + 10 };
  if (legendPosition === LegendPosition.BOTTOM) {
    legendStyle = {
      paddingTop: BOTTOM_PADDING,
    };
    chartMargin = { left: yAxisWidth + 10, top: 20 };
  }
  return {
    legendStyle,
    chartMargin,
  };
};

export const useDomain = (
  data: WaterfallChartData[],
  dataKey: string,
): { domain: [AxisDomain, AxisDomain]; dataWithDomain: WaterfallChartData[] } =>
  useMemo(() => {
    let domainMin = Number.MAX_VALUE;
    let domainMax = Number.MIN_VALUE;
    data.forEach(item => {
      const dataValue = item[dataKey] as BarValue;
      // eslint-disable-next-line no-underscore-dangle
      if (item.__TOTAL__ === undefined && (dataValue[0] as number) < domainMin) {
        domainMin = dataValue[0];
      }
      if ((dataValue[1] as number) > domainMax) {
        domainMax = dataValue[1];
      }
    });
    const minDomain = Math.floor(domainMin * 0.75);
    return {
      domain: [minDomain, Math.floor(domainMax * 1.1)],
      dataWithDomain: data.map(item => ({
        ...item,
        // eslint-disable-next-line no-underscore-dangle
        [dataKey]: item.__TOTAL__ !== undefined ? [minDomain, (item[dataKey] as BarValue)[1]] : item[dataKey],
      })),
    };
  }, [data, dataKey]);
