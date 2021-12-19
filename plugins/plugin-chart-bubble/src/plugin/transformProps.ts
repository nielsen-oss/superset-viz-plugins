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
import { ChartProps, DataRecord } from '@superset-ui/core';
import { Metric, SortingType } from '@superset-viz-plugins/plugin-chart-waterfall/src/plugin/utils';
import { LegendPosition } from '@superset-viz-plugins/plugin-chart-waterfall/src/types';

export type QueryData = {
  [key: string]: number | string;
};

type FormData = {
  xAxisColumn: string;
  xAxisLabel: string;
  yAxisLabel: string;
  yAxisLabelAngle: string;
  yAxisLogScale: boolean;
  xAxisTickLabelAngle: string;
  xAxisLogScale: boolean;
  numbersFormat: string;
  colorScheme: string;
  legendPosition: LegendPosition;
  maxNumberOfLegends: string;
  showGridLines: boolean;
  bubbleSize: boolean;
  entity: string;
  series: string;
  xAxis: { label: string } | string;
  yAxis: { label: string } | string;
  zAxis: { label: string } | string;
};

export default function transformProps(chartProps: ChartProps) {
  const { width, height, formData, queriesData } = chartProps;
  const data = queriesData[0].data as QueryData[];

  const {
    xAxisColumn,
    numbersFormat,
    legendPosition,
    maxNumberOfLegends,
    showGridLines,
    bubbleSize,
    xAxisLogScale,
    yAxisLogScale,
    colorScheme,
    entity,
    series,
  } = formData as FormData;

  return {
    xAxisDataKey: xAxisColumn,
    xAxisLabel: formData.xAxisLabel ?? '',
    yAxisLabel: formData.yAxisLabel ?? '',
    xAxisTickLabelAngle: -Number(formData.xAxisTickLabelAngle ?? 45),
    yAxisLabelAngle: -Number(formData.yAxisLabelAngle),
    xAxisLogScale,
    yAxisLogScale,
    width,
    height,
    bubbleSize: bubbleSize ?? 1000,
    legendPosition,
    maxNumberOfLegends,
    showGridLines,
    numbersFormat,
    colorScheme,
    data,
    entity,
    series,
    xAxis: formData.xAxis?.label ?? formData.xAxis,
    yAxis: formData.yAxis?.label ?? formData.yAxis,
    zAxis: formData.zAxis?.label ?? formData.zAxis,
  };
}
