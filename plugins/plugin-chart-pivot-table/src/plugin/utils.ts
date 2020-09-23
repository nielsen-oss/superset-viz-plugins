import { formatNumber } from '@superset-ui/core';
import { QueryData } from './transformProps';

export const ROW_HEIGHT = '27px';

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

const multiplyArray = <T>(arr: T[], times: number) => {
  let newArray = [...arr];
  for (let i = 0; i < times - 1; i++) {
    newArray = newArray.concat(arr);
  }
  return newArray;
};

const extractUnits = <T extends string>(
  dimensionUnits: BaseUnit<T>,
  rootDimension: string[],
  withHeader: boolean = false,
): { units: Unit<T>; unitsSize: number; uiUnits: Unit<T> } => {
  let unitsSize = 1;
  let prevKey: string = '__NOT__EXISTED__';

  const { units, uiUnits } = Object.entries(dimensionUnits).reduce(
    (acc, [key, val]: [string, Set<string>], i) => {
      // @ts-ignore
      acc.units[key] = [...val].sort();
      unitsSize *= acc.units[key].length;

      acc.uiUnits[key] = multiplyArray<T>(
        // @ts-ignore
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
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      units: {} as Partial<Unit<T>>,
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      uiUnits: {} as Partial<Unit<T>>,
    },
  );
  return {
    unitsSize,
    units: units as Unit<T>,
    uiUnits: uiUnits as Unit<T>,
  };
};

const buildOneDimensionUnits = <T extends string>(
  dimension: T[],
  dimensionUnits: Unit<T>,
): string[] => {
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

export type Unit<T extends string> = Record<T, string[]>;
type BaseUnit<T extends string> = Record<T, Set<string>>;

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
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  let baseColumnUnits: BaseUnit<C> = {} as BaseUnit<C>;
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  let baseRowUnits: BaseUnit<R> = {} as BaseUnit<R>;

  data.forEach(item => {
    baseColumnUnits = buildUnits<R, C, M, C>(item, columns, baseColumnUnits);
    baseRowUnits = buildUnits<R, C, M, R>(item, rows, baseRowUnits);
  });

  const {
    units: columnUnits,
    unitsSize: numberOfColumnsPerMetric,
    uiUnits: uiColumnUnits,
  } = extractUnits<C>(baseColumnUnits as BaseUnit<C>, metrics);

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
  numberFormat: string;
  showTotal: boolean;
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
  numberFormat,
  showTotal,
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
      const columnIndex = findUnitsIndex<R, C, M, C>(
        columns,
        columnUnits,
        oneDimensionColumns,
        item,
      );
      const rowIndex = findUnitsIndex<R, C, M, R>(rows, rowUnits, oneDimensionRows, item);

      columnsFillData[columnIndex + metricIndex * numberOfColumnsPerMetric] =
        columnsFillData[columnIndex + metricIndex * numberOfColumnsPerMetric] ||
        item[metric] !== null;

      rowsFillData[rowIndex] = rowsFillData[rowIndex] || item[metric] !== null;

      oneDimensionData[
        columnIndex +
          metricIndex * numberOfColumnsPerMetric +
          rowIndex * (numberOfColumnsPerMetric * metrics.length)
      ] = formatNumber(numberFormat, item[metric]);

      // Set totals
      if (showTotal) {
        rowsTotal[rowIndex] += item[metric];
        columnsTotal[columnIndex + metricIndex * numberOfColumnsPerMetric] += item[metric];
        total += item[metric];
      }
    });
  });

  return {
    oneDimensionData,
    total: formatNumber(numberFormat, total),
    columnsFillData,
    rowsFillData,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    rowsTotal: rowsTotal.map(row => formatNumber(numberFormat, row)),
    columnsTotal: columnsTotal.map(column => formatNumber(numberFormat, column)),
  };
};
