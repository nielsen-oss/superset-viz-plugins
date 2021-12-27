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
import React from 'react';
import { ChartProps, supersetTheme, ThemeProvider } from '@superset-ui/core';
import { BarChartSubType, ChartType } from '@superset-viz-plugins/plugin-chart-composed/src/components/types';
import ComposedChart from '../../plugins/plugin-chart-composed/src/components/ComposedChart';
import transformProps from '../../plugins/plugin-chart-composed/src/plugin/transformProps';
import { metricsAndBreakdownStickyBars } from '../../plugins/plugin-chart-composed/test/__mocks__/composedProps';
import { applyCommonLogic, commonConfig } from './utils';

const commonProps = {
  xAxisTickLabelAngle: '45',
  yAxisTickLabelAngle: '0',
  y2AxisTickLabelAngle: '0',
  useCategoryFormattingGroupBy0: true,
  XAxisLabel: 'X Axis Label',
  yAxisLabel: 'Y Axis Label',
};

export default {
  title: 'Plugins/Composed Chart/Combinations',
  ...commonConfig,
};

const StickyTemplate = args => (
  <ThemeProvider theme={supersetTheme}>
    <div>
      <ComposedChart
        {...applyCommonLogic({
          ...args,
          xAxisLabel: 'Sticky to start',
        })}
        data={
          transformProps(({
            ...metricsAndBreakdownStickyBars,
            formData: {
              ...metricsAndBreakdownStickyBars.formData,
            },
            queriesData: args.queriesData,
          } as unknown) as ChartProps).data
        }
        chartType={ChartType.barChart}
        chartSubType={BarChartSubType.default}
        barChart={{ ...args.barChart, stickyScatters: { 'COUNT_DISTINCT(period)': 'start' } }}
      />
      <ComposedChart
        {...applyCommonLogic({
          ...args,
          xAxisLabel: 'Sticky to center',
        })}
        data={
          transformProps(({
            ...metricsAndBreakdownStickyBars,
            formData: {
              ...metricsAndBreakdownStickyBars.formData,
            },
            queriesData: args.queriesData,
          } as unknown) as ChartProps).data
        }
        chartType={ChartType.barChart}
        chartSubType={BarChartSubType.default}
        barChart={{ ...args.barChart, stickyScatters: { 'COUNT_DISTINCT(period)': 'center' } }}
      />
      <ComposedChart
        {...applyCommonLogic({
          ...args,
          xAxisLabel: 'Sticky to end',
        })}
        data={
          transformProps(({
            ...metricsAndBreakdownStickyBars,
            formData: {
              ...metricsAndBreakdownStickyBars.formData,
            },
            queriesData: args.queriesData,
          } as unknown) as ChartProps).data
        }
        chartType={ChartType.barChart}
        chartSubType={BarChartSubType.default}
        barChart={{ ...args.barChart, stickyScatters: { 'COUNT_DISTINCT(period)': 'end' } }}
      />
    </div>
  </ThemeProvider>
);

export const Sticky = StickyTemplate.bind({});
Sticky.args = {
  ...transformProps(({ ...metricsAndBreakdownStickyBars } as unknown) as ChartProps),
  ...commonProps,
  queriesData: metricsAndBreakdownStickyBars.queriesData,
  chartSubType: BarChartSubType.default,
};
