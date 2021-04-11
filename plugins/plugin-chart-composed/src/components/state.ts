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
import { useMemo } from 'react';
import { addTotalValues, processBarChartOrder } from './utils';
import { ResultData, SortingType } from '../plugin/utils';

export const useCurrentData = (
  data: ResultData[],
  disabledDataKeys: string[],
  colorScheme: string,
  hasOrderedBars: boolean,
  breakdowns: string[],
  orderByTypeMetric: SortingType,
  showTotals: boolean,
): ResultData[] => {
  let currentData = useMemo(
    () =>
      data.map(item => {
        const newItem = { ...item };
        disabledDataKeys.forEach(dataKey => delete newItem[dataKey]);
        return newItem;
      }),
    [data, disabledDataKeys],
  );

  currentData = useMemo(
    () => processBarChartOrder(hasOrderedBars, breakdowns, currentData, colorScheme, orderByTypeMetric),
    [breakdowns, colorScheme, currentData, hasOrderedBars, orderByTypeMetric],
  );

  if (showTotals) {
    currentData = addTotalValues(breakdowns, currentData, hasOrderedBars);
  }

  return currentData;
};
