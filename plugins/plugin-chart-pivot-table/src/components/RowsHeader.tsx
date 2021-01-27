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
import { Grid, GridItem, UIGridContainer, InvisibleGridItem } from './Layout';
import { ROW_HEIGHT, Unit } from '../plugin/utils';
import HeadersOfHeader from './HeaderOfHeader';
import { ShowTotal } from '../types';

type RowsHeaderProps<R extends string, C extends string> = {
  uiRowUnits: Unit<R>;
  rows: R[];
  columns: C[];
  showTotal: ShowTotal;
  numberOfRows: number;
  rowsFillData: boolean[];
  compactView: boolean;
};

const TotalGridItem = styled(GridItem)`
  width: auto;
  height: auto;
`;

const RowsHeader: FC<RowsHeaderProps<string, string>> = ({
  numberOfRows,
  columns,
  rows,
  compactView,
  uiRowUnits,
  rowsFillData,
  showTotal,
}) => (
  <div>
    <Grid gridTemplateColumns="1fr" gridTemplateRows="max-content max-content">
      <HeadersOfHeader rows={rows} columns={columns} />
      <UIGridContainer
        withoutOverflow
        gridTemplateColumns={`repeat(${rows.length || 1}, max-content)`}
        gridTemplateRows={`${compactView ? 0 : 'max-content'} ${rowsFillData
          .map(fillData => `${fillData ? ROW_HEIGHT : 0}px`)
          .join(' ')}`}
        gridAutoFlow="column"
      >
        {rows.map((row, rowIndex) =>
          uiRowUnits[row].map((item, index) => (
            // eslint-disable-next-line react/jsx-key
            <InvisibleGridItem
              invisible={compactView && index === 0}
              bordered
              header={index === 0}
              bgLevel={rowIndex === rows.length - 1 ? undefined : 5}
              justifyContent="flex-start"
              // If index === 0, it's header of columns for rows
              gridRow={`span ${index === 0 ? 1 : numberOfRows / (uiRowUnits[row].length - 1)}`}
            >
              <div>{item}</div>
            </InvisibleGridItem>
          )),
        )}
      </UIGridContainer>
    </Grid>
    {(showTotal === ShowTotal.columnsAndRows || showTotal === ShowTotal.columns) && (
      <TotalGridItem gridColumn={`span ${rows.length || 1}`} justifyContent="flex-start">
        <div>{t('Total')}</div>
      </TotalGridItem>
    )}
  </div>
);

export default RowsHeader;
