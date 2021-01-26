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
import { t } from '@superset-ui/core';
import { Grid, GridItem } from './Layout';
import { ROW_HEIGHT } from '../plugin/utils';

export type TotalColumnProps = {
  columns: string[];
  rowsTotal: string[];
  rowsFillData: boolean[];
  total: string;
  compactView: boolean;
  showTotalAll: boolean;
};

const TotalColumn: FC<TotalColumnProps> = ({ columns, rowsFillData, rowsTotal, total, showTotalAll, compactView }) => (
  <Grid
    gridTemplateColumns="max-content"
    gridTemplateRows={`repeat(${columns.length + (compactView ? 1 : 2)}, ${ROW_HEIGHT}px) ${rowsFillData
      .map(fillData => `${fillData ? ROW_HEIGHT : 0}px`)
      .join(' ')}`}
  >
    <GridItem header bgLevel={5} gridRow={`span ${columns.length + (compactView ? 1 : 2)}`} justifyContent="flex-end">
      <div>{t('Total')}</div>
    </GridItem>
    {rowsTotal.map((rowTotal, index) => (
      // eslint-disable-next-line react/jsx-key
      <GridItem hidden={!rowsFillData[index]} justifyContent="flex-end">
        <div>{rowTotal}</div>
      </GridItem>
    ))}
    {showTotalAll && (
      <GridItem justifyContent="flex-end">
        <div>{total}</div>
      </GridItem>
    )}
  </Grid>
);

export default TotalColumn;
