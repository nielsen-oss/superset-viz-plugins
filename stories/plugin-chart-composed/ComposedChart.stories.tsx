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
import {
  BarChartSubType,
  ChartType,
  LineChartSubType,
  NormChartSubType,
  ScatterChartSubType,
} from '../../plugins/plugin-chart-composed/src/components/types';
import transformProps from '../../plugins/plugin-chart-composed/src/plugin/transformProps';
import {
  allChatsLegendBottomBreakdowns,
  barsHorizontalLegendTop,
  bubbleHorizontalLegendTop,
  normHorizontalLegendTop,
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
        chartSubType={args.chartSubType}
      />
    </ThemeProvider>
  );
};

const NormTemplate = args => {
  const chartSubType = args.chartSubType ?? NormChartSubType.default;
  if (chartSubType !== NormChartSubType.default) {
    return (
      <>
        {`SubType "${args.chartSubType}" is not applied for Norm Chart, please change "chartSubType" property to:`}
        <li>{NormChartSubType.default}</li>
      </>
    );
  }
  return (
    <ThemeProvider theme={supersetTheme}>
      <ComposedChart
        data={
          transformProps(({
            ...normHorizontalLegendTop,
            formData: {
              ...normHorizontalLegendTop.formData,
              useCategoryFormattingGroupBy0: args.useCategoryFormattingGroupBy0,
            },
            queriesData: args.queriesData,
          } as unknown) as ChartProps).data
        }
        {...applyCommonLogic(args)}
        chartType={ChartType.normChart}
        chartSubType={chartSubType}
      />
    </ThemeProvider>
  );
};

const TimeSeriesTemplate = args => {
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
            ...timeSeries,
            formData: {
              ...timeSeries.formData,
              useCategoryFormattingGroupBy0: false,
            },
            queriesData: args.queriesData,
          } as unknown) as ChartProps).data
        }
        {...applyCommonLogic(args)}
        chartType={ChartType.barChart}
        yColumnsMeta={undefined}
        chartSubType={chartSubType}
      />
    </ThemeProvider>
  );
};

