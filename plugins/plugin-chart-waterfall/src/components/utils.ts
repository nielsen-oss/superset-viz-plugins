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
import { LegendPayload } from 'recharts';
import { BarValue, WaterfallChartData } from './WaterfallChart';

export const MIN_LABEL_MARGIN = 20;
export const MIN_SYMBOL_WIDTH_FOR_TICK_LABEL = 7;

export const LEGEND: LegendPayload[] = [
  { value: t('Increase'), color: supersetTheme.colors.success.base, id: 'increase', type: 'circle' },
  { value: t('Decrease'), color: supersetTheme.colors.error.base, id: 'decrease', type: 'circle' },
  { value: t('Total'), color: supersetTheme.colors.info.base, id: 'total', type: 'circle' },
];

export enum LegendPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export const renderLabel = (formatter: Function) => ({ value }: { value: BarValue }) =>
  `${formatter(value?.[1] - value?.[0])}`;

export const tooltipFormatter = (formatter: Function) => (value: BarValue) =>
  `${formatter(value?.[0])} - ${formatter(value?.[1])}`;

export const BOTTOM_PADDING = 60;

export const getChartStyles = (legendPosition: LegendPosition) => {
  let legendStyle: object = {
    paddingBottom: 20,
  };
  let chartMargin: object = { bottom: BOTTOM_PADDING, left: 10 };
  if (legendPosition === LegendPosition.BOTTOM) {
    legendStyle = {
      paddingTop: BOTTOM_PADDING,
    };
    chartMargin = { left: 10, top: 20 };
  }
  return {
    legendStyle,
    chartMargin,
  };
};

export const AXIS_OFFSET = 20;
export const getLabelSize = (
  angle: number,
  dataKeyLength: number,
  angleMin: number | number[],
  angleMax: number,
): number => {
  if (!Array.isArray(angleMin)) {
    // eslint-disable-next-line no-param-reassign
    angleMin = [angleMin];
  }
  return angleMin.includes(angle)
    ? MIN_LABEL_MARGIN
    : dataKeyLength + (angle === angleMax ? MIN_SYMBOL_WIDTH_FOR_TICK_LABEL * 6 : 0);
};

export const getMaxLengthOfMetric = (
  data: WaterfallChartData[],
  metrics: string[],
  formatter = (value: any) => `${value}`,
) =>
  Math.max(
    ...data.map(
      item => (formatter(Math.abs(metrics.reduce(total => total + (item.thisPeriod as number), 0))) as string).length,
    ),
  );
