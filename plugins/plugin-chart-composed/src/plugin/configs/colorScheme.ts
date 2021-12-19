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
import { getCategoricalSchemeRegistry, QueryFormData, t } from '@superset-ui/core';
import { ControlConfig } from '@superset-ui/chart-controls/lib/types';
import { MAX_FORM_CONTROLS } from '../utils';

const categoricalSchemeRegistry = getCategoricalSchemeRegistry();

type ColorScheme = [
  { name: string; config: ControlConfig<'CheckboxControl'> },
  { name: string; config: ControlConfig<'ColorSchemeControl'> },
];

const colorSchemeByMetric: ColorScheme[] = [];

const getColorSchemeBy = (index: number): ColorScheme => [
  {
    name: `has_color_scheme_metric_${index}`,
    config: {
      renderTrigger: true,
      type: 'CheckboxControl',
      label: t(`Use color scheme for metric ${index + 1}`),
      default: false,
      description: t(`Use color scheme for metric ${index + 1}`),
      visibility: ({ form_data }: { form_data: QueryFormData }) => !!form_data.metrics?.[index],
    },
  },
  {
    name: `color_scheme_by_metric_${index}`,
    config: {
      renderTrigger: true,
      type: 'ColorSchemeControl',
      label: t(`Color scheme for metric ${index + 1}`),
      default: categoricalSchemeRegistry.getDefaultKey(),
      description: t(`Color scheme for metric ${index + 1}`),
      visibility: ({ form_data }: { form_data: QueryFormData }) =>
        !!(form_data[`has_color_scheme_metric_${index}`] && form_data.metrics?.[index]),
      choices: () => categoricalSchemeRegistry.keys().map(s => [s, s]),
      schemes: () => categoricalSchemeRegistry.getMap(),
    },
  },
];

const coloredBreakdowns: { name: string; config: ControlConfig<'AdhocFilterControl'> } = {
  name: 'colored_breakdowns',
  config: {
    type: 'AdhocFilterControl',
    label: t('Colored breakdowns'),
    default: null,
    renderTrigger: true,
    mapStateToProps: state => ({
      sections: ['SIMPLE'],
      operators: ['EQUALS'],
      columns: state.datasource ? state.datasource.columns.filter(c => c.filterable) : [],
      savedMetrics: [],
      datasource: state.datasource,
    }),
  },
};

const getColorSchemeByBreakdown = (i: number): [{ name: string; config: ControlConfig<'ColorSchemeControl'> }] => [
  {
    name: `color_scheme_by_breakdown_${i}`,
    config: {
      renderTrigger: true,
      type: 'ColorSchemeControl',
      label: t(`Color scheme for breakdown value ${i + 1}`),
      default: categoricalSchemeRegistry.getDefaultKey(),
      visibility: ({ form_data }: { form_data: QueryFormData }) => !!form_data.colored_breakdowns?.[i],
      choices: () => categoricalSchemeRegistry.keys().map(s => [s, s]),
      schemes: () => categoricalSchemeRegistry.getMap(),
    },
  },
];

const colorSchemeByBreakdown: (
  | [{ name: string; config: ControlConfig<'ColorSchemeControl'> }]
  | [{ name: string; config: ControlConfig<'AdhocFilterControl'> }]
)[] = [[coloredBreakdowns]];

for (let i = 0; i < MAX_FORM_CONTROLS; i++) {
  colorSchemeByMetric.push(getColorSchemeBy(i));

  colorSchemeByBreakdown.push(getColorSchemeByBreakdown(i));
}

export { colorSchemeByMetric, colorSchemeByBreakdown };
