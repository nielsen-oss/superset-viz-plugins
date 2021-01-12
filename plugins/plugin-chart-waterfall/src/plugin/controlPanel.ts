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
import { validateNonEmpty, t } from '@superset-ui/core';
import {
  ControlPanelConfig,
  D3_FORMAT_DOCS,
  D3_FORMAT_OPTIONS,
  formatSelectOptions,
  sharedControls,
} from '@superset-ui/chart-controls';
import { orderBy } from './configs/orderBy';
import { LegendPosition } from '../components/utils';

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

// TODO: Uncomment when dashboard will support ChartsFilter
// const filterConfigs = {
//   type: 'CollectionControl',
//   label: 'Filters',
//   description: t('Choose columns name that will be filtered on bar click'),
//   validators: [],
//   controlName: 'FilterBoxItemControl',
//   mapStateToProps: ({ datasource }) => ({ datasource }),
// };

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
      controlSetRows: [[numbersFormat], [legendPosition]],
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
