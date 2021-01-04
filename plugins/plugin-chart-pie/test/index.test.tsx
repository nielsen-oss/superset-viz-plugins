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
import PieChartPlugin from '../src';
import transformProps from '../src/plugin/transformProps';
import { categoryPercentageDonutNoLegend, legendLeftWithoutLabels, legendTopPercentage } from './__mocks__/pieProps';
import PieChart from '../src/PieChart';

jest.mock('recharts');

describe('plugin-chart-piw', () => {
  const RechartsPieChart = jest.fn(props => <div {...props} />);
  const Legend = jest.fn(() => <div />);
  const Pie = jest.fn(() => <div />);
  beforeEach(() => {
    // Recharts still have some UNSAFE react functions that failing test
    jest.spyOn(console, 'warn').mockImplementation(() => null);

    jest.clearAllMocks();

    // @ts-ignore
    recharts.PieChart = RechartsPieChart;
    // @ts-ignore
    recharts.Pie = Pie;
    // @ts-ignore
    recharts.Legend = Legend;
  });

  const getWrapper = (props: object) =>
    render(
      <ThemeProvider theme={supersetTheme}>
        {/*
       // @ts-ignore (no need emulate all props) */}
        <PieChart {...transformProps(props)} />
      </ThemeProvider>,
    );

  it('exists', () => {
    expect(PieChartPlugin).toBeDefined();
  });

  it('Chart with legend top / percentage labels ', () => {
    getWrapper(legendTopPercentage);
    expect({
      PieChartProps: RechartsPieChart.mock.calls[1],
      PieProps: Pie.mock.calls[1],
      LegendProps: Legend.mock.calls[1],
    }).toMatchSnapshot();
  });

  it('Chart with legend left / without labels', () => {
    getWrapper(legendLeftWithoutLabels);
    expect({
      PieChartProps: RechartsPieChart.mock.calls[1],
      PieProps: Pie.mock.calls[1],
      LegendProps: Legend.mock.calls[1],
    }).toMatchSnapshot();
  });

  it('Chart Donut with category and percentage labels / without legend', () => {
    getWrapper(categoryPercentageDonutNoLegend);
    expect({
      PieChartProps: RechartsPieChart.mock.calls[1],
      PieProps: Pie.mock.calls[1],
    }).toMatchSnapshot();
    expect(Legend).not.toBeCalled();
  });
});
