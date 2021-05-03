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
import React from 'react';
import { render } from '@testing-library/react';
import * as recharts from 'recharts';
import { supersetTheme, ThemeProvider } from '@superset-ui/core';
import { processNumbers } from '../src/plugin/utils';
import WaterfallChartPlugin from '../src';
import transformProps from '../src/plugin/transformProps';
import { legendTop } from './__mocks__/waterfallProps';
import WaterfallChart, { WaterfallChartData } from '../src/components/WaterfallChart';

jest.mock('recharts');

describe('plugin-chart-waterfall', () => {
  const BarChart = jest.fn(props => <div {...props} />);
  const CartesianGrid = jest.fn(() => <div />);
  const Legend = jest.fn(() => <div />);
  const Tooltip = jest.fn(() => <div />);
  const XAxis = jest.fn(() => <div />);
  const YAxis = jest.fn(() => <div />);
  const Bar = jest.fn(() => <div />);
  beforeEach(() => {
    // Recharts still have some UNSAFE react functions that failing test
    jest.spyOn(console, 'warn').mockImplementation(() => null);

    jest.clearAllMocks();

    // @ts-ignore
    recharts.CartesianGrid = CartesianGrid;
    // @ts-ignore
    recharts.BarChart = BarChart;
    // @ts-ignore
    recharts.Legend = Legend;
    // @ts-ignore
    recharts.Tooltip = Tooltip;
    // @ts-ignore
    recharts.XAxis = XAxis;
    // @ts-ignore
    recharts.YAxis = YAxis;
    // @ts-ignore
    recharts.Bar = Bar;
  });

  const getWrapper = (props: object) =>
    render(
      <ThemeProvider theme={supersetTheme}>
        {/*
       // @ts-ignore (no need emulate all props) */}
        <WaterfallChart {...transformProps(props)} />
      </ThemeProvider>,
    );

  it('exists', () => {
    expect(WaterfallChartPlugin).toBeDefined();
  });

  it('Chart with legend top', () => {
    getWrapper(legendTop);
    expect({
      BarChartProps: BarChart.mock.calls[0],
      CartesianGridProps: CartesianGrid.mock.calls[0],
      LegendProps: Legend.mock.calls[0],
      TooltipProps: Tooltip.mock.calls[0],
      XAxisProps: XAxis.mock.calls[0],
      YAxisProps: YAxis.mock.calls[0],
      BarProps: Bar.mock.calls[0],
    }).toMatchSnapshot();
  });

  describe('processNumbers', () => {
    const mockData = ([
      { metric: [-0.1114, 0] },
      { metric: [-0.1115, 0] },
      { metric: [-0.1116, 0] },
      { metric: [-0.1, 0] },
      { metric: [0, 0] },
      { metric: [0.1, 0] },
      { metric: [0.1114, 0] },
      { metric: [0.1115, 0] },
      { metric: [0.1116, 0] },
      { metric: [0.123, 0] },
      { metric: [0.123456, 0] },
      { metric: [123, 0] },
      { metric: [123456, 0] },
      { metric: [123456789, 0] },
      { metric: [1234567891011121314151617181920, 0] },
    ] as unknown) as WaterfallChartData[];
    it('non-adaptive', () => {
      expect(
        processNumbers(([{ metric: [123, 456] }] as unknown) as WaterfallChartData[], 'metric', 'SOME_FORMAT', '3'),
      ).toEqual([{ metric: [123, 456] }]);
    });
    it('adaptive with digits for different numbers', () => {
      expect(processNumbers(mockData, 'metric', 'SMART_NUMBER', '3')).toMatchSnapshot();
    });
    it('adaptive with digits without precision', () => {
      expect(processNumbers(mockData, 'metric', 'SMART_NUMBER')).toMatchSnapshot();
    });
  });
});
