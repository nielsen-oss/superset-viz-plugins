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
  sections,
  sharedControls,
} from '@superset-ui/chart-controls';
import { CHART_TYPES, CHART_TYPE_NAMES, CHART_SUB_TYPES } from '../components/types';
import {
  useSecondYAxis,
  xAxisInterval,
  xAxisLabel,
  xAxisTickLabelAngle,
  y2AxisLabel,
  y2AxisLabelAngle,
  y2AxisTickLabelAngle,
  yAxisLabel,
  yAxisLabelAngle,
  yAxisTickLabelAngle,
} from './configs/axis';
import {
  areaChartSubType,
  barChartSubType,
  chartType,
  lineChartSubType,
  scatterChartSubType,
  bubbleChartSubType,
} from './configs/chartTypes';
import { chartTypeMetrics } from './configs/chartTypeMetrics';
import { orderByColumns, orderByGroupBy, orderByMetric } from './configs/orderBy';
import { categoryFormatting } from './configs/categoryFormatting';
import { getQueryMode, isAggMode, isRawMode, QueryMode } from './utils';
import { hideLegendByMetric, legendPosition, showLegend } from './configs/legend';
import { colorSchemeByBreakdown, colorSchemeByMetric } from './configs/colorScheme';

export const showTotals = {
  name: 'show_totals',
  config: {
    type: 'CheckboxControl',
    label: t('Show Totals'),
    renderTrigger: true,
    default: false,
    description: t(
      'Show total values for stacked bar chart (can be applied correctly only without composition with other charts)',
    ),
    visibility: ({ form_data }: { form_data: QueryFormData }) =>
      form_data.bar_chart_sub_type === CHART_SUB_TYPES.STACKED,
  },
};

export const minBarWidth = {
  name: 'min_bar_width',
  config: {
    type: 'TextControl',
    label: t('Min Bar Width'),
    renderTrigger: true,
    default: '',
    description: t('Minimal bar width'),
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.chart_type === CHART_TYPES.BAR_CHART,
  },
};

const metrics: { name: string; config: ControlConfig<'MetricsControl'> } = {
  name: 'metrics',
  config: {
    type: 'MetricsControl',
    label: t('Metrics'),
    description: t('One or many metrics to display'),
    multi: true,
    // @ts-ignore
    visibility: isAggMode,
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

const zDimension: { name: string; config: ControlConfig<'MetricsControl'> } = {
  name: 'z_dimension',
  config: {
    type: 'MetricsControl',
    label: t('Z Dimension'),
    description: t('For charts that supports Z Dimension (like Bubble chart), choose column mapped to it'),
    multi: false,
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.chart_type === CHART_TYPES.BUBBLE_CHART,
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

export const bubbleSize = {
  name: 'bubble_size',
  config: {
    label: t('Bubble size'),
    type: 'SelectControl',
    choices: formatSelectOptions([10, 20, 100, 200, 1000, 2000, 10000, 20000, 50000]),
    default: 1000,
    renderTrigger: true,
    description: t('Max size of bubble'),
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.chart_type === CHART_TYPES.BUBBLE_CHART,
  },
};
export const numbersFormatDigits = {
  name: 'numbers_format_digits',
  config: {
    label: t('Numbers Format Digits'),
    type: 'SelectControl',
    clearable: true,
    choices: ['0', '1', '2', '3', '4', '5'],
    renderTrigger: true,
    description: t('Number of digits after point'),
    visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.numbers_format === 'SMART_NUMBER',
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
    // @ts-ignore
    visibility: isAggMode,
  },
};

const xAxisColumn: { name: string; config: ControlConfig<'SelectControl'> } = {
  name: 'x_column',
  // @ts-ignore
  config: {
    ...sharedControls.groupby,
    label: t('X Column'),
    visibility: isRawMode,
    multi: false,
  },
};

const yAxisColumn: { name: string; config: ControlConfig<'SelectControl'> } = {
  name: 'y_column',
  // @ts-ignore
  config: {
    ...sharedControls.groupby,
    label: t('Y Column'),
    visibility: isRawMode,
    multi: false,
  },
};

const queryMode: { name: string; config: ControlConfig<'RadioButtonControl'> } = {
  name: 'query_mode',
  config: {
    type: 'RadioButtonControl',
    label: t('Query mode'),
    default: null,
    options: [
      [QueryMode.aggregate, t('Aggregate')],
      [QueryMode.raw, t('Raw Records')],
    ],
    mapStateToProps: ({ controls }) => ({ value: getQueryMode(controls) }),
  },
};

const drillDownGroupBy: { name: string; config: ControlConfig<'SelectControl'> } = {
  name: 'drill_down_group_by',
  // @ts-ignore
  config: {
    ...sharedControls.columns,
    label: t('Drill down group by'),
    // @ts-ignore
    visibility: isAggMode,
  },
};

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyTimeseriesTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [queryMode],
        [xAxisColumn],
        [yAxisColumn],
        [groupBy],
        [metrics],
        [zDimension],
        ['columns'],
        ['adhoc_filters'],
        ['row_limit', null],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [layout],
        [numbersFormat, numbersFormatDigits],
        [chartType, barChartSubType, lineChartSubType, areaChartSubType, scatterChartSubType, bubbleChartSubType],
        [bubbleSize, minBarWidth],
        [labelsColor, showTotals],
      ],
    },
    {
      label: t('Color scheme'),
      expanded: true,
      controlSetRows: [['color_scheme'], ...colorSchemeByMetric, ...colorSchemeByBreakdown],
    },
    {
      label: t('Legend'),
      expanded: true,
      controlSetRows: [[showLegend, legendPosition], ...hideLegendByMetric],
    },
    {
      label: t('X Axis'),
      expanded: true,
      controlSetRows: [[xAxisLabel, xAxisTickLabelAngle], [xAxisInterval]],
    },
    {
      label: t('Y Axis'),
      expanded: true,
      controlSetRows: [
        [yAxisLabel],
        [yAxisLabelAngle, yAxisTickLabelAngle],
        [useSecondYAxis, y2AxisLabel],
        [y2AxisLabelAngle, y2AxisTickLabelAngle],
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
      controlSetRows: [...orderByMetric, ...orderByGroupBy, ...orderByColumns],
    },
    {
      label: t('Chart settings by metric'),
      expanded: true,
      controlSetRows: [...chartTypeMetrics],
    },
    {
      label: t('Drill down'),
      expanded: true,
      controlSetRows: [[drillDownGroupBy]],
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
