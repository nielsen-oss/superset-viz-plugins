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
import { formatNumber } from '@superset-ui/core';
import { DataSource, QueryData } from './transformProps';
import { ShowTotal } from '../types';

export const ROW_HEIGHT = 26;
export const TEXT_SEPARATOR = '#$_%$%_$#';

const buildUnits = <R extends string, C extends string, M extends string, T extends R | C>(
  item: QueryData<R, C, M>,
  dimension: T[],
  _units: BaseUnit<T>,
) => {
  const units: BaseUnit<T> = { ..._units };
  dimension.forEach(unit => {
    if (!units[unit]) {
      units[unit] = new Set<string>([]);
    }
    units[unit].add(item[unit]);
  });
  return units;
};

const multiplyArray = (arr: string[], times: number): string[] => {
  let newArray = [...arr];
  for (let i = 0; i < times - 1; i++) {
    newArray = newArray.concat(arr);
  }
  return newArray;
};

export type Unit<T extends string> = Record<T, string[]>;
type BaseUnit<T extends string> = Record<T, Set<string>>;

const extractUnits = <T extends string>(
  dimensionUnits: BaseUnit<T>,
  rootDimension: string[],
  withHeader = false,
): { units: Unit<T>; unitsSize: number; uiUnits: Unit<T> } => {
  let unitsSize = 1;
  let prevKey: T;
  const { units, uiUnits } = (Object.entries(dimensionUnits) as [T, Set<string>][]).reduce(
    (acc, [key, val]) => {
      acc.units[key] = [...val].sort();
      unitsSize *= acc.units[key].length;
      acc.uiUnits[key] = multiplyArray(
        [...val].sort(),
        // For rows we need to add also column name to render it's correctly in css grid
        (acc.uiUnits[prevKey] || rootDimension).length - (withHeader ? 1 : 0),
      );
      if (withHeader) {
        acc.uiUnits[key].unshift(key);
      }
      prevKey = key;

      return acc;
    },
    {
      units: {} as Unit<T>,
      uiUnits: {} as Unit<T>,
    },
  );
  return {
    unitsSize,
    units,
    uiUnits,
  };
};

const buildOneDimensionUnits = <T extends string>(dimension: T[], dimensionUnits: Unit<T>): string[] => {
  let oneDimensionUnits: string[] = [];
  const diveInDimension = (dimensionIndex: number) => {
    if (dimensionIndex === dimension.length - 1) {
      oneDimensionUnits = oneDimensionUnits.concat(dimensionUnits[dimension[dimensionIndex]]);
    } else if (dimension[dimensionIndex]) {
      dimensionUnits[dimension[dimensionIndex]].forEach(dimensionUnit => {
        oneDimensionUnits.push(dimensionUnit);
        diveInDimension(dimensionIndex + 1);
      });
    }
  };
  diveInDimension(0);
  return oneDimensionUnits;
};

export const getUnits = <R extends string, C extends string, M extends string>(
  data: QueryData<R, C, M>[],
  columns: C[],
  rows: R[],
  metrics: M[],
): {
  numberOfColumnsPerMetric: number;
  numberOfRows: number;
  columnUnits: Unit<C>;
  rowUnits: Unit<R>;
  uiColumnUnits: Unit<C>;
  uiRowUnits: Unit<R>;
  oneDimensionRows: string[];
  oneDimensionColumns: string[];
} => {
  let baseColumnUnits: BaseUnit<C> = {} as BaseUnit<C>;
  let baseRowUnits: BaseUnit<R> = {} as BaseUnit<R>;

  data.forEach(item => {
    baseColumnUnits = buildUnits<R, C, M, C>(item, columns, baseColumnUnits);
    baseRowUnits = buildUnits<R, C, M, R>(item, rows, baseRowUnits);
  });

  const { units: columnUnits, unitsSize: numberOfColumnsPerMetric, uiUnits: uiColumnUnits } = extractUnits<C>(
    baseColumnUnits as BaseUnit<C>,
    metrics,
  );

  const { units: rowUnits, unitsSize: numberOfRows, uiUnits: uiRowUnits } = extractUnits<R>(
    baseRowUnits as BaseUnit<R>,
    ['', ''],
    true,
  );

  const oneDimensionColumns = buildOneDimensionUnits<C>(columns, columnUnits);
  const oneDimensionRows = buildOneDimensionUnits<R>(rows, rowUnits);

  return {
    numberOfColumnsPerMetric,
    numberOfRows,
    columnUnits,
    rowUnits,
    uiColumnUnits,
    uiRowUnits,
    oneDimensionRows,
    oneDimensionColumns,
  };
};

const findUnitsIndex = <R extends string, C extends string, M extends string, T extends R | C>(
  dimension: T[],
  dimensionUnits: Unit<T>,
  oneDimensionArray: string[],
  item: QueryData<R, C, M>,
) => {
  let position = 0;
  let realIndex = 0;
  dimension.forEach(column => {
    position = oneDimensionArray.indexOf(item[column], position);
  });
  oneDimensionArray.slice(0, position).forEach(dim => {
    if (dimensionUnits[dimension[dimension.length - 1]].includes(dim)) {
      realIndex++;
    }
  });
  return realIndex;
};

