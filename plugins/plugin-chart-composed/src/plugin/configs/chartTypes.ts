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
import { CHART_SUB_TYPE_NAMES, CHART_SUB_TYPES, CHART_TYPE_NAMES, CHART_TYPES } from '../utils';

export const chartType = {
  name: 'chart_type',
  config: {
    label: t('Chart type'),
    clearable: false,
    renderTrigger: true,
    type: 'SelectControl',
    options: Object.keys(CHART_TYPES).map(key => ({
      value: key,
      label: CHART_TYPE_NAMES[key],
    })),
    default: CHART_TYPES.BAR_CHART,
    description: t('Set default type of chart for all metrics'),
  },
};
export const barChartSubType = {
  name: 'bar_chart_sub_type',
  config: {
    label: t('Chart subtype'),
    clearable: false,
    renderTrigger: true,
    type: 'SelectControl',
    options: Object.keys(CHART_SUB_TYPE_NAMES[CHART_TYPES.BAR_CHART]).map(key => ({
      value: key,
      label: CHART_SUB_TYPE_NAMES[key],
    })),
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.chart_type === CHART_TYPES.BAR_CHART,
    default: CHART_SUB_TYPES.DEFAULT,
    description: t('Set default subtype of chart for all metrics'),
  },
};

export const lineChartSubType = {
  name: 'line_chart_sub_type',
  config: {
    label: t('Chart subtype'),
    renderTrigger: true,
    clearable: false,
    type: 'SelectControl',
    options: Object.keys(CHART_SUB_TYPE_NAMES[CHART_TYPES.LINE_CHART]).map(key => ({
      value: key,
      label: CHART_SUB_TYPE_NAMES[key],
    })),
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.chart_type === CHART_TYPES.LINE_CHART,
    default: CHART_SUB_TYPES.NATURAL,
    description: t('Set subtype of chart'),
  },
};

export const areaChartSubType = {
  name: 'area_chart_sub_type',
  config: {
    label: t('Chart subtype'),
    clearable: false,
    renderTrigger: true,
    type: 'SelectControl',
    options: Object.keys(CHART_SUB_TYPE_NAMES[CHART_TYPES.AREA_CHART]).map(key => ({
      value: key,
      label: CHART_SUB_TYPE_NAMES[key],
    })),
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.chart_type === CHART_TYPES.AREA_CHART,
    default: CHART_SUB_TYPES.BASIS,
    description: t('Set subtype of chart'),
  },
};

export const scatterChartSubType = {
  name: 'scatter_chart_sub_type',
  config: {
    label: t('Chart subtype'),
    clearable: false,
    renderTrigger: true,
    type: 'SelectControl',
    options: Object.keys(CHART_SUB_TYPE_NAMES[CHART_TYPES.SCATTER_CHART]).map(key => ({
      value: key,
      label: CHART_SUB_TYPE_NAMES[key],
    })),
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.chart_type === CHART_TYPES.SCATTER_CHART,
    default: CHART_SUB_TYPES.CIRCLE,
    description: t('Set subtype of chart'),
  },
};

export const bubbleChartSubType = {
  name: 'bubble_chart_sub_type',
  config: {
    label: t('Chart subtype'),
    clearable: false,
    renderTrigger: true,
    type: 'SelectControl',
    options: Object.keys(CHART_SUB_TYPE_NAMES[CHART_TYPES.BUBBLE_CHART]).map(key => ({
      value: key,
      label: CHART_SUB_TYPE_NAMES[key],
    })),
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.chart_type === CHART_TYPES.BUBBLE_CHART,
    default: CHART_SUB_TYPES.CIRCLE,
    description: t('Set subtype of chart'),
  },
};

export const normChartSubType = {
  name: 'norm_chart_sub_type',
  config: {
    label: t('Chart subtype'),
    clearable: false,
    renderTrigger: true,
    type: 'SelectControl',
    options: Object.keys(CHART_SUB_TYPE_NAMES[CHART_TYPES.NORM_CHART]).map(key => ({
      value: key,
      label: CHART_SUB_TYPE_NAMES[key],
    })),
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.chart_type === CHART_TYPES.NORM_CHART,
    default: CHART_SUB_TYPES.DEFAULT,
    description: t('Set subtype of chart'),
  },
};
