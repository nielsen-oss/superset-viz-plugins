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
import { validateNonEmpty, t, QueryFormData } from '@superset-ui/core';
import {
  ControlPanelConfig,
  formatSelectOptions,
  D3_FORMAT_OPTIONS,
  CustomControlItem,
  DatasourceMeta,
  ControlConfig,
  sharedControls,
} from '@superset-ui/chart-controls';
import { CHART_TYPES, CHART_TYPE_NAMES, LegendPosition, CHART_SUB_TYPES } from '../components/utils';
import {
  useSecondYAxis,
  xAxisLabel,
  xAxisTickLabelAngle,
  y2AxisLabel,
  y2AxisTickLabelAngle,
  yAxisLabel,
  yAxisTickLabelAngle,
} from './configs/axis';
import {
  areaChartSubType,
  barChartSubType,
  chartType,
  lineChartSubType,
  scatterChartSubType,
} from './configs/chartTypes';
import { chartTypeMetrics } from './configs/chartTypeMetrics';
import { orderByGroupBy, orderByMetric } from './configs/orderBy';
import { categoryFormatting } from './configs/categoryFormatting';

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

export const showTotals = {
  name: 'show_totals',
  config: {
    type: 'CheckboxControl',
    label: t('Show Totals'),
    renderTrigger: true,
    default: false,
    description: t('Show total values for stacked bar chart'),
    visibility: ({ form_data }: { form_data: QueryFormData }) =>
      form_data.bar_chart_sub_type === CHART_SUB_TYPES.STACKED,
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

const metrics: { name: string; config: ControlConfig<'MetricsControl'> } = {
  name: 'metrics',
  config: {
    type: 'MetricsControl',
    label: t('Metrics'),
    description: t('One or many metrics to display'),
    multi: true,
    validators: [validateNonEmpty],
    // @ts-ignore
    mapStateToProps: ({ datasource }: { datasource: DatasourceMeta; controls: CustomControlItem }) => ({
      columns: datasource?.columns || [],
      savedMetrics: datasource?.metrics || [],
      datasourceType: datasource?.type,
      fields: [
        {
          type: 'SelectControl',
          label: t('Chart type'),
          options: Object.keys(CHART_TYPES).map(key => ({
            value: key,
            label: CHART_TYPE_NAMES[key],
          })),
        },
      ],
    }),
  },
};

export const numbersFormat = {
  name: 'numbers_format',
  config: {
    label: t('Numbers Format'),
    description: t('Choose the format for numbers in the chart'),
    type: 'SelectControl',
    clearable: false,
    default: D3_FORMAT_OPTIONS[0][0],
    choices: D3_FORMAT_OPTIONS,
    renderTrigger: true,
  },
};

export const layout = {
  name: 'layout',
  config: {
    type: 'SelectControl',
    freeForm: true,
    clearable: false,
    label: t('Layout'),
    choices: formatSelectOptions(['horizontal', 'vertical']),
    default: 'horizontal',
    renderTrigger: true,
    description: t('Layout of the chart'),
  },
};

export const labelsColor = {
  name: 'labelsColor',
  config: {
    type: 'SelectControl',
    freeForm: true,
    clearable: false,
    label: t('Labels color'),
    choices: formatSelectOptions(['black', 'white']),
    default: 'white',
    renderTrigger: true,
    description: t('Color of the labels inside of bars'),
  },
};
const groupBy: { name: string; config: ControlConfig<'SelectControl'> } = {
  name: 'groupby',
  // @ts-ignore
  config: {
    ...sharedControls.groupby,
    validators: [validateNonEmpty],
  },
};

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [[groupBy], [metrics], ['columns'], ['adhoc_filters'], ['row_limit', null]],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme', layout],
        [showLegend, legendPosition],
        [numbersFormat, labelsColor],
        [chartType, barChartSubType, lineChartSubType, areaChartSubType, scatterChartSubType],
        [showTotals],
      ],
    },
    {
      label: t('X Axis'),
      expanded: true,
      controlSetRows: [[xAxisLabel, xAxisTickLabelAngle]],
    },
    {
      label: t('Y Axis'),
      expanded: true,
      controlSetRows: [
        [yAxisLabel, yAxisTickLabelAngle],
        [useSecondYAxis, y2AxisLabel, y2AxisTickLabelAngle],
      ],
    },
    {
      label: t('Category formatting'),
      expanded: true,
      controlSetRows: [...categoryFormatting],
    },
    {
      label: t('Sorting'),
      expanded: true,
      controlSetRows: [...orderByMetric, ...orderByGroupBy],
    },
    {
      label: t('Chart settings by metric'),
      expanded: true,
      controlSetRows: [...chartTypeMetrics],
    },
  ],

  controlOverrides: {
    columns: {
      label: t('Breakdowns'),
      description: t('Defines how each series is broken down'),
    },
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