type GetOneDimensionDataParams<R extends string, C extends string, M extends string> = {
  data: QueryData<R, C, M>[];
  columns: C[];
  rows: R[];
  metrics: M[];
  columnUnits: Unit<C>;
  rowUnits: Unit<R>;
  numberOfColumnsPerMetric: number;
  numberOfRows: number;
  oneDimensionColumns: string[];
  oneDimensionRows: string[];
  numbersFormat: string;
  showTotal: ShowTotal;
  emptyValuePlaceholder: string;
};

export const getOneDimensionData = <R extends string, C extends string, M extends string>({
  data,
  metrics,
  columnUnits,
  rowUnits,
  numberOfColumnsPerMetric,
  numberOfRows,
  columns,
  rows,
  oneDimensionColumns,
  oneDimensionRows,
  numbersFormat,
  showTotal,
  emptyValuePlaceholder,
}: GetOneDimensionDataParams<R, C, M>): {
  oneDimensionData: string[];
  columnsFillData: boolean[];
  rowsFillData: boolean[];
  rowsTotal: string[];
  total: string;
  columnsTotal: string[];
} => {
  const oneDimensionData: string[] = [];

  oneDimensionData.length = numberOfRows * numberOfColumnsPerMetric * metrics.length;
  oneDimensionData.fill('');

  const columnsFillData: boolean[] = [];
  columnsFillData.length = numberOfColumnsPerMetric * metrics.length;
  columnsFillData.fill(false);

  const rowsFillData: boolean[] = [];
  rowsFillData.length = numberOfRows;
  rowsFillData.fill(false);

  const rowsTotal: number[] = [];
  rowsTotal.length = numberOfRows;
  rowsTotal.fill(0);

  const columnsTotal: number[] = [];
  columnsTotal.length = numberOfColumnsPerMetric * metrics.length;
  columnsTotal.fill(0);

  let total = 0;

  data.forEach(item => {
    metrics.forEach((metric, metricIndex) => {
      const columnIndex = findUnitsIndex<R, C, M, C>(columns, columnUnits, oneDimensionColumns, item);
      const rowIndex = findUnitsIndex<R, C, M, R>(rows, rowUnits, oneDimensionRows, item);

      columnsFillData[columnIndex + metricIndex * numberOfColumnsPerMetric] =
        columnsFillData[columnIndex + metricIndex * numberOfColumnsPerMetric] || item[metric] !== null;

      rowsFillData[rowIndex] = rowsFillData[rowIndex] || item[metric] !== null;

      oneDimensionData[
        columnIndex + metricIndex * numberOfColumnsPerMetric + rowIndex * (numberOfColumnsPerMetric * metrics.length)
      ] = item[metric] === null ? emptyValuePlaceholder : formatNumber(numbersFormat, item[metric]);

      // Set totals
      if (showTotal !== ShowTotal.noTotal) {
        rowsTotal[rowIndex] += item[metric];
        columnsTotal[columnIndex + metricIndex * numberOfColumnsPerMetric] += item[metric];
        total += item[metric];
      }
    });
  });

  return {
    oneDimensionData,
    total: formatNumber(numbersFormat, total),
    columnsFillData,
    rowsFillData,
    rowsTotal: rowsTotal.map(row => formatNumber(numbersFormat, row)),
    columnsTotal: columnsTotal.map(column => formatNumber(numbersFormat, column)),
  };
};

// We need to create unique value name per groupby, so we add to each value column key
export const makeDataUnique = <R extends string, C extends string, M extends string>(
  data: QueryData<R, C, M>[],
  metrics: M[],
) =>
  data.map(item => ({
    ...item,
    ...Object.entries(item).reduce(
      (acc, [itemKey, itemVal]) => ({
        ...acc,
        [itemKey]: metrics.includes(itemKey as M) ? itemVal : `${itemVal}${TEXT_SEPARATOR}${itemKey}`,
      }),
      {},
    ),
  }));

// extract data that was generated by `makeDataUnique` function
export const extractUniqueData = (data: { [key: string]: string[] }) =>
  Object.entries(data).reduce(
    (acc, [itemKey, itemVal]) => ({ ...acc, [itemKey]: itemVal.map(val => val.split(TEXT_SEPARATOR)[0]) }),
    {},
  );

export const applyDatasourceLabels = <R extends string, C extends string, M extends string>(
  data: QueryData<R, C, M>[],
  datasource: DataSource<R, C>,
) =>
  data.map(item =>
    Object.entries(item).reduce(
      (acc, [key, val]) => ({ ...acc, [datasource.verboseMap[key] ?? key]: val }),
      {} as Record<R, R> & Record<C, R> & Record<M, number>,
    ),
  );

export const processNumbers = <R extends string, C extends string, M extends string>(
  resultData: QueryData<R, C, M>[],
  metrics: M[],
  numbersFormat: string,
  numbersFormatDigits?: string,
) => {
  const digits = Number(numbersFormatDigits);
  if (numbersFormat === 'SMART_NUMBER' && numbersFormatDigits && !Number.isNaN(digits)) {
    // eslint-disable-next-line no-param-reassign
    return resultData.map(item => ({
      ...item,
      ...metrics.reduce(
        (prevBreakdown, nextMetric) => ({
          ...prevBreakdown,
          [nextMetric]: Number(
            Number(item[nextMetric])
              .toLocaleString('en-US', {
                minimumFractionDigits: digits,
                maximumFractionDigits: digits,
              })
              .replace(/,/g, ''),
          ),
        }),
        {},
      ),
    }));
  }
  return resultData;
};
