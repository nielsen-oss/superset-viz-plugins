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
import { validateNonEmpty, t, QueryFormData } from '@superset-ui/core';
import {
  ControlPanelConfig,
  D3_FORMAT_DOCS,
  D3_FORMAT_OPTIONS,
  formatSelectOptions,
  sharedControls,
} from '@superset-ui/chart-controls';
import { orderBy } from './configs/orderBy';
import { LegendPosition } from '../types';

const xAxisColumn: typeof sharedControls.groupby = {
  type: 'SelectControl',
  label: t('XAxis column'),
  description: t('Choose table column that will be displayed on XAxis in chart, should be chosen also in "Group by"'),
  multi: false,
  valueKey: 'column_name',
  mapStateToProps: ({ datasource }) => ({
    options: datasource?.columns || [],
  }),
  validators: [validateNonEmpty],
};

export const numbersFormat = {
  name: 'numbers_format',
  config: {
    label: t('Numbers Format'),
    description: D3_FORMAT_DOCS,
    type: 'SelectControl',
    clearable: false,
    default: D3_FORMAT_OPTIONS[0][0],
    choices: D3_FORMAT_OPTIONS,
    renderTrigger: true,
  },
};

export const numbersFormatDigits = {
  name: 'numbers_format_digits',
  config: {
    label: t('Numbers Format Digits'),
    type: 'SelectControl',
    clearable: true,
    choices: ['0', '1', '2', '3', '4', '5'],
    renderTrigger: true,
    description: t('Number of digits after point'),
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.numbers_format === 'SMART_NUMBER',
  },
};

const periodColumn: typeof sharedControls.groupby = {
  type: 'SelectControl',
  label: t('Period column'),
  description: t('Choose table column that will split data to periods, should be chosen also in "Group by"'),
  multi: false,
  valueKey: 'column_name',
  mapStateToProps: ({ datasource }) => ({
    options: datasource?.columns || [],
  }),
  validators: [validateNonEmpty],
};

export const xAxisLabel = {
  name: 'x_axis_label',
  config: {
    type: 'TextControl',
    label: t('X Axis label'),
    renderTrigger: true,
    default: '',
    description: t('Show X Axis Label in the chart'),
  },
};

export const yAxisLabel = {
  name: 'y_axis_label',
  config: {
    type: 'TextControl',
    label: t('Y Axis label'),
    renderTrigger: true,
    default: '',
    description: t('Show Y Axis Label in the chart'),
  },
};

export const yAxisLabelAngle = {
  name: 'y_axis_label_angle',
  config: {
    freeForm: true,
    type: 'SelectControl',
    clearable: false,
    label: t('Y axis label angle'),
    renderTrigger: true,
    choices: formatSelectOptions(['0', '90', '270']),
    default: '0',
    description: t('Set Y axis label angle in the chart'),
  },
};

export const xAxisTickLabelAngle = {
  name: 'x_axis_tick_label_angle',
  config: {
    freeForm: true,
    label: t('X axis tick label angle'),
    renderTrigger: true,
    clearable: false,
    type: 'SelectControl',
    choices: formatSelectOptions(['0', '45', '90']),
    default: '45',
    description: t('Set X axis tick label angle in the chart'),
  },
};

export const legendPosition = {
  name: 'legend_position',
  config: {
    freeForm: true,
    type: 'SelectControl',
    clearable: false,
    label: t('Legend position'),
    renderTrigger: true,
    choices: formatSelectOptions(Object.values(LegendPosition)),
    default: 'top',
    description: t('Set legend position'),
  },
};

export const showHorizontalGridLines = {
  name: 'show_horizontal_grid_lines',
  config: {
    type: 'CheckboxControl',
    label: t('Show Grid Lines'),
    renderTrigger: true,
    default: true,
    description: t('Show/Hide grid lines'),
  },
};

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Map Fields'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'x_axis_column',
            config: xAxisColumn,
          },
          {
            name: 'period_column',
            config: periodColumn,
          },
        ],
      ],
    },
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['metric'], ['adhoc_filters'], ['row_limit', null]],
    },
    {
      label: t('Sorting'),
      expanded: true,
      controlSetRows: [...orderBy],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [[numbersFormat, numbersFormatDigits], [legendPosition], [showHorizontalGridLines]],
    },
    {
      label: t('X Axis'),
      expanded: true,
      controlSetRows: [[xAxisLabel], [xAxisTickLabelAngle]],
    },
    {
      label: t('Y Axis'),
      expanded: true,
      controlSetRows: [[yAxisLabel, yAxisLabelAngle]],
    },
  ],

  controlOverrides: {
    series: {
      validators: [validateNonEmpty],
      clearable: false,
    },
    metrics: {
      multi: false,
    },
    row_limit: {
      default: 100,
    },
  },
};

export default config;
