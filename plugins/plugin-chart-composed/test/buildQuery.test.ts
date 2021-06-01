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
import buildQuery from '../src/plugin/buildQuery';

describe('buildQuery', () => {
  const mockFormData = {
    viz_type: 'composed',
    datasource: '11__table',
    query_mode: 'query_mode',
    x_column: 'timeperiod',
    y_column: 'spend',
    groupby: ['timeperiod'],
    metrics: [
      {
        column: {
          id: 1043,
          column_name: 'spend',
        },
        aggregate: 'SUM',
        label: 'SUM(spend)',
      },
    ],
    columns: ['duetogroup'],
    use_order_by_x_column_0: true,
    order_by_type_x_column_0: 'ASC',
    use_order_by_y_column_0: true,
    order_by_type_y_column_0: 'DESC',
    use_order_by_group_by_0: true,
    order_by_type_group_by_0: 'ASC',
    use_order_by_metric_0: true,
    order_by_type_metric_0: 'ASC',
  };

  beforeEach(() => {
    // Recharts still have some UNSAFE react functions that failing test
    jest.spyOn(console, 'warn').mockImplementation(() => null);
  });

  it('aggregate mode', () => {
    // @ts-ignore
    expect(buildQuery(mockFormData).queries[0]).toMatchSnapshot();
  });

  it('raw mode', () => {
    // @ts-ignore
    expect(buildQuery({ ...mockFormData, query_mode: 'raw' }).queries[0]).toMatchSnapshot();
  });
});
