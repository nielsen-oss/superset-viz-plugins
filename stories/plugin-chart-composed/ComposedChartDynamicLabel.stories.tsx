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
import { barsHorizontalLegendTop } from '../../plugins/plugin-chart-composed/test/__mocks__/composedProps';
import { applyCommonLogic, commonConfig } from './utils';

const commonProps = {
  xAxisTickLabelAngle: '45',
  yAxisTickLabelAngle: '0',
  y2AxisTickLabelAngle: '0',
  useCategoryFormattingGroupBy0: true,
};

export default {
  title: 'Plugins/Composed Chart/Combinations',
  ...commonConfig,
};

const DynamicLabelTemplate = args => {
  const chartSubType = args.chartSubType ?? BarChartSubType.default;
  if (chartSubType !== BarChartSubType.default && chartSubType !== BarChartSubType.stacked) {
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
      <ComposedChart
        data={
          transformProps(({
            ...barsHorizontalLegendTop,
            formData: {
              ...barsHorizontalLegendTop.formData,
              useCategoryFormattingGroupBy0: args.useCategoryFormattingGroupBy0,
            },
            queriesData: args.queriesData,
          } as unknown) as ChartProps).data
        }
        {...applyCommonLogic(args)}
        chartType={ChartType.barChart}
        chartSubType={chartSubType}
      />
    </ThemeProvider>
  );
};

export const DynamicLabels = DynamicLabelTemplate.bind({});
const tProp = transformProps((barsHorizontalLegendTop as unknown) as ChartProps);
DynamicLabels.args = {
  ...commonProps,
  ...tProp,
  queriesData: barsHorizontalLegendTop.queriesData,
  chartSubType: BarChartSubType.default,
  xAxisLabel: tProp.xAxis.label,
  yAxisLabel: tProp.yAxis.label,
};
