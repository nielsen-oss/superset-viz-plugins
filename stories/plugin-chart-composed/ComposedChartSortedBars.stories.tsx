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
import ComposedChart from '../../plugins/plugin-chart-composed/src/components/ComposedChart';
import { BarChartSubType, ChartType, SortingType } from '../../plugins/plugin-chart-composed/src/components/types';
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
  if (args.chartSubType !== BarChartSubType.default && args.chartSubType !== BarChartSubType.stacked) {
    return (
      <>
        {`SubType "${args.chartSubType}" is not applied for Bars Chart, please change "chartSubType" property to:`}
        <li>{BarChartSubType.default}</li>
        <li>{BarChartSubType.stacked}</li>
      </>
    );
  }
  return (
    <ThemeProvider theme={supersetTheme}>
      <div>
        <ComposedChart
          {...applyCommonLogic(args)}
          data={
            transformProps(({
              ...barsHorizontalSorted,
              formData: {
                ...barsHorizontalSorted.formData,
                orderByTypeMetric0: SortingType.asc,
              },
              queriesData: args.queriesData,
            } as unknown) as ChartProps).data
          }
          yColumnsMeta={undefined}
          barChart={{
            yColumnSortingType: SortingType.asc,
          }}
          chartType={ChartType.barChart}
          chartSubType={BarChartSubType.stacked}
        />
        <ComposedChart
          {...applyCommonLogic(args)}
          data={
            transformProps(({
              ...barsHorizontalSorted,
              formData: {
                ...barsHorizontalSorted.formData,
                orderByTypeMetric0: SortingType.desc,
              },
              queriesData: args.queriesData,
            } as unknown) as ChartProps).data
          }
          chartType={ChartType.barChart}
          chartSubType={BarChartSubType.stacked}
          barChart={{
            yColumnSortingType: SortingType.desc,
          }}
          yColumnsMeta={undefined}
        />
      </div>
    </ThemeProvider>
  );
};

export const SortedBars = SortedBarsTemplate.bind({});
SortedBars.args = {
  ...transformProps(({ ...barsHorizontalSorted } as unknown) as ChartProps),
  ...commonProps,
  queriesData: barsHorizontalSorted.queriesData,
  chartSubType: BarChartSubType.stacked,
};
