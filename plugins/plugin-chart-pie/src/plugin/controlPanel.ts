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
import { sharedControls, formatSelectOptions } from '@superset-ui/chart-controls';
import { LegendPosition } from '../utils';
import { QueryFormData, t, validateNonEmpty } from '@superset-ui/core';
import { ColumnMeta, SelectControlConfig } from '@superset-ui/chart-controls/lib/types';

const groupBy: { name: string; config: SelectControlConfig<ColumnMeta, 'SelectControl'> } = {
  name: 'group_by',
  config: {
    ...sharedControls.groupby,
    validators: [validateNonEmpty],
    multi: false,
  },
};

const metric: { name: string; config: SelectControlConfig<string | Record<string, any>, "MetricsControl"> } = {
  name: 'metric',
  config: {
    ...sharedControls.metrics,
    validators: [validateNonEmpty],
    multi: false,
  },
};

export default {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [[groupBy], [metric], ['adhoc_filters'], ['row_limit']],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'pie_label_type',
            config: {
              type: 'SelectControl',
              label: t('Label Type'),
              default: 'percent',
              renderTrigger: true,
              choices: [
                ['key', 'Category Name'],
                ['percent', 'Percentage'],
                ['key_percent', 'Category and Percentage'],
              ],
              description: t('What should be shown on the label?'),
            },
          },
        ],
        [
          {
            name: 'show_legend',
            config: {
              type: 'CheckboxControl',
              label: t('Legend'),
              renderTrigger: true,
              default: true,
              description: t('Whether to display the legend (toggles)'),
            },
          },
          {
            name: 'legend_position',
            config: {
              freeForm: true,
              type: 'SelectControl',
              clearable: false,
              label: t('Legend position'),
              renderTrigger: true,
              choices: formatSelectOptions(Object.keys(LegendPosition)),
              default: 'top',
              description: t('Set legend position'),
              visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.show_legend,
            },
          },
        ],
        [
          {
            name: 'is_donut',
            config: {
              type: 'CheckboxControl',
              label: t('Donut'),
              default: false,
              renderTrigger: true,
              description: t('Do you want a donut or a pie?'),
            },
          },
          {
            name: 'show_labels',
            config: {
              type: 'CheckboxControl',
              label: t('Show Labels'),
              renderTrigger: true,
              visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.is_donut === false,
              default: true,
              description: t(
                'Whether to display the labels. Note that the label only displays when the the 5% threshold.',
              ),
            },
          },
        ],
        ['color_scheme', 'label_colors'],
      ],
    },
  ],
  controlOverrides: {
    row_limit: {
      default: 10,
    },
  },
};
