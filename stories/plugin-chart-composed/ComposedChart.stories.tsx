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
import { D3_FORMAT_OPTIONS } from '@superset-ui/chart-controls';
import ComposedChart from '../../plugins/plugin-chart-composed/src/components/ComposedChart';
import { CHART_SUB_TYPES, CHART_TYPES, Layout } from '../../plugins/plugin-chart-composed/src/components/utils';
import transformProps from '../../plugins/plugin-chart-composed/src/plugin/transformProps';
import {
  allChatsLegendBottomBreakdowns,
  barsHorizontalLegendTop,
} from '../../plugins/plugin-chart-composed/test/__mocks__/composedProps';

const applyCommonLogic = initArgs => {
  const args = { ...initArgs };
  if (args.layout !== Layout.horizontal) {
    args.useY2Axis = false;
  }
  args.xAxis = {
    label: args.xAxisLabel,
    tickLabelAngle: -Number(args.xAxisTickLabelAngle),
  };
  args.yAxis = {
    label: args.yAxisLabel,
    tickLabelAngle: -Number(args.yAxisTickLabelAngle),
    label2: args.y2AxisLabel,
    tickLabelAngle2: -Number(args.y2AxisTickLabelAngle),
  };
  return args;
};

const commonProps = {
  xAxisTickLabelAngle: '45',
  yAxisTickLabelAngle: '0',
  y2AxisTickLabelAngle: '0',
  useCategoryFormattingGroupBy0: true,
};

export default {
  title: 'Plugins/Composed Chart',
  component: ComposedChart,
  parameters: {
    chromatic: { delay: 2000 },
  },
  argTypes: {
    data: { table: { disable: true } },
    metrics: { table: { disable: true } },
    colorScheme: { table: { disable: true } },
    isAnimationActive: { table: { disable: true } },
    useCustomTypeMetrics: { table: { disable: true } },
    chartTypeMetrics: { table: { disable: true } },
    chartSubTypeMetrics: { table: { disable: true } },
    chartType: { table: { disable: true } },
    xAxis: { table: { disable: true } },
    yAxis: { table: { disable: true } },
    useCategoryFormattingGroupBy0: {
      control: {
        type: 'boolean',
      },
    },
    xAxisLabel: {
      table: {
        category: 'X Axis',
      },
      control: {
        type: 'text',
      },
    },
    xAxisTickLabelAngle: {
      table: {
        category: 'X Axis',
      },
      control: {
        type: 'select',
        options: ['0', '45', '90'],
      },
    },
    yAxisLabel: {
      table: {
        category: 'Y Axis',
      },
      control: {
        type: 'text',
      },
    },
    yAxisTickLabelAngle: {
      table: {
        category: 'Y Axis',
      },
      control: {
        type: 'select',
        options: ['0', '45', '90'],
      },
    },
    chartSubType: {
      control: {
        type: 'select',
        options: Object.values(CHART_SUB_TYPES),
      },
    },
    useY2Axis: {
      table: {
        category: 'Y2 Axis',
      },
      control: {
        type: 'boolean',
      },
    },
    y2AxisLabel: {
      table: {
        category: 'Y2 Axis',
      },
      control: {
        type: 'text',
      },
    },
    y2AxisTickLabelAngle: {
      table: {
        category: 'Y2 Axis',
      },
      control: {
        type: 'select',
        options: ['0', '45', '90'],
      },
    },
    numbersFormat: {
      control: {
        type: 'select',
        options: D3_FORMAT_OPTIONS.map(([option]) => option),
      },
    },
  },
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
  applyCommonLogic(args);
  return (
    <ThemeProvider theme={supersetTheme}>
      <ComposedChart
        {...args}
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
  applyCommonLogic(args);
  return (
    <ThemeProvider theme={supersetTheme}>
      <ComposedChart
        {...args}
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
  applyCommonLogic(args);
  return (
    <ThemeProvider theme={supersetTheme}>
      <ComposedChart
        {...args}
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
  applyCommonLogic(args);
  return (
    <ThemeProvider theme={supersetTheme}>
      <ComposedChart
        {...args}
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
      />
    </ThemeProvider>
  );
};

const AllTypesTemplate = args => {
  applyCommonLogic(args);
  return (
    <ThemeProvider theme={supersetTheme}>
      <ComposedChart
        {...args}
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
      />
    </ThemeProvider>
  );
};

export const Bars = BarsTemplate.bind({});
Bars.args = {
  ...transformProps((barsHorizontalLegendTop as unknown) as ChartProps),
  ...commonProps,
  queriesData: barsHorizontalLegendTop.queriesData,
  chartSubType: CHART_SUB_TYPES.DEFAULT,
};

export const Lines = LinesTemplate.bind({});
Lines.args = {
  ...transformProps((barsHorizontalLegendTop as unknown) as ChartProps),
  ...commonProps,
  queriesData: barsHorizontalLegendTop.queriesData,
  chartSubType: CHART_SUB_TYPES.BASIS,
  xAxisTickLabelAngle: '45',
};

export const Area = AreaTemplate.bind({});
Area.args = {
  ...transformProps((barsHorizontalLegendTop as unknown) as ChartProps),
  ...commonProps,
  queriesData: barsHorizontalLegendTop.queriesData,
  chartSubType: CHART_SUB_TYPES.BASIS,
};

export const Scatter = ScatterTemplate.bind({});
Scatter.args = {
  ...transformProps((barsHorizontalLegendTop as unknown) as ChartProps),
  ...commonProps,
  queriesData: barsHorizontalLegendTop.queriesData,
  chartSubType: CHART_SUB_TYPES.CIRCLE,
};

export const AllTypes = AllTypesTemplate.bind({});
AllTypes.args = {
  ...transformProps((allChatsLegendBottomBreakdowns as unknown) as ChartProps),
  ...commonProps,
  queriesData: allChatsLegendBottomBreakdowns.queriesData,
};
