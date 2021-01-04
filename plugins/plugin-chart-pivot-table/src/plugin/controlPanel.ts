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

import {
  ControlConfig,
  ControlPanelConfig,
  D3_FORMAT_DOCS,
  D3_FORMAT_OPTIONS,
  sharedControls,
} from '@superset-ui/chart-controls';
import { ColumnMeta, SelectControlConfig } from '@superset-ui/chart-controls/lib/types';
import { SHOW_TOTAL_NAMES, ShowTotal } from '../types';

const rows: { name: string; config: SelectControlConfig<ColumnMeta, 'SelectControl'> } = {
  name: 'rows',
  config: {
    ...sharedControls.groupby,
    label: t('Rows'),
    description: t('One or many controls to pivot as rows'),
  },
};

const transpose: { name: string; config: ControlConfig<'CheckboxControl'> } = {
  name: 'transpose',
  config: {
    type: 'CheckboxControl',
    label: t('Transpose'),
    default: false,
    description: t('Swap Rows and Columns'),
  },
};

const compactView: { name: string; config: ControlConfig<'CheckboxControl'> } = {
  name: 'compact_view',
  config: {
    type: 'CheckboxControl',
    label: t('Compact View'),
    renderTrigger: true,
    default: false,
    description: t('If have only one row, hide title of row headers'),
  },
};

const showTotal: { name: string; config: ControlConfig<'SelectControl'> } = {
  name: 'show_total',
  config: {
    type: 'SelectControl',
    label: t('Show Total'),
    default: ShowTotal.noTotal,
    renderTrigger: true,
    description: t('Show total for rows / columns'),
    options: Object.keys(ShowTotal).map(value => ({
      value,
      label: SHOW_TOTAL_NAMES[value as keyof typeof SHOW_TOTAL_NAMES],
    })),
  },
};

const numbersFormat: { name: string; config: ControlConfig<'SelectControl'> } = {
  name: 'numbers_format',
  config: {
    type: 'SelectControl',
    label: t('Numbers format'),
    renderTrigger: true,
    default: D3_FORMAT_OPTIONS[0][0],
    choices: D3_FORMAT_OPTIONS,
    description: D3_FORMAT_DOCS,
  },
};

const emptyValuePlaceholder: { name: string; config: ControlConfig<'TextControl'> } = {
  name: `empty_value_placeholder`,
  config: {
    type: 'TextControl',
    label: t(`Empty value placeholder`),
    renderTrigger: true,
    default: '',
    description: t(`Choose placeholder that will be shown instead empty value`),
  },
};

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['metrics'], [rows], ['columns'], ['adhoc_filters'], ['row_limit', null]],
    },
    {
      label: t('Options'),
      expanded: true,
      controlSetRows: [[transpose]],
    },
    {
      label: t('Table Options'),
      expanded: true,
      controlSetRows: [
        [numbersFormat, showTotal],
        [compactView, emptyValuePlaceholder],
      ],
    },
  ],

  controlOverrides: {
    series: {
      validators: [validateNonEmpty],
      clearable: false,
    },
    row_limit: {
      default: 100,
    },
  },
};

export default config;
