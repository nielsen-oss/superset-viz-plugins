import React from 'react';
import StatusChart from '../../plugins/plugin-chart-status/src/StatusChart';
import transformProps from '../../plugins/plugin-chart-status/src/plugin/transformProps';
import {statusesAndObjects} from '../../plugins/plugin-chart-status/test/__mocks__/statusProps';
import {ChartProps, supersetTheme, ThemeProvider} from "@superset-ui/core";

export default {
  title: 'Plugins/Status Chart',
  component: StatusChart,
  argTypes: {
    statusColorsMap: {table: {disable: true}},
    data: {table: {disable: true}},
    statusColor: {
      control: {
        type: 'color'
      }
    },
  },
};

const Template = (args) => {
  const data = transformProps({...statusesAndObjects, queriesData: args.queriesData} as unknown as ChartProps).data
  return <ThemeProvider theme={supersetTheme}>
    <StatusChart
      {...args}
      statusColorsMap={{[data[1]]: args.statusColor}}
      data={data}
    /></ThemeProvider>
};

export const Default = Template.bind({});
Default.args = {
  ...transformProps(statusesAndObjects as unknown as ChartProps),
  queriesData: statusesAndObjects.queriesData
}
