// @ts-ignore
import React, { FC } from 'react';
import { GridItem } from './Layout';
import { Unit } from '../plugin/utils';

type ColumnsHeaderProps<C extends string, M extends string> = {
  metrics: M[];
  uiColumnUnits: Unit<C>;
  columns: C[];
  numberOfColumns: number;
};

const ColumnsHeader: FC<ColumnsHeaderProps<string, string>> = ({
  metrics,
  uiColumnUnits,
  columns,
  numberOfColumns,
}) => (
  <>
    {metrics.map(metric => (
      // eslint-disable-next-line react/jsx-key
      <GridItem
        bordered
        header
        bgLevel={2}
        gridColumn={`span ${numberOfColumns / metrics.length}`}
      >
        {metric}
      </GridItem>
    ))}
    {columns.map(column =>
      uiColumnUnits[column].map(item => (
        // eslint-disable-next-line react/jsx-key
        <GridItem
          header
          bordered
          bgLevel={2}
          gridColumn={`span ${numberOfColumns / uiColumnUnits[column].length}`}
        >
          <div>{item}</div>
        </GridItem>
      )),
    )}
    {/* One empty line for header columns of rows */}
    <GridItem
      header
      bordered
      gridColumn={`span ${numberOfColumns}`}
      style={{ color: 'transparent' }}
    >
      :)
    </GridItem>
  </>
);

export default ColumnsHeader;
