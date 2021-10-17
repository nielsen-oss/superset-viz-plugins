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
import { ChartProps, getCategoricalSchemeRegistry, supersetTheme, ThemeProvider } from '@superset-ui/core';
import ComposedChart from '../../plugins/plugin-chart-composed/src/components/ComposedChart';
import { CHART_SUB_TYPES, CHART_TYPES } from '../../plugins/plugin-chart-composed/src/components/types';
import transformProps from '../../plugins/plugin-chart-composed/src/plugin/transformProps';
import { metricsAndBreakdownBars } from '../../plugins/plugin-chart-composed/test/__mocks__/composedProps';
import { applyCommonLogic, commonConfig } from './utils';

const GREY_COLOR_SCHEME = 'GREY_COLOR_SCHEME';
const BLUE_COLOR_SCHEME = 'BLUE_COLOR_SCHEME';
getCategoricalSchemeRegistry().registerValue(GREY_COLOR_SCHEME, {
  id: GREY_COLOR_SCHEME,
  description: 'Grey',
  label: 'Grey',
  colors: ['#888888', '#999999', '#aaaaaa', '#bbbbbb', '#cccccc'],
});

getCategoricalSchemeRegistry().registerValue(BLUE_COLOR_SCHEME, {
  description: 'Blue',
  id: BLUE_COLOR_SCHEME,
  label: 'Blue',
  colors: ['#00c5ff', '#63c5da', '#4499ff', '#0044ff', '#aaaaff', '#00bbff'],
});

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

const SortedBarsTemplate = args => {
  if (args.chartSubType !== CHART_SUB_TYPES.DEFAULT && args.chartSubType !== CHART_SUB_TYPES.STACKED) {
    return (
      <>
        {`SubType "${args.chartSubType}" is not applied for Bars Chart, please change "chartSubType" property to:`}
        <li>{CHART_SUB_TYPES.DEFAULT}</li>
        <li>{CHART_SUB_TYPES.STACKED}</li>
      </>
    );
  }
  return (
    <ThemeProvider theme={supersetTheme}>
      <div>
        <ComposedChart
          {...applyCommonLogic({
            ...args,
            xAxisLabel: 'Original color scheme',
          })}
          chartType={CHART_TYPES.BAR_CHART}
          data={
            transformProps(({
              ...metricsAndBreakdownBars,
              formData: {
                ...metricsAndBreakdownBars.formData,
              },
              queriesData: args.queriesData,
            } as unknown) as ChartProps).data
          }
        />
        <ComposedChart
          {...applyCommonLogic({
            ...args,
            xAxisLabel: 'COUNT_DISTINCT(period) as Grey scheme and COUNT_DISTINCT(group_name) as Blue scheme',
          })}
          chartType={CHART_TYPES.BAR_CHART}
          data={
            transformProps(({
              ...metricsAndBreakdownBars,
              formData: {
                ...metricsAndBreakdownBars.formData,
              },
              queriesData: args.queriesData,
            } as unknown) as ChartProps).data
          }
          colorSchemeBy={{
            metric: {
              'COUNT_DISTINCT(period)': GREY_COLOR_SCHEME,
              'COUNT_DISTINCT(group_name)': BLUE_COLOR_SCHEME,
            },
            breakdown: {},
            __DEFAULT_COLOR_SCHEME__: 'SUPERSET_DEFAULT',
          }}
        />
        <ComposedChart
          {...applyCommonLogic({
            ...args,
            xAxisLabel: 'Standard breakdown as Grey scheme',
          })}
          chartType={CHART_TYPES.BAR_CHART}
          data={
            transformProps(({
              ...metricsAndBreakdownBars,
              formData: {
                ...metricsAndBreakdownBars.formData,
              },
              queriesData: args.queriesData,
            } as unknown) as ChartProps).data
          }
          colorSchemeBy={{
            metric: {},
            breakdown: {
              Standard: GREY_COLOR_SCHEME,
            },
            __DEFAULT_COLOR_SCHEME__: 'SUPERSET_DEFAULT',
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export const ColorSchemes = SortedBarsTemplate.bind({});
ColorSchemes.args = {
  ...transformProps(({ ...metricsAndBreakdownBars } as unknown) as ChartProps),
  ...commonProps,
  queriesData: metricsAndBreakdownBars.queriesData,
  chartSubType: CHART_SUB_TYPES.DEFAULT,
};
