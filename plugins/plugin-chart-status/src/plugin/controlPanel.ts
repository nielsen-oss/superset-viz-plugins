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
import { t, validateNonEmpty } from '@superset-ui/core';
import { ControlPanelConfig, SharedControlConfig, sharedControls } from '@superset-ui/chart-controls';
import { ColumnMeta, SelectControlConfig } from '@superset-ui/chart-controls/lib/types';
import { NUMBER_OF_COLORS } from '../types';

const objectColumn: { name: string; config: SelectControlConfig<ColumnMeta, 'SelectControl'> } = {
  name: 'object_column',
  config: {
    ...sharedControls.groupby,
    label: t('Object Column'),
    description: t('Choose column that will be used to get name for status'),
    validators: [validateNonEmpty],
    multi: false,
  },
};

const objectColumnFilters: {
  name: string;
  config: SelectControlConfig<string | Record<string, any>, 'AdhocFilterControl'>;
} = {
  name: 'object_column_filters',
  config: {
    ...sharedControls.adhoc_filters,
    label: t('Object Column Filters'),
    description: t('Filters for object column'),
  },
};

const statusColumn: { name: string; config: SelectControlConfig<ColumnMeta, 'SelectControl'> } = {
  name: 'status_column',
  config: {
    ...sharedControls.groupby,
    label: t('Status Column'),
    description: t('Choose column that will be used to get status value'),
    validators: [validateNonEmpty],
    multi: false,
  },
};

type StatusOptions = [
  { name: string; config: SharedControlConfig<'TextControl'> },
  { name: string; config: SharedControlConfig<'ColorPickerControl'> },
];

const statusOptions: StatusOptions[] = [];

for (let i = 0; i < NUMBER_OF_COLORS; i++) {
  statusOptions.push([
    {
      name: `status_value_${i}`,
      config: {
        type: 'TextControl',
        label: t(`Status Value ${i + 1}`),
        renderTrigger: true,
        default: '',
        description: t(`Choose status value ${i + 1}`),
      },
    },
    {
      name: `status_value_color_${i}`,
      config: {
        ...sharedControls.color_picker,
        label: t(`Status Color ${i + 1}`),
        description: t(`Choose color for status value ${i + 1}`),
      },
    },
  ]);
}

const statusColumnFilters: {
  name: string;
  config: SelectControlConfig<string | Record<string, any>, 'AdhocFilterControl'>;
} = {
  name: 'status_column_filters',
  config: {
    ...sharedControls.adhoc_filters,
    label: t('Status Column Filters'),
    description: t('Filtes for status column'),
  },
};

const config: ControlPanelConfig = {
  // For control input types, see: superset-frontend/src/explore/components/controls/index.js
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [objectColumn, objectColumnFilters],
        [statusColumn, statusColumnFilters],
        ['row_limit', null],
      ],
    },
    {
      label: t('Status Options'),
      expanded: true,
      controlSetRows: statusOptions,
    },
  ],

  controlOverrides: {
    row_limit: {
      default: 100,
    },
  },
};

export default config;
