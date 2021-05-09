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
import { CHART_SUB_TYPES, CHART_TYPES } from '../../plugins/plugin-chart-composed/src/components/utils';
import transformProps from '../../plugins/plugin-chart-composed/src/plugin/transformProps';
import {
  allChatsLegendBottomBreakdowns,
  barsHorizontalLegendTop,
  timeSeries,
} from '../../plugins/plugin-chart-composed/test/__mocks__/composedProps';
import { applyCommonLogic, commonConfig } from './utils';

export default {
  title: 'Plugins/Composed Chart/Playground',
  ...commonConfig,
};

const commonProps = {
  xAxisTickLabelAngle: '45',
  yAxisTickLabelAngle: '0',
  y2AxisTickLabelAngle: '0',
  useCategoryFormattingGroupBy0: true,
};

const BarsTemplate = args => {
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
      <ComposedChart
        chartType={CHART_TYPES.BAR_CHART}
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
      />
    </ThemeProvider>
  );
};

const TimeSeriesTemplate = args => {
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
      <ComposedChart
        chartType={CHART_TYPES.BAR_CHART}
        data={
          transformProps(({
            ...timeSeries,
            formData: {
              ...timeSeries.formData,
              useCategoryFormattingGroupBy0: false,
            },
            queriesData: args.queriesData,
          } as unknown) as ChartProps).data
        }
        {...applyCommonLogic(args)}
      />
    </ThemeProvider>
  );
};

const LinesTemplate = args => {
  if (
    args.chartSubType !== CHART_SUB_TYPES.BASIS &&
    args.chartSubType !== CHART_SUB_TYPES.LINEAR &&
    args.chartSubType !== CHART_SUB_TYPES.NATURAL &&
    args.chartSubType !== CHART_SUB_TYPES.MONOTONE &&
    args.chartSubType !== CHART_SUB_TYPES.STEP
  ) {
    return (
      <>
        {`SubType "${args.chartSubType}" is not applied for Lines Chart, please change "chartSubType" property to:`}
        <li>{CHART_SUB_TYPES.BASIS}</li>
        <li>{CHART_SUB_TYPES.LINEAR}</li>
        <li>{CHART_SUB_TYPES.NATURAL}</li>
        <li>{CHART_SUB_TYPES.MONOTONE}</li>
        <li>{CHART_SUB_TYPES.STEP}</li>
      </>
    );
  }
  return (
    <ThemeProvider theme={supersetTheme}>
      <ComposedChart
        chartType={CHART_TYPES.LINE_CHART}
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
      />
    </ThemeProvider>
  );
};

const AreaTemplate = args => {
  if (
    args.chartSubType !== CHART_SUB_TYPES.BASIS &&
    args.chartSubType !== CHART_SUB_TYPES.LINEAR &&
    args.chartSubType !== CHART_SUB_TYPES.NATURAL &&
    args.chartSubType !== CHART_SUB_TYPES.MONOTONE &&
    args.chartSubType !== CHART_SUB_TYPES.STEP
  ) {
    return (
      <>
        {`SubType "${args.chartSubType}" is not applied for Area Chart, please change "chartSubType" property to:`}
        <li>{CHART_SUB_TYPES.BASIS}</li>
        <li>{CHART_SUB_TYPES.LINEAR}</li>
        <li>{CHART_SUB_TYPES.NATURAL}</li>
        <li>{CHART_SUB_TYPES.MONOTONE}</li>
        <li>{CHART_SUB_TYPES.STEP}</li>
      </>
    );
  }
  return (
    <ThemeProvider theme={supersetTheme}>
      <ComposedChart
        chartType={CHART_TYPES.AREA_CHART}
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
      />
    </ThemeProvider>
  );
};

const ScatterTemplate = args => {
  if (
    args.chartSubType !== CHART_SUB_TYPES.CIRCLE &&
    args.chartSubType !== CHART_SUB_TYPES.DIAMOND &&
    args.chartSubType !== CHART_SUB_TYPES.SQUARE &&
    args.chartSubType !== CHART_SUB_TYPES.WYE
  ) {
    return (
      <>
        {`SubType "${args.chartSubType}" is not applied for Scatter Chart, please change "chartSubType" property to:`}
        <li>{CHART_SUB_TYPES.CIRCLE}</li>
        <li>{CHART_SUB_TYPES.DIAMOND}</li>
        <li>{CHART_SUB_TYPES.SQUARE}</li>
        <li>{CHART_SUB_TYPES.WYE}</li>
      </>
    );
  }
  return (
    <ThemeProvider theme={supersetTheme}>
      <ComposedChart
        chartType={CHART_TYPES.SCATTER_CHART}
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
      />
    </ThemeProvider>
  );
};

const AllTypesTemplate = args => (
  <ThemeProvider theme={supersetTheme}>
    <ComposedChart
      data={
        transformProps(({
          ...allChatsLegendBottomBreakdowns,
          formData: {
            ...allChatsLegendBottomBreakdowns.formData,
            useCategoryFormattingGroupBy0: args.useCategoryFormattingGroupBy0,
          },
          queriesData: args.queriesData,
        } as unknown) as ChartProps).data
      }
      {...applyCommonLogic(args)}
    />
  </ThemeProvider>
);

export const Bars = BarsTemplate.bind({});
Bars.args = {
  ...commonProps,
  ...transformProps((barsHorizontalLegendTop as unknown) as ChartProps),
  queriesData: barsHorizontalLegendTop.queriesData,
  chartSubType: CHART_SUB_TYPES.DEFAULT,
};

export const TimeSeries = TimeSeriesTemplate.bind({});
TimeSeries.args = {
  ...commonProps,
  ...transformProps((timeSeries as unknown) as ChartProps),
  queriesData: timeSeries.queriesData,
  chartSubType: CHART_SUB_TYPES.STACKED,
  xAxisTickLabelAngle: '0',
};

export const Lines = LinesTemplate.bind({});
Lines.args = {
  ...commonProps,
  ...transformProps((barsHorizontalLegendTop as unknown) as ChartProps),
  queriesData: barsHorizontalLegendTop.queriesData,
  chartSubType: CHART_SUB_TYPES.BASIS,
  chartType: CHART_TYPES.LINE_CHART,
  xAxisTickLabelAngle: '45',
};

export const Area = AreaTemplate.bind({});
Area.args = {
  ...commonProps,
  ...transformProps((barsHorizontalLegendTop as unknown) as ChartProps),
  queriesData: barsHorizontalLegendTop.queriesData,
  chartType: CHART_TYPES.AREA_CHART,
  chartSubType: CHART_SUB_TYPES.BASIS,
};

export const Scatter = ScatterTemplate.bind({});
Scatter.args = {
  ...commonProps,
  ...transformProps((barsHorizontalLegendTop as unknown) as ChartProps),
  queriesData: barsHorizontalLegendTop.queriesData,
  chartType: CHART_TYPES.SCATTER_CHART,
  chartSubType: CHART_SUB_TYPES.CIRCLE,
};

export const AllTypes = AllTypesTemplate.bind({});
AllTypes.args = {
  ...commonProps,
  ...transformProps((allChatsLegendBottomBreakdowns as unknown) as ChartProps),
  queriesData: allChatsLegendBottomBreakdowns.queriesData,
};
