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
import { processNumbers, ResultData } from '../src/plugin/utils';
import ComposedChart from '../src/components/ComposedChart';
import ComposedChartPlugin from '../src';
import {
  allChatsLegendBottomBreakdowns,
  barsHorizontalLegendLeftY2AxisBreakdowns,
  barsHorizontalLegendTop,
  barsVerticalLegendRightNumFormatAllLabelsBreakdowns,
} from './__mocks__/composedProps';
import transformProps from '../src/plugin/transformProps';

jest.mock('recharts');

describe('plugin-chart-composed', () => {
  const RechartsComposedChart = jest.fn(props => <div {...props} />);
  const CartesianGrid = jest.fn(() => <div />);
  const Legend = jest.fn(() => <div />);
  const Tooltip = jest.fn(() => <div />);
  const XAxis = jest.fn(() => <div />);
  const YAxis = jest.fn(() => <div />);
  const Scatter = jest.fn(() => <div />);
  const Area = jest.fn(() => <div />);
  const Bar = jest.fn(() => <div />);
  const Line = jest.fn(() => <div />);
  beforeEach(() => {
    // Recharts still have some UNSAFE react functions that failing test
    jest.spyOn(console, 'warn').mockImplementation(() => null);

    jest.clearAllMocks();

    // @ts-ignore
    recharts.CartesianGrid = CartesianGrid;
    // @ts-ignore
    recharts.ComposedChart = RechartsComposedChart;
    // @ts-ignore
    recharts.Legend = Legend;
    // @ts-ignore
    recharts.Tooltip = Tooltip;
    // @ts-ignore
    recharts.XAxis = XAxis;
    // @ts-ignore
    recharts.YAxis = YAxis;
    // @ts-ignore
    recharts.Area = Area;
    // @ts-ignore
    recharts.Bar = Bar;
    // @ts-ignore
    recharts.Line = Line;
    // @ts-ignore
    recharts.Scatter = Scatter;
  });

  const getWrapper = (props: object) =>
    render(
      <ThemeProvider theme={supersetTheme}>
        {/*
       // @ts-ignore (no need emulate all props) */}
        <ComposedChart {...transformProps(props)} />
      </ThemeProvider>,
    );

  it('exists', () => {
    expect(ComposedChartPlugin).toBeDefined();
  });

  it('Chart with default props (legend top / horizontal / bars)', () => {
    getWrapper(barsHorizontalLegendTop);
    expect({
      ComposedChartProps: RechartsComposedChart.mock.calls[1],
      CartesianGridProps: CartesianGrid.mock.calls[1],
      LegendProps: Legend.mock.calls[1],
      TooltipProps: Tooltip.mock.calls[1],
      XAxisProps: XAxis.mock.calls[1],
      YAxisProps: YAxis.mock.calls[1],
      BarProps: Bar.mock.calls[1],
    }).toMatchSnapshot();
    expect(Area).not.toHaveBeenCalled();
    expect(Line).not.toHaveBeenCalled();
    expect(Scatter).not.toHaveBeenCalled();
  });

  it('Chart with default props (legend left / horizontal / Y2Axis / bars / breakdowns)', () => {
    getWrapper(barsHorizontalLegendLeftY2AxisBreakdowns);
    expect({
      ComposedChartProps: RechartsComposedChart.mock.calls[1],
      CartesianGridProps: CartesianGrid.mock.calls[1],
      LegendProps: Legend.mock.calls[1],
      TooltipProps: Tooltip.mock.calls[1],
      XAxisProps: XAxis.mock.calls[1],
      YAxisProps: YAxis.mock.calls[1],
      BarProps: Bar.mock.calls[1],
    }).toMatchSnapshot();
  });

  it('Chart with default props (legend right / vertical / number format / bars / all labels / breakdowns)', () => {
    getWrapper(barsVerticalLegendRightNumFormatAllLabelsBreakdowns);
    expect({
      ComposedChartProps: RechartsComposedChart.mock.calls[1],
      CartesianGridProps: CartesianGrid.mock.calls[1],
      LegendProps: Legend.mock.calls[1],
      TooltipProps: Tooltip.mock.calls[1],
      XAxisProps: XAxis.mock.calls[1],
      YAxisProps: YAxis.mock.calls[1],
    }).toMatchSnapshot();
  });

  it('All charts with breakdowns', () => {
    getWrapper(allChatsLegendBottomBreakdowns);
    expect({
      ComposedChartProps: RechartsComposedChart.mock.calls[1],
      CartesianGridProps: CartesianGrid.mock.calls[1],
      LegendProps: Legend.mock.calls[1],
      TooltipProps: Tooltip.mock.calls[1],
      XAxisProps: XAxis.mock.calls[1],
      YAxisProps: YAxis.mock.calls[1],
      BarProps: Bar.mock.calls[1],
      AreaProps: Area.mock.calls[1],
      LineProps: Line.mock.calls[1],
      ScatterProps: Scatter.mock.calls[1],
    }).toMatchSnapshot();
  });
  describe('processNumbers', () => {
    const mockData = ([
      { metric: -0.1114 },
      { metric: -0.1115 },
      { metric: -0.1116 },
      { metric: -0.1 },
      { metric: 0 },
      { metric: 0.1 },
      { metric: 0.1114 },
      { metric: 0.1115 },
      { metric: 0.1116 },
      { metric: 0.123 },
      { metric: 0.123456 },
      { metric: 123 },
      { metric: 123456 },
      { metric: 123456789 },
      { metric: 1234567891011121314151617181920 },
    ] as unknown) as ResultData[];
    it('non-adaptive', () => {
      expect(processNumbers(([{ metric: 123 }] as unknown) as ResultData[], ['metric'], 'SOME_FORMAT', '3')).toEqual([
        { metric: 123 },
      ]);
    });
    it('adaptive with digits for different numbers', () => {
      expect(processNumbers(mockData, ['metric'], 'SMART_NUMBER', '3')).toMatchSnapshot();
    });
    it('adaptive with digits without precision', () => {
      expect(processNumbers(mockData, ['metric'], 'SMART_NUMBER')).toMatchSnapshot();
    });
  });
});
