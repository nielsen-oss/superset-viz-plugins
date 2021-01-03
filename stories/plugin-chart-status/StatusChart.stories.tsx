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
import StatusChart from '../../plugins/plugin-chart-status/src/StatusChart';
import transformProps from '../../plugins/plugin-chart-status/src/plugin/transformProps';
import { statusesAndObjects } from '../../plugins/plugin-chart-status/test/__mocks__/statusProps';

export default {
  title: 'Plugins/Status Chart',
  component: StatusChart,
  argTypes: {
    statusColorsMap: { table: { disable: true } },
    data: { table: { disable: true } },
    statusColor: {
      control: {
        type: 'color',
      },
    },
  },
};

const Template = args => {
  const { data } = transformProps(({ ...statusesAndObjects, queriesData: args.queriesData } as unknown) as ChartProps);
  return (
    <ThemeProvider theme={supersetTheme}>
      <StatusChart {...args} statusColorsMap={{ [data[1]]: args.statusColor }} data={data} />
    </ThemeProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...transformProps((statusesAndObjects as unknown) as ChartProps),
  queriesData: statusesAndObjects.queriesData,
};
