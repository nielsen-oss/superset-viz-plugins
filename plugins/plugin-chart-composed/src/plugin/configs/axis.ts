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
import { t } from '@superset-ui/core';
import { ControlPanelsContainerProps, formatSelectOptions } from '@superset-ui/chart-controls';
import { Layout } from '../../components/utils';

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

export const y2AxisLabel = {
  name: 'y2_axis_label',
  config: {
    type: 'TextControl',
    label: t('Second Y Axis label'),
    renderTrigger: true,
    default: '',
    description: t('Show second Y Axis Label in the chart'),
    visibility: ({ form_data }: ControlPanelsContainerProps) =>
      // @ts-ignore (update in package)
      form_data.use_y2_axis && form_data?.metrics?.length > 1 && form_data.layout === Layout.horizontal,
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

export const yAxisTickLabelAngle = {
  name: 'y_axis_tick_label_angle',
  config: {
    freeForm: true,
    type: 'SelectControl',
    clearable: false,
    label: t('Y axis tick label angle'),
    renderTrigger: true,
    choices: formatSelectOptions(['0', '45', '90']),
    default: '0',
    description: t('Set Y axis tick label angle in the chart'),
  },
};

export const y2AxisTickLabelAngle = {
  name: 'y2_axis_tick_label_angle',
  config: {
    freeForm: true,
    type: 'SelectControl',
    clearable: false,
    label: t('Second Y axis tick label angle'),
    renderTrigger: true,
    choices: formatSelectOptions(['0', '45', '90']),
    default: '0',
    description: t('Set second Y axis tick label angle in the chart'),
    visibility: ({ form_data }: ControlPanelsContainerProps) =>
      // @ts-ignore (update in package)
      form_data.use_y2_axis && form_data?.metrics?.length > 1 && form_data.layout === Layout.horizontal,
  },
};

export const useSecondYAxis = {
  name: 'use_y2_axis',
  config: {
    type: 'CheckboxControl',
    label: t('Use second Y axis'),
    renderTrigger: true,
    default: false,
    description: t('Refers to the last chosen metric'),
    visibility: ({ form_data }: ControlPanelsContainerProps) =>
      // @ts-ignore (update in package)
      form_data?.metrics?.length > 1 && form_data.layout === Layout.horizontal,
  },
};
