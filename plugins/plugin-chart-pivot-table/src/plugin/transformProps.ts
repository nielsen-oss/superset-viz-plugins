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
import { getOneDimensionData, getUnits } from './utils';
import { ShowTotal } from '../types';

type MetricObject<M extends string> = {
  label: M;
};

type FormData<R extends string, C extends string, M extends string> = {
  numberFormat: string;
  emptyValuePlaceholder: string;
  transpose: boolean;
  showTotal: ShowTotal;
  rows: R[];
  columns: C[];
  metrics: MetricObject<M>[];
};

export type QueryData<R extends string, C extends string, M extends string> = Record<R, string> &
  Record<C, string> &
  Record<M, number>;

export type ChartProps<R extends string, C extends string, M extends string> = {
  width: number;
  height: number;
  formData: FormData<R, C, M>;
  queryData: {
    data: QueryData<R, C, M>[];
  };
};

export default function transformProps<R extends string, C extends string, M extends string>(
  chartProps: ChartProps<R, C, M>,
) {
  const { width, height, formData, queryData } = chartProps;
  const { data } = queryData;
  const metrics = formData.metrics.map(({ label }) => label).sort();
  const {
    transpose,
    rows: tempRows,
    columns: tempColumns,
    numberFormat,
    showTotal = ShowTotal.noTotal,
    emptyValuePlaceholder,
  } = formData;

  let rows: R[] = tempRows || [];
  let columns: C[] = tempColumns || [];
  if (transpose) {
    rows = ((tempColumns as unknown) as R[]) || [];
    columns = ((tempRows as unknown) as C[]) || [];
  }

  const {
    columnUnits,
    rowUnits,
    numberOfColumnsPerMetric,
    numberOfRows,
    oneDimensionRows,
    uiColumnUnits,
    uiRowUnits,
    oneDimensionColumns,
  } = getUnits<R, C, M>(data, columns, rows, metrics);

  const { oneDimensionData, columnsFillData, rowsFillData, rowsTotal, columnsTotal, total } = getOneDimensionData<
    R,
    C,
    M
  >({
    data,
    metrics,
    columns,
    rows,
    columnUnits,
    rowUnits,
    numberOfColumnsPerMetric,
    numberFormat,
    numberOfRows,
    oneDimensionRows,
    oneDimensionColumns,
    showTotal,
  });

  return {
    width,
    height,
    data: oneDimensionData,
    rows,
    emptyValuePlaceholder,
    uiColumnUnits,
    uiRowUnits,
    columnUnits,
    rowUnits,
    columnsFillData,
    rowsFillData,
    columns,
    total,
    rowsTotal,
    numberOfColumns: numberOfColumnsPerMetric * metrics.length,
    numberOfRows,
    columnsTotal,
    showTotal,
    metrics,
  };
}
