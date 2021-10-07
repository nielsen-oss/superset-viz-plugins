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
import { D3_FORMAT_OPTIONS } from '@superset-ui/chart-controls';
import { CHART_SUB_TYPES, Layout } from '../../plugins/plugin-chart-composed/src/components/types';
import ComposedChart from '../../plugins/plugin-chart-composed/src/components/ComposedChart';

export const applyCommonLogic = initArgs => {
  const args = { ...initArgs };
  delete args.data;
  if (args.layout !== Layout.horizontal) {
    args.useY2Axis = false;
  }
  args.xAxis = {
    label: args.xAxisLabel,
    tickLabelAngle: -Number(args.xAxisTickLabelAngle),
  };
  args.yAxis = {
    label: args.yAxisLabel,
    tickLabelAngle: -Number(args.yAxisTickLabelAngle),
    label2: args.y2AxisLabel,
    tickLabelAngle2: -Number(args.y2AxisTickLabelAngle),
  };
  return args;
};

export const commonConfig = {
  component: ComposedChart,
  parameters: {
    chromatic: { delay: 2000 },
  },
  argTypes: {
    data: { table: { disable: true } },
    metrics: { table: { disable: true } },
    colorScheme: { table: { disable: true } },
    hasOrderedBars: { table: { disable: true } },
    isAnimationActive: { table: { disable: true } },
    isTimeSeries: { table: { disable: true } },
    hasCustomTypeMetrics: { table: { disable: true } },
    orderByTypeMetric: { table: { disable: true } },
    chartTypeMetrics: { table: { disable: true } },
    chartSubTypeMetrics: { table: { disable: true } },
    chartType: { table: { disable: true } },
    xAxis: { table: { disable: true } },
    yAxis: { table: { disable: true } },
    useCategoryFormattingGroupBy0: {
      control: {
        type: 'boolean',
      },
    },
    xAxisLabel: {
      table: {
        category: 'X Axis',
      },
      control: {
        type: 'text',
      },
    },
    showLegend: {
      table: {
        category: 'Legend',
      },
    },
    legendPosition: {
      table: {
        category: 'Legend',
      },
    },
    hideLegendByMetric: {
      table: {
        category: 'Legend',
      },
      control: {
        type: 'multi-select',
        options: [0, 1, 2, 3],
      },
    },
    xAxisTickLabelAngle: {
      table: {
        category: 'X Axis',
      },
      control: {
        type: 'select',
        options: ['0', '45', '90'],
      },
    },
    yAxisLabel: {
      table: {
        category: 'Y Axis',
      },
      control: {
        type: 'text',
      },
    },
    yAxisTickLabelAngle: {
      table: {
        category: 'Y Axis',
      },
      control: {
        type: 'select',
        options: ['0', '45', '90'],
      },
    },
    chartSubType: {
      control: {
        type: 'select',
        options: Object.values(CHART_SUB_TYPES),
      },
    },
    hasY2Axis: {
      table: {
        category: 'Y2 Axis',
      },
      control: {
        type: 'boolean',
      },
    },
    y2AxisLabel: {
      table: {
        category: 'Y2 Axis',
      },
      control: {
        type: 'text',
      },
    },
    y2AxisTickLabelAngle: {
      table: {
        category: 'Y2 Axis',
      },
      control: {
        type: 'select',
        options: ['0', '45', '90'],
      },
    },
    numbersFormat: {
      control: {
        type: 'select',
        options: D3_FORMAT_OPTIONS.map(([option]) => option),
      },
    },
  },
};
