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
import { formatSelectOptions, sharedControls } from '@superset-ui/chart-controls';
import { QueryFormData, t, validateNonEmpty } from '@superset-ui/core';
import { ColumnMeta, SelectControlConfig } from '@superset-ui/chart-controls/lib/types';
import { LabelTypeNames, LabelTypes, LegendPosition } from '../utils';

const groupBy: { name: string; config: SelectControlConfig<ColumnMeta, 'SelectControl'> } = {
  name: 'groupby',
  config: {
    ...sharedControls.groupby,
    validators: [validateNonEmpty],
    multi: false,
  },
};

const metric: { name: string; config: SelectControlConfig<string | Record<string, any>, 'MetricsControl'> } = {
  name: 'metric',
  config: {
    ...sharedControls.metrics,
    validators: [validateNonEmpty],
    multi: false,
  },
};
const showLabels = {
  name: 'show_labels',
  config: {
    type: 'CheckboxControl',
    label: t('Show Labels'),
    renderTrigger: true,
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.is_donut === false,
    default: true,
    description: t('Whether to display the labels. Note that the label only displays when the the 5% threshold.'),
  },
};

const labelType = {
  name: 'label_type',
  config: {
    type: 'SelectControl',
    label: t('Label Type'),
    default: LabelTypes.percent,
    renderTrigger: true,
    visibility: ({ form_data }: { form_data: QueryFormData }) =>
      form_data.is_donut === false && form_data.show_labels === true,
    choices: Object.values(LabelTypes).map(val => [val, LabelTypeNames[val as LabelTypes]]),
    description: t('What should be shown on the label?'),
  },
};

const showLegend = {
  name: 'show_legend',
  config: {
    type: 'CheckboxControl',
    label: t('Show Legend'),
    renderTrigger: true,
    default: true,
    description: t('Whether to display the legend (toggles)'),
  },
};

const legendPosition = {
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
};

const isDonut = {
  name: 'is_donut',
  config: {
    type: 'CheckboxControl',
    label: t('Donut'),
    default: false,
    renderTrigger: true,
    description: t('Do you want a donut or a pie?'),
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
        ['color_scheme', 'label_colors'],
        [isDonut],
        [showLabels, labelType],
        [showLegend, legendPosition],
      ],
    },
  ],
  controlOverrides: {
    row_limit: {
      default: 10,
    },
  },
};
