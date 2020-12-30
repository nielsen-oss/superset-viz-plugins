import React from 'react';
import PivotTable from '../../plugins/plugin-chart-pivot-table/src/components/PivotTable';
import transformProps, {ChartProps} from '../../plugins/plugin-chart-pivot-table/src/plugin/transformProps';
import {
  singleRowCompact,
  withTotals
} from '../../plugins/plugin-chart-pivot-table/test/__mocks__/pivotTableProps';
import {D3_FORMAT_OPTIONS,} from '@superset-ui/chart-controls';
import {supersetTheme, ThemeProvider} from '@superset-ui/core';

export default {
  title: 'Plugins/Pivot Table',
  component: PivotTable,
  argTypes: {
    data: {table: {disable: true}},
    metrics: {table: {disable: true}},
    rows: {table: {disable: true}},
    columns: {table: {disable: true}},
    numberOfColumns: {table: {disable: true}},
    uiColumnUnits: {table: {disable: true}},
    columnsFillData: {table: {disable: true}},
    columnUnits: {table: {disable: true}},
    rowUnits: {table: {disable: true}},
    numberOfRows: {table: {disable: true}},
    rowsTotal: {table: {disable: true}},
    total: {table: {disable: true}},
    columnsTotal: {table: {disable: true}},
    rowsFillData: {table: {disable: true}},
    uiRowUnits: {table: {disable: true}},
    numbersFormat: {
      control: {
        type: 'select',
        options: D3_FORMAT_OPTIONS.map(([option]) => option),
      }
    }
  },
};

const DefaultTemplate = (args) =>
  <ThemeProvider theme={supersetTheme}>
    <PivotTable
      {...args}
      data={transformProps({
        ...withTotals,
        formData: {
          ...withTotals.formData,
          numbersFormat: args.numbersFormat
        } as unknown as ChartProps,
        queriesData: args.queriesData
      }).data}
    />
  </ThemeProvider>;

const CompactTemplate = (args) =>
  <ThemeProvider theme={supersetTheme}>
    <PivotTable
      {...args}
      data={transformProps({
        ...singleRowCompact,
        formData: {
          ...singleRowCompact.formData,
          numbersFormat: args.numbersFormat
        },
        queriesData: args.queriesData
      } as unknown as ChartProps).data}
    />
  </ThemeProvider>;

export const Default = DefaultTemplate.bind({});
Default.args = {
  ...transformProps(withTotals as unknown as ChartProps),
  queriesData: withTotals.queriesData
}

export const CompactView = CompactTemplate.bind({});
CompactView.args = {
  ...transformProps(singleRowCompact as unknown as ChartProps),
  compactView: true,
  queriesData: singleRowCompact.queriesData
}
