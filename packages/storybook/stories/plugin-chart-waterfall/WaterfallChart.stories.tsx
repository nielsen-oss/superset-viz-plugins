import React from 'react';
import WaterfallChart from '../../../../plugins/plugin-chart-waterfall/src/components/WaterfallChart';
import transformProps from '../../../../plugins/plugin-chart-waterfall/src/plugin/transformProps';
import { legendTop } from '../../../../plugins/plugin-chart-waterfall/test/__mocks__/waterfallProps';
import {
  D3_FORMAT_OPTIONS,
} from '@superset-ui/chart-controls';

export default {
  title: 'Plugins/Waterfall Chart',
  component: WaterfallChart,
  argTypes: {
    xAxisDataKey: { table: { disable: true } },
    dataKey: { table: { disable: true } },
    error: { table: { disable: true } },
    onBarClick: { table: { disable: true } },
    resetFilters: { table: { disable: true } },
    data: { table: { disable: true } },
    numbersFormat: {
      control: {
        type: 'select',
        options: D3_FORMAT_OPTIONS.map(([option]) => option),
      }
    }
  },
};

const Template = (args) => <WaterfallChart
  {...args}
  data={transformProps({ ...legendTop, queriesData: args.queriesData }).data}
/>;

export const Default = Template.bind({});
Default.args = {
  ...transformProps(legendTop),
  queriesData: legendTop.queriesData
}
