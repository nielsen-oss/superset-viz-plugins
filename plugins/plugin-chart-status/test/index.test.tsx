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
import { render, screen } from '@testing-library/react';
import { supersetTheme, ThemeProvider } from '@superset-ui/core';
import StatusChartPlugin from '../src';
import StatusChart from '../src/StatusChart';
import transformProps from '../src/plugin/transformProps';
import { statusesAndObjects } from './__mocks__/statusProps';

jest.mock('recharts');

describe('plugin-chart-status', () => {
  beforeEach(() => {
    // Recharts still have some UNSAFE react functions that failing test
    jest.spyOn(console, 'warn').mockImplementation(() => null);
  });
  const getWrapper = (props: object) =>
    render(
      <ThemeProvider theme={supersetTheme}>
        {/*
       // @ts-ignore (no need emulate all props) */}
        <StatusChart {...transformProps(props)} />
      </ThemeProvider>,
    );
  it('exists', () => {
    expect(StatusChartPlugin).toBeDefined();
  });

  it('Multiple Objects / Statuses', () => {
    getWrapper(statusesAndObjects);
    expect(screen.getByTestId('status')).toMatchSnapshot();
  });
});
