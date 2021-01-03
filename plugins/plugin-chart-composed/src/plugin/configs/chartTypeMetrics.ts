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
import { CHART_SUB_TYPE_NAMES, CHART_SUB_TYPES, CHART_TYPE_NAMES, CHART_TYPES } from '../../components/utils';
import { MAX_FORM_CONTROLS } from '../utils';

const chartTypeMetricsInit = [];
for (let i = 0; i < MAX_FORM_CONTROLS; i++) {
  chartTypeMetricsInit.push(i + 1);
}

export const chartTypeMetrics = chartTypeMetricsInit.map((el, index) => {
  const barChartSubTypeMetric = {
    name: `bar_chart_sub_type_metric_${index}`,
    config: {
      label: t(`Chart subtype for metric ${el}`),
      clearable: false,
      renderTrigger: true,
      type: 'SelectControl',
      options: Object.keys(CHART_SUB_TYPE_NAMES[CHART_TYPES.BAR_CHART]).map(key => ({
        value: key,
        label: CHART_SUB_TYPE_NAMES[key],
      })),
      visibility: ({ form_data }: { form_data: QueryFormData }) =>
        !!(
          form_data[`use_custom_type_metric_${index}`] &&
          form_data?.metrics?.[index] &&
          form_data[`chart_type_metric_${index}`] === CHART_TYPES.BAR_CHART
        ),
      default: CHART_SUB_TYPES.DEFAULT,
      description: t(`Set subtype of chart for metric ${el}`),
    },
  };

  const lineChartSubTypeMetric = {
    name: `line_chart_sub_type_metric_${index}`,
    config: {
      label: t(`Chart subtype for metric ${el}`),
      renderTrigger: true,
      clearable: false,
      type: 'SelectControl',
      options: Object.keys(CHART_SUB_TYPE_NAMES[CHART_TYPES.LINE_CHART]).map(key => ({
        value: key,
        label: CHART_SUB_TYPE_NAMES[key],
      })),
      visibility: ({ form_data }: { form_data: QueryFormData }) =>
        !!(
          form_data[`use_custom_type_metric_${index}`] &&
          form_data?.metrics?.[index] &&
          form_data[`chart_type_metric_${index}`] === CHART_TYPES.LINE_CHART
        ),
      default: CHART_SUB_TYPES.BASIS,
      description: t(`Set subtype of chart for metric ${el}`),
    },
  };

  const areaChartSubTypeMetric = {
    name: `area_chart_sub_type_metric_${index}`,
    config: {
      label: t(`Chart subtype for metric ${el}`),
      clearable: false,
      renderTrigger: true,
      type: 'SelectControl',
      options: Object.keys(CHART_SUB_TYPE_NAMES[CHART_TYPES.AREA_CHART]).map(key => ({
        value: key,
        label: CHART_SUB_TYPE_NAMES[key],
      })),
      visibility: ({ form_data }: { form_data: QueryFormData }) =>
        !!(
          form_data[`use_custom_type_metric_${index}`] &&
          form_data[`chart_type_metric_${index}`] === CHART_TYPES.AREA_CHART
        ),
      default: CHART_SUB_TYPES.BASIS,
      description: t(`Set subtype of chart for metric ${el}`),
    },
  };

  const scatterChartSubTypeMetric = {
    name: `scatter_chart_sub_type_metric_${index}`,
    config: {
      label: t(`Chart subtype for metric ${el}`),
      clearable: false,
      renderTrigger: true,
      type: 'SelectControl',
      options: Object.keys(CHART_SUB_TYPE_NAMES[CHART_TYPES.SCATTER_CHART]).map(key => ({
        value: key,
        label: CHART_SUB_TYPE_NAMES[key],
      })),
      visibility: ({ form_data }: { form_data: QueryFormData }) =>
        !!(
          form_data[`use_custom_type_metric_${index}`] &&
          form_data?.metrics?.[index] &&
          form_data[`chart_type_metric_${index}`] === CHART_TYPES.SCATTER_CHART
        ),
      default: CHART_SUB_TYPES.CIRCLE,
      description: t(`Set subtype of chart for metric ${el}`),
    },
  };
  return [
    {
      name: `use_custom_type_metric_${index}`,
      config: {
        type: 'CheckboxControl',
        label: t(`Use custom chart type for metric ${el}`),
        renderTrigger: true,
        default: false,
        description: null,
        visibility: ({ form_data }: { form_data: QueryFormData }) => !!form_data?.metrics?.[index],
      },
    },
    {
      name: `chart_type_metric_${index}`,
      config: {
        label: t(`Chart type for metric ${el}`),
        clearable: false,
        renderTrigger: true,
        type: 'SelectControl',
        options: Object.keys(CHART_TYPES).map(key => ({
          value: key,
          label: CHART_TYPE_NAMES[key],
        })),
        default: CHART_TYPES.BAR_CHART,
        description: t(`Set type of chart for metric ${el}`),
        visibility: ({ form_data }: { form_data: QueryFormData }) =>
          !!(form_data[`use_custom_type_metric_${index}`] && form_data?.metrics?.[index]),
      },
    },
    barChartSubTypeMetric,
    lineChartSubTypeMetric,
    areaChartSubTypeMetric,
    scatterChartSubTypeMetric,
  ];
});
