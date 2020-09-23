Object.defineProperty(exports, '__esModule', { value: true });
exports.labelsColor = exports.layout = exports.numbersFormat = exports.yAxisTickLabelAngle = exports.xAxisTickLabelAngle = exports.yAxisLabel = exports.xAxisLabel = exports.stackedBars = void 0;
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
const translation_1 = require('@superset-ui/translation');
const validator_1 = require('@superset-ui/validator');
const chart_controls_1 = require('@superset-ui/chart-controls');

exports.stackedBars = {
  name: 'stacked_bars',
  config: {
    type: 'CheckboxControl',
    label: translation_1.t('Stacked Bars'),
    renderTrigger: true,
    default: false,
    description: null,
  },
};
exports.xAxisLabel = {
  name: 'x_axis_label',
  config: {
    type: 'TextControl',
    label: translation_1.t('X Axis label'),
    renderTrigger: true,
    default: '',
    description: translation_1.t('Show X Axis Label in the chart'),
  },
};
exports.yAxisLabel = {
  name: 'y_axis_label',
  config: {
    type: 'TextControl',
    label: translation_1.t('Y Axis label'),
    renderTrigger: true,
    default: '',
    description: translation_1.t('Show Y Axis Label in the chart'),
  },
};
exports.xAxisTickLabelAngle = {
  name: 'x_axis_tick_label_angle',
  config: {
    freeForm: true,
    label: translation_1.t('X axis tick label angle'),
    renderTrigger: true,
    clearable: false,
    type: 'SelectControl',
    choices: chart_controls_1.formatSelectOptions(['0', '45', '90']),
    default: '45',
    description: translation_1.t('Set X axis tick label angle in the chart'),
  },
};
exports.yAxisTickLabelAngle = {
  name: 'y_axis_tick_label_angle',
  config: {
    freeForm: true,
    type: 'SelectControl',
    clearable: false,
    label: translation_1.t('Y axis tick label angle'),
    renderTrigger: true,
    choices: chart_controls_1.formatSelectOptions(['0', '45', '90']),
    default: '0',
    description: translation_1.t('Set Y axis tick label angle in the chart'),
  },
};
exports.numbersFormat = {
  name: 'numbers_format',
  config: {
    label: translation_1.t('Numbers Format'),
    description: translation_1.t('Choose the format for numbers in the chart'),
    type: 'SelectControl',
    clearable: false,
    default: chart_controls_1.D3_FORMAT_OPTIONS[0],
    choices: chart_controls_1.D3_FORMAT_OPTIONS,
    renderTrigger: true,
  },
};
exports.layout = {
  name: 'layout',
  config: {
    type: 'SelectControl',
    freeForm: true,
    clearable: false,
    label: translation_1.t('Layout'),
    choices: chart_controls_1.formatSelectOptions(['horizontal', 'vertical']),
    default: 'horizontal',
    renderTrigger: true,
    description: translation_1.t('Layout of the chart'),
  },
};
exports.labelsColor = {
  name: 'labelsColor',
  config: {
    type: 'SelectControl',
    freeForm: true,
    clearable: false,
    label: translation_1.t('Labels color'),
    choices: chart_controls_1.formatSelectOptions(['black', 'white']),
    default: 'white',
    renderTrigger: true,
    description: translation_1.t('Color of the labels inside of bars'),
  },
};
const config = {
  controlPanelSections: [
    {
      label: translation_1.t('Query'),
      expanded: true,
      controlSetRows: [['groupby'], ['metrics'], ['adhoc_filters'], ['row_limit', null]],
    },
    {
      label: translation_1.t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme', exports.layout],
        [exports.numbersFormat, exports.labelsColor, exports.stackedBars],
      ],
    },
    {
      label: translation_1.t('X Axis'),
      expanded: true,
      controlSetRows: [[exports.xAxisLabel, exports.xAxisTickLabelAngle]],
    },
    {
      label: translation_1.t('Y Axis'),
      expanded: true,
      controlSetRows: [[exports.yAxisLabel, exports.yAxisTickLabelAngle]],
    },
  ],
  controlOverrides: {
    series: {
      validators: [validator_1.validateNonEmpty],
      clearable: false,
    },
    row_limit: {
      default: 100,
    },
  },
};
exports.default = config;
