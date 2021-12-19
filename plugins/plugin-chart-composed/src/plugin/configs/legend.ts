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
import { QueryFormData, t } from '@superset-ui/core';
import { ControlConfig } from '@superset-ui/chart-controls/lib/types';
import { formatSelectOptions } from '@superset-ui/chart-controls';
import { MAX_FORM_CONTROLS } from '../utils';
import { LegendPosition } from '../../components/types';

type Legend = { name: string; config: ControlConfig<'CheckboxControl'> }[];

const hideLegendByMetric: Legend[] = [];

const getLegendByMetric = (index: number): Legend => [
  {
    name: `hide_legend_by_metric_${index}`,
    config: {
      renderTrigger: true,
      type: 'CheckboxControl',
      label: t(`Hide legend for metric ${index + 1}`),
      default: false,
      description: t(`Hide legend for metric ${index + 1}`),
      visibility: ({ form_data }: { form_data: QueryFormData }) => !!form_data.metrics?.[index],
    },
  },
];

for (let i = 0; i < MAX_FORM_CONTROLS; i++) {
  hideLegendByMetric.push(getLegendByMetric(i));
}

export const showLegend = {
  name: 'show_legend',
  config: {
    type: 'CheckboxControl',
    label: t('Legend'),
    renderTrigger: true,
    default: true,
    description: t('Whether to display the legend (toggles)'),
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
    choices: formatSelectOptions(Object.keys(LegendPosition)),
    default: 'top',
    description: t('Set legend position'),
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.show_legend,
  },
};

export { hideLegendByMetric };
