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
import PivotTable from '../../plugins/plugin-chart-pivot-table/src/components/PivotTable';
import transformProps from '../../plugins/plugin-chart-pivot-table/src/plugin/transformProps';
import { singleRowCompact, withTotals } from '../../plugins/plugin-chart-pivot-table/test/__mocks__/pivotTableProps';
import { extractTransformProps } from '../utils';

export default {
  title: 'Plugins/Pivot Table',
  component: PivotTable,
  argTypes: {
    data: { table: { disable: true } },
    metrics: { table: { disable: true } },
    rows: { table: { disable: true } },
    columns: { table: { disable: true } },
    numberOfColumns: { table: { disable: true } },
    uiColumnUnits: { table: { disable: true } },
    columnsFillData: { table: { disable: true } },
    columnUnits: { table: { disable: true } },
    rowUnits: { table: { disable: true } },
    numberOfRows: { table: { disable: true } },
    rowsTotal: { table: { disable: true } },
    total: { table: { disable: true } },
    columnsTotal: { table: { disable: true } },
    rowsFillData: { table: { disable: true } },
    uiRowUnits: { table: { disable: true } },
    numbersFormat: {
      control: {
        type: 'select',
        options: D3_FORMAT_OPTIONS.map(([option]) => option),
      },
    },
  },
};

const DefaultTemplate = args => (
  <ThemeProvider theme={supersetTheme}>
    <PivotTable {...extractTransformProps({ args, props: withTotals, transformProps })} />
  </ThemeProvider>
);
const CompactTemplate = args => (
  <ThemeProvider theme={supersetTheme}>
    <PivotTable {...extractTransformProps({ args, props: singleRowCompact, transformProps })} />
  </ThemeProvider>
);

export const Default = DefaultTemplate.bind({});
Default.args = {
  ...withTotals.formData,
  width: withTotals.width,
  height: withTotals.height,
  queriesData: withTotals.queriesData,
};

export const CompactView = CompactTemplate.bind({});
CompactView.args = {
  ...singleRowCompact.formData,
  width: singleRowCompact.width,
  height: singleRowCompact.height,
  compactView: true,
  queriesData: singleRowCompact.queriesData,
};
