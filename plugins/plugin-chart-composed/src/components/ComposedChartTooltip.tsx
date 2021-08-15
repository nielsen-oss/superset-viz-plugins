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
import { getNumberFormatter, styled, t } from '@superset-ui/core';
import { TooltipProps } from 'recharts';
import { getMetricName } from './utils';
import { Z_SEPARATOR } from '../plugin/utils';

const Container = styled.div`
  border: 1px solid #cccccc;
  background-color: white;
  padding: 10px;
`;

const Line = styled.p`
  color: ${({ color }) => color};
`;

type Payload = {
  [key: string]: number | undefined | string;
  rechartsTotal?: number | undefined;
  numbersFormat: string;
};

type ComposedChartTooltipProps = TooltipProps & {
  numbersFormat: string;
  yColumns: string[];
  hasOrderedBars: boolean;
  isTimeSeries: boolean;
  zDimension?: string;
};

const getFormattedDate = (value: string) => {
  const dateValue = new Date(Number(value));
  return `${dateValue.getDate()} ${dateValue.toLocaleString('default', {
    month: 'short',
  })}, ${dateValue.getFullYear()}`;
};

const ComposedChartTooltip: FC<ComposedChartTooltipProps> = ({
  isTimeSeries,
  active,
  numbersFormat,
  yColumns,
  payload = [],
  label,
  hasOrderedBars,
  zDimension,
}) => {
  if (active) {
    const firstPayload: Payload = payload[0]?.payload;
    const total = firstPayload?.rechartsTotal;
    const formatter = getNumberFormatter(numbersFormat);
    return (
      <Container>
        <p>{isTimeSeries ? getFormattedDate(label as string) : label}</p>
        {payload
          .filter((item, index) => (hasOrderedBars && item.payload[index]) || !hasOrderedBars)
          .map((initItem, index) => {
            const item = hasOrderedBars ? initItem.payload[index] : initItem;
            const name = getMetricName(item?.name, yColumns);
            const zValue = item?.payload?.[`${Z_SEPARATOR}${name}`];
            const zName = `${Z_SEPARATOR}${name}`;
            const value = item?.value as number;
            const resultValue = isNaN(value) ? '-' : formatter(value);
            return (
              <>
                <Line key={name} color={item?.color}>{`${name}: ${resultValue}`}</Line>
                {zValue && <Line key={zName} color={item?.color}>{`${zDimension}: ${formatter(zValue)}`}</Line>}
              </>
            );
          })}
        {total && <Line color="black">{`${t('Total')}: ${isNaN(total) ? '-' : formatter(total)}`}</Line>}
      </Container>
    );
  }

  return null;
};

export default ComposedChartTooltip;
