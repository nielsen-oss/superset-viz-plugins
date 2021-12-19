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
import { D3_FORMAT_OPTIONS } from '@superset-ui/chart-controls';
import { supersetTheme, ThemeProvider } from '@superset-ui/core';
import WaterfallChart from '../../plugins/plugin-chart-waterfall/src/components/WaterfallChart';
import transformProps from '../../plugins/plugin-chart-waterfall/src/plugin/transformProps';
import { legendTop } from '../../plugins/plugin-chart-waterfall/test/__mocks__/waterfallProps';
import { extractTransformProps } from '../utils';

export default {
  title: 'Plugins/Waterfall Chart',
  component: WaterfallChart,
  argTypes: {
    xAxisTickLabelAngle: {
      control: {
        type: 'select',
        options: ['0', '45', '90'],
      },
    },
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
      },
    },
  },
};

const Template = args => (
  <ThemeProvider theme={supersetTheme}>
    <WaterfallChart {...extractTransformProps({ args, props: legendTop, transformProps })} />
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  ...legendTop,
  queriesData: legendTop.queriesData,
};
