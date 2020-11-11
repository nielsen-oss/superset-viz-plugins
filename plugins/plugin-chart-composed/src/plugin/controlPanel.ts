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
import { t } from '@superset-ui/translation';
import { validateNonEmpty } from '@superset-ui/validator';
import {
  ControlPanelConfig,
  formatSelectOptions,
  D3_FORMAT_OPTIONS,
  CustomControlItem,
  DatasourceMeta,
  ControlSetItem
} from '@superset-ui/chart-controls';
import {
  CHART_TYPES,
  CHART_TYPE_NAMES,
  CHART_SUB_TYPES,
  CHART_SUB_TYPE_NAMES,
  Layout,
  LegendPosition,
} from '../components/utils';
import { QueryFormData  } from '@superset-ui/core';

export const stackedBars = {
  name: 'stacked_bars',
  config: {
    type: 'CheckboxControl',
    label: t('Stacked Bars'),
    renderTrigger: true,
    default: false,
    description: null,
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
    visibility: ({ form_data }: { form_data: QueryFormData }) =>
      form_data.metrics?.length > 1 && form_data.layout === Layout.horizontal,
  },
};

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
    visibility: ({ form_data }: { form_data: QueryFormData }) =>
      form_data.use_y2_axis && form_data.metrics?.length > 1 && form_data.layout === Layout.horizontal,
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
    description: t('Set type of chart'),
  },
};

let chartTypeMetrics = [];
for (let i = 0; i < 50; i++) {
  chartTypeMetrics.push(i + 1);
}

chartTypeMetrics = chartTypeMetrics.map((el, index) => {
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
        form_data[`use_custom_type_metric_${index}`] &&
        form_data.metrics &&
        form_data.metrics[index] &&
        form_data[`chart_type_metric_${index}`] === CHART_TYPES.BAR_CHART,
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
        form_data[`use_custom_type_metric_${index}`] &&
        form_data.metrics &&
        form_data.metrics[index] &&
        form_data[`chart_type_metric_${index}`] === CHART_TYPES.LINE_CHART,
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
        form_data[`use_custom_type_metric_${index}`] &&
        form_data[`chart_type_metric_${index}`] === CHART_TYPES.AREA_CHART,
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
        form_data[`use_custom_type_metric_${index}`] &&
        form_data.metrics &&
        form_data.metrics[index] &&
        form_data[`chart_type_metric_${index}`] === CHART_TYPES.SCATTER_CHART,
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
        visibility: ({ form_data }: { form_data: QueryFormData }) => form_data.metrics && form_data.metrics[index],
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
          form_data[`use_custom_type_metric_${index}`] && form_data.metrics && form_data.metrics[index],
      },
    },
    barChartSubTypeMetric,
    lineChartSubTypeMetric,
    areaChartSubTypeMetric,
    scatterChartSubTypeMetric,
  ];
});

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
    description: t('Set subtype of chart'),
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
    default: CHART_SUB_TYPES.BASIS,
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
    visibility: ({ form_data }: { form_data: QueryFormData }) =>
      form_data.use_y2_axis && form_data.metrics?.length > 1 && form_data.layout === Layout.horizontal,
  },
};

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

const metrics: ControlSetItem = {
  name: 'metrics',
  config: {
    type: 'MetricsControl',
    label: t('Metrics'),
    description: t('One or many metrics to display'),
    multi: true,
    // @ts-ignore
    mapStateToProps: ({ datasource, controls }: { datasource: DatasourceMeta; controls: CustomControlItem }) => {
      return {
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
      };
    },
  },
};

export const numbersFormat = {
  name: 'numbers_format',
  config: {
    label: t('Numbers Format'),
    description: t('Choose the format for numbers in the chart'),
    type: 'SelectControl',
    clearable: false,
    default: D3_FORMAT_OPTIONS[0],
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

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['groupby'], [metrics], ['adhoc_filters'], ['row_limit', null]],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme', layout],
        [showLegend, legendPosition],
        [numbersFormat, labelsColor],
        [chartType, barChartSubType, lineChartSubType, areaChartSubType, scatterChartSubType],
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
      label: t('Chart settings per metric'),
      expanded: false,
      controlSetRows: [...chartTypeMetrics],
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
