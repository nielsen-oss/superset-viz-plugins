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
import React, { FC } from 'react';
import { styled, t } from '@superset-ui/core';
import { Grid, GridItem } from './Layout';
import RowsHeader from './RowsHeader';
import ColumnsHeader from './ColumnsHeader';
import { ROW_HEIGHT, Unit } from '../plugin/utils';
import TotalColumn from './TotalColumn';
import { ShowTotal } from '../types';

export type PivotTableProps<R extends string, C extends string, M extends string> = {
  data: (string | number)[];
  columns: C[];
  rows: R[];
  numberOfRows: number;
  emptyValuePlaceholder: string;
  metrics: M[];
  width: number;
  height: number;
  numberOfColumns: number;
  uiColumnUnits: Unit<C>;
  columnsFillData: boolean[];
  rowsTotal: string[];
  total: string;
  showTotal: ShowTotal;
  columnsTotal: string[];
  compactView: boolean;
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
  emptyValuePlaceholder,
  numberOfColumns,
  uiColumnUnits,
  columnsFillData,
  rowsFillData,
  uiRowUnits,
  showTotal,
  compactView,
  columnsTotal,
  total,
  rowsTotal,
}) => {
  const mainGridTemplateColumns = `auto auto ${
    showTotal === ShowTotal.rows || showTotal === ShowTotal.columnsAndRows ? 'auto' : ''
  }`;

  return (
    <StyledGrid
      gridTemplateColumns="max-content"
      gridTemplateRows="auto"
      width={width}
      height={height}
      data-testid="pivot-table"
    >
      {rows.length === 0 && columns.length === 0 ? (
        <NoData>{t('No data to show')}</NoData>
      ) : (
        <Grid gridTemplateColumns="auto" gridTemplateRows="min-content">
          <Grid gridTemplateColumns={mainGridTemplateColumns} gridTemplateRows="auto">
            <RowsHeader
              compactView={compactView}
              showTotal={showTotal}
              rowsFillData={rowsFillData}
              numberOfRows={numberOfRows}
              columns={columns}
              rows={rows}
              uiRowUnits={uiRowUnits}
            />
            <Grid
              withoutOverflow
              gridTemplateColumns={columnsFillData.map(fillData => `${fillData ? 'max-content' : 0}`).join(' ')}
              gridTemplateRows={`repeat(${columns.length + 2}, ${ROW_HEIGHT}) ${rowsFillData
                .map(fillData => `${fillData ? ROW_HEIGHT : 0}`)
                .join(' ')}`}
            >
              <ColumnsHeader
                compactView={compactView}
                metrics={metrics}
                uiColumnUnits={uiColumnUnits}
                columns={columns}
                numberOfColumns={numberOfColumns}
              />
              {data.map((item, index) => (
                // eslint-disable-next-line react/jsx-key
                <GridItem
                  justifyContent="flex-end"
                  bgLevel={Math.floor((index / numberOfColumns) % 2) === 0 ? 4 : undefined}
                  bordered
                  hidden={
                    !(columnsFillData[index % numberOfColumns] && rowsFillData[Math.floor(index / numberOfColumns)])
                  }
                >
                  {item || emptyValuePlaceholder}
                </GridItem>
              ))}
              {(showTotal === ShowTotal.columns || showTotal === ShowTotal.columnsAndRows) &&
                columnsTotal.map((columnTotal, index) => (
                  // eslint-disable-next-line react/jsx-key
                  <GridItem bordered bgLevel={4} hidden={!columnsFillData[index]} justifyContent="flex-end">
                    {columnTotal}
                  </GridItem>
                ))}
            </Grid>
            {(showTotal === ShowTotal.columnsAndRows || showTotal === ShowTotal.rows) && (
              <TotalColumn
                compactView={compactView}
                columns={columns}
                rowsFillData={rowsFillData}
                rowsTotal={rowsTotal}
                total={total}
                showTotalAll={showTotal === ShowTotal.columnsAndRows}
              />
            )}
          </Grid>
        </Grid>
      )}
    </StyledGrid>
  );
};

export default PivotTable;
