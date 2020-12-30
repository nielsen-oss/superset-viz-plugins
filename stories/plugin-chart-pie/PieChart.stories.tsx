import React from 'react';
import PieChart from '../../plugins/plugin-chart-pie/src/PieChart';
import {LabelTypes} from '../../plugins/plugin-chart-pie/src/utils';
import transformProps from '../../plugins/plugin-chart-pie/src/plugin/transformProps';
import {legendTopPercentage} from '../../plugins/plugin-chart-pie/test/__mocks__/pieProps';
import {ChartProps, supersetTheme, ThemeProvider} from "@superset-ui/core";

export default {
  title: 'Plugins/Pie Chart',
  component: PieChart,
  parameters: {
    chromatic: { delay: 2000 },
  },
  argTypes: {
    data: {table: {disable: true}},
    dataKey: {table: {disable: true}},
    isDonut: {table: {disable: true}},
    baseColor: {table: {disable: true}},
    colorScheme: {table: {disable: true}},
    groupBy: {table: {disable: true}},
    onClick: {table: {disable: true}},
    labelType: {
      control: {
        type: 'select',
        options: Object.values(LabelTypes),
      }
    }
  },
};

const DefaultTemplate = (args) =>
  <ThemeProvider theme={supersetTheme}><PieChart
    {...args}
    data={transformProps({...legendTopPercentage, queriesData: args.queriesData} as unknown as ChartProps).data}
  /></ThemeProvider>;

const DonutTemplate = (args) =>
  <ThemeProvider theme={supersetTheme}><PieChart
    {...args}
    showLabels={transformProps({
      ...legendTopPercentage,
      formData: {
        ...legendTopPercentage.formData,
        isDonut: true
      },
    } as unknown as ChartProps).showLabels}
    data={transformProps({
      ...legendTopPercentage,
      queriesData: args.queriesData
    } as unknown as ChartProps).data}
  /></ThemeProvider>;

export const Default = DefaultTemplate.bind({});
Default.args = {
  ...transformProps(legendTopPercentage as unknown as ChartProps),
  queriesData: legendTopPercentage.queriesData,
}

export const Donut = DonutTemplate.bind({});
Donut.args = {
  ...transformProps({
    ...legendTopPercentage,
    formData: {
      ...legendTopPercentage.formData,
      isDonut: true
    }
  } as unknown as ChartProps),
  queriesData: legendTopPercentage.queriesData,
}
