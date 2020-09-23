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

// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

// @ts-ignore
import React, { FC } from 'react';
import { styled, t } from '@superset-ui/core';
import { Grid, GridItem } from './Layout';
import RowsHeader from './RowsHeader';
import ColumnsHeader from './ColumnsHeader';
import { ROW_HEIGHT, Unit } from '../plugin/utils';
import TotalColumn from './TotalColumn';

export type PivotTableProps<R extends string, C extends string, M extends string> = {
  data: (string | number)[];
  columns: C[];
  rows: R[];
  numberOfRows: number;
  metrics: M[];
  width: number;
  height: number;
  numberOfColumns: number;
  uiColumnUnits: Unit<C>;
  columnsFillData: boolean[];
  rowsTotal: string[];
  total: string;
  showTotal: boolean;
  columnsTotal: string[];
  rowsFillData: boolean[];
  uiRowUnits: Unit<R>;
};

const StyledGrid = styled(Grid)<{ width: number; height: number }>`
  ${({ width }) => `width: ${width}px;`}
  ${({ height }) => `height: ${height - 20}px;`}
  overflow: scroll;
`;

const NoData = styled.div`
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
`;

const PivotTable: FC<PivotTableProps<string, string, string>> = ({
  data,
  columns,
  rows,
  numberOfRows,
  metrics,
  width,
  height,
  numberOfColumns,
  uiColumnUnits,
  columnsFillData,
  rowsFillData,
  uiRowUnits,
  showTotal,
  columnsTotal,
  total,
  rowsTotal,
}) => {
  return (
    <StyledGrid
      gridTemplateColumns="max-content"
      gridTemplateRows="auto"
      width={width}
      height={height}
    >
      {rows.length === 0 && columns.length === 0 ? (
        <NoData>{t('No data to show')}</NoData>
      ) : (
        <Grid gridTemplateColumns="auto" gridTemplateRows="min-content">
          <Grid
            bordered
            gridTemplateColumns={`auto auto ${showTotal ? 'auto' : ''}`}
            gridTemplateRows="auto"
          >
            <RowsHeader
              showTotal={showTotal}
              rowsFillData={rowsFillData}
              numberOfRows={numberOfRows}
              columns={columns}
              rows={rows}
              uiRowUnits={uiRowUnits}
            />
            <Grid
              withoutOverflow
              gridTemplateColumns={columnsFillData
                .map(fillData => `${fillData ? 'max-content' : 0}`)
                .join(' ')}
              gridTemplateRows={`repeat(${columns.length + 2}, ${ROW_HEIGHT}) ${rowsFillData
                .map(fillData => `${fillData ? ROW_HEIGHT : 0}`)
                .join(' ')}`}
            >
              <ColumnsHeader
                metrics={metrics}
                uiColumnUnits={uiColumnUnits}
                columns={columns}
                numberOfColumns={numberOfColumns}
              />
              {data.map((item, index) => (
                // eslint-disable-next-line react/jsx-key
                <GridItem
                  bordered
                  hidden={
                    !(
                      columnsFillData[index % numberOfColumns] &&
                      rowsFillData[Math.floor(index / numberOfColumns)]
                    )
                  }
                >
                  {item}
                </GridItem>
              ))}
              {showTotal &&
                columnsTotal.map((columnTotal, index) => (
                  // eslint-disable-next-line react/jsx-key
                  <GridItem bordered bgLevel={3} hidden={!columnsFillData[index]}>
                    {columnTotal}
                  </GridItem>
                ))}
            </Grid>
            {showTotal && (
              <TotalColumn
                columns={columns}
                rowsFillData={rowsFillData}
                rowsTotal={rowsTotal}
                total={total}
              />
            )}
          </Grid>
        </Grid>
      )}
    </StyledGrid>
  );
};

export default PivotTable;
