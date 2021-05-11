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
import {
  applyDatasourceLabels,
  extractUniqueData,
  getOneDimensionData,
  getUnits,
  makeDataUnique,
  processNumbers,
} from './utils';
import { ShowTotal } from '../types';

type MetricObject<M extends string> = {
  label: M;
  column: {
    verbose_name: M;
  };
};

type FormData<R extends string, C extends string, M extends string> = {
  numbersFormat: string;
  numbersFormatDigits: string;
  emptyValuePlaceholder: string;
  compactView: boolean;
  transpose: boolean;
  showTotal: ShowTotal;
  rows: R[];
  columns: C[];
  metrics: MetricObject<M>[];
};

export type QueryData<R extends string, C extends string, M extends string> = Record<R | C, string> & Record<M, number>;
export type DataSource<R extends string, C extends string> = {
  verboseMap: Record<string, R> | Record<string, C>;
};
export type ChartProps<R extends string = string, C extends string = string, M extends string = string> = {
  width: number;
  height: number;
  datasource: DataSource<R, C>;
  formData: FormData<R, C, M>;
  queriesData: {
    data: QueryData<R, C, M>[];
  }[];
};

export default function transformProps<R extends string = string, C extends string = string, M extends string = string>(
  chartProps: ChartProps<R, C, M>,
) {
  const { width, height, formData, queriesData, datasource } = chartProps;
  let { data } = queriesData[0];
  const metrics = formData.metrics.map(({ label }) => label).sort();
  data = processNumbers<R, C, M>(data, metrics, formData.numbersFormat, formData.numbersFormatDigits);
  data = applyDatasourceLabels<R, C, M>(data, datasource);
  data = makeDataUnique<R, C, M>(data, metrics);
  const {
    transpose,
    rows: tempRows,
    columns: tempColumns,
    compactView,
    numbersFormat,
    showTotal = ShowTotal.noTotal,
    emptyValuePlaceholder,
  } = formData;
  let rows: R[] = (tempRows ?? []).map(row => datasource.verboseMap[row] ?? row) as R[];
  let columns: C[] = (tempColumns ?? []).map(column => datasource.verboseMap[column] ?? column) as C[];
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
    numbersFormat,
    numberOfRows,
    oneDimensionRows,
    oneDimensionColumns,
    showTotal,
    emptyValuePlaceholder,
  });
  return {
    width,
    height,
    data: oneDimensionData,
    rows,
    emptyValuePlaceholder,
    uiColumnUnits: extractUniqueData(uiColumnUnits),
    uiRowUnits: extractUniqueData(uiRowUnits),
    columnUnits: extractUniqueData(columnUnits),
    rowUnits: extractUniqueData(rowUnits),
    columnsFillData,
    rowsFillData,
    columns,
    total,
    compactView,
    rowsTotal,
    numberOfColumns: numberOfColumnsPerMetric * metrics.length,
    numberOfRows,
    columnsTotal,
    showTotal,
    metrics,
  };
}