const LinesTemplate = args => {
  const chartSubType = args.chartSubType ?? LineChartSubType.basis;
  if (
    chartSubType !== LineChartSubType.basis &&
    chartSubType !== LineChartSubType.linear &&
    chartSubType !== LineChartSubType.natural &&
    chartSubType !== LineChartSubType.monotone &&
    chartSubType !== LineChartSubType.step
  ) {
    return (
      <>
        {`SubType "${args.chartSubType}" is not applied for Lines Chart, please change "chartSubType" property to:`}
        <li>{LineChartSubType.basis}</li>
        <li>{LineChartSubType.linear}</li>
        <li>{LineChartSubType.natural}</li>
        <li>{LineChartSubType.monotone}</li>
        <li>{LineChartSubType.step}</li>
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
        chartType={ChartType.lineChart}
        yColumnsMeta={undefined}
        chartSubType={chartSubType}
      />
    </ThemeProvider>
  );
};

const AreaTemplate = args => {
  const chartSubType = args.chartSubType ?? LineChartSubType.basis;
  if (
    chartSubType !== LineChartSubType.basis &&
    chartSubType !== LineChartSubType.linear &&
    chartSubType !== LineChartSubType.natural &&
    chartSubType !== LineChartSubType.monotone &&
    chartSubType !== LineChartSubType.step
  ) {
    return (
      <>
        {`SubType "${args.chartSubType}" is not applied for Area Chart, please change "chartSubType" property to:`}
        <li>{LineChartSubType.basis}</li>
        <li>{LineChartSubType.linear}</li>
        <li>{LineChartSubType.natural}</li>
        <li>{LineChartSubType.monotone}</li>
        <li>{LineChartSubType.step}</li>
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
        chartType={ChartType.areaChart}
        yColumnsMeta={undefined}
        chartSubType={chartSubType}
      />
    </ThemeProvider>
  );
};

const ScatterTemplate = args => {
  const chartSubType = args.chartSubType ?? ScatterChartSubType.circle;
  if (
    chartSubType !== ScatterChartSubType.circle &&
    chartSubType !== ScatterChartSubType.diamond &&
    chartSubType !== ScatterChartSubType.square &&
    chartSubType !== ScatterChartSubType.arrowDown &&
    chartSubType !== ScatterChartSubType.arrowUp &&
    chartSubType !== ScatterChartSubType.wye
  ) {
    return (
      <>
        {`SubType "${args.chartSubType}" is not applied for Scatter Chart, please change "chartSubType" property to:`}
        <li>{ScatterChartSubType.circle}</li>
        <li>{ScatterChartSubType.diamond}</li>
        <li>{ScatterChartSubType.square}</li>
        <li>{ScatterChartSubType.arrowDown}</li>
        <li>{ScatterChartSubType.arrowUp}</li>
        <li>{ScatterChartSubType.wye}</li>
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
        chartType={ChartType.scatterChart}
        yColumnsMeta={undefined}
        chartSubType={chartSubType}
      />
    </ThemeProvider>
  );
};

const BubbleTemplate = args => {
  const chartSubType = args.chartSubType ?? ScatterChartSubType.circle;
  if (
    chartSubType !== ScatterChartSubType.circle &&
    chartSubType !== ScatterChartSubType.diamond &&
    chartSubType !== ScatterChartSubType.square &&
    chartSubType !== ScatterChartSubType.wye
  ) {
    return (
      <>
        {`SubType "${args.chartSubType}" is not applied for Bubble Chart, please change "chartSubType" property to:`}
        <li>{ScatterChartSubType.circle}</li>
        <li>{ScatterChartSubType.diamond}</li>
        <li>{ScatterChartSubType.square}</li>
        <li>{ScatterChartSubType.wye}</li>
      </>
    );
  }
  return (
    <ThemeProvider theme={supersetTheme}>
      <ComposedChart
        data={
          transformProps(({
            ...bubbleHorizontalLegendTop,
            formData: {
              ...bubbleHorizontalLegendTop.formData,
              useCategoryFormattingGroupBy0: args.useCategoryFormattingGroupBy0,
            },
            queriesData: args.queriesData,
          } as unknown) as ChartProps).data
        }
        {...applyCommonLogic(args)}
        chartType={ChartType.bubbleChart}
        yColumnsMeta={undefined}
        chartSubType={chartSubType}
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
  ...transformProps(({ ...barsHorizontalLegendTop } as unknown) as ChartProps),
  queriesData: barsHorizontalLegendTop.queriesData,
  chartSubType: BarChartSubType.default,
};

export const Norm = NormTemplate.bind({});
Norm.args = {
  ...commonProps,
  ...transformProps(({ ...normHorizontalLegendTop } as unknown) as ChartProps),
  queriesData: normHorizontalLegendTop.queriesData,
  chartSubType: NormChartSubType.default,
};

export const TimeSeries = TimeSeriesTemplate.bind({});
TimeSeries.args = {
  ...commonProps,
  ...transformProps((timeSeries as unknown) as ChartProps),
  queriesData: timeSeries.queriesData,
  chartSubType: BarChartSubType.stacked,
  xAxisTickLabelAngle: '0',
};

export const Lines = LinesTemplate.bind({});
Lines.args = {
  ...commonProps,
  ...transformProps(({ ...barsHorizontalLegendTop } as unknown) as ChartProps),
  queriesData: barsHorizontalLegendTop.queriesData,
  chartSubType: LineChartSubType.basis,
  chartType: ChartType.lineChart,
  xAxisTickLabelAngle: '45',
};

export const Area = AreaTemplate.bind({});
Area.args = {
  ...commonProps,
  ...transformProps(({ ...barsHorizontalLegendTop } as unknown) as ChartProps),
  queriesData: barsHorizontalLegendTop.queriesData,
  chartType: ChartType.areaChart,
  chartSubType: LineChartSubType.basis,
};

export const Scatter = ScatterTemplate.bind({});
Scatter.args = {
  ...commonProps,
  ...transformProps(({ ...barsHorizontalLegendTop } as unknown) as ChartProps),
  queriesData: barsHorizontalLegendTop.queriesData,
  chartType: ChartType.scatterChart,
  chartSubType: ScatterChartSubType.circle,
};

export const Bubble = BubbleTemplate.bind({});
Bubble.args = {
  ...commonProps,
  ...transformProps(({ ...bubbleHorizontalLegendTop } as unknown) as ChartProps),
  queriesData: bubbleHorizontalLegendTop.queriesData,
  chartType: ChartType.bubbleChart,
  chartSubType: ScatterChartSubType.circle,
};

export const AllTypes = AllTypesTemplate.bind({});
AllTypes.args = {
  ...commonProps,
  ...transformProps(({ ...allChatsLegendBottomBreakdowns } as unknown) as ChartProps),
  queriesData: allChatsLegendBottomBreakdowns.queriesData,
};
