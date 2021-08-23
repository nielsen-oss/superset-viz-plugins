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
import { SortingType } from '../../plugins/plugin-chart-composed/src/plugin/utils';
import ComposedChart from '../../plugins/plugin-chart-composed/src/components/ComposedChart';
import { CHART_SUB_TYPES, CHART_TYPES } from '../../plugins/plugin-chart-composed/src/components/types';
import transformProps from '../../plugins/plugin-chart-composed/src/plugin/transformProps';
import { barsHorizontalSorted } from '../../plugins/plugin-chart-composed/test/__mocks__/composedProps';
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
          {...applyCommonLogic(args)}
          hasOrderedBars
          chartType={CHART_TYPES.BAR_CHART}
          orderByYColumn={SortingType.ASC}
          data={
            transformProps(({
              ...barsHorizontalSorted,
              formData: {
                ...barsHorizontalSorted.formData,
                orderByTypeMetric0: SortingType.ASC,
              },
              queriesData: args.queriesData,
            } as unknown) as ChartProps).data
          }
        />
        <ComposedChart
          {...applyCommonLogic(args)}
          chartType={CHART_TYPES.BAR_CHART}
          hasOrderedBars
          orderByYColumn={SortingType.DESC}
          data={
            transformProps(({
              ...barsHorizontalSorted,
              formData: {
                ...barsHorizontalSorted.formData,
                orderByTypeMetric0: SortingType.DESC,
              },
              queriesData: args.queriesData,
            } as unknown) as ChartProps).data
          }
        />
      </div>
    </ThemeProvider>
  );
};

export const SortedBars = SortedBarsTemplate.bind({});
SortedBars.args = {
  ...transformProps((barsHorizontalSorted as unknown) as ChartProps),
  ...commonProps,
  queriesData: barsHorizontalSorted.queriesData,
  chartSubType: CHART_SUB_TYPES.STACKED,
};
