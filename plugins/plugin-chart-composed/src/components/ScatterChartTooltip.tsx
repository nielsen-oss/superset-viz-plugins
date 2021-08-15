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
import { CategoricalColorNamespace, getNumberFormatter, styled, t } from '@superset-ui/core';
import { TooltipProps } from 'recharts';
import { getMetricName } from './utils';

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
  dataKey: string;
};

type ScatterChartTooltipProps = TooltipProps & {
  numbersFormat: string;
  yColumns: string[];
  zDimension?: string;
  colorScheme: string;
  breakdowns: string[];
};

const ScatterChartTooltip: FC<ScatterChartTooltipProps> = ({
  active,
  numbersFormat,
  yColumns,
  payload = [],
  zDimension,
  colorScheme,
  breakdowns,
}) => {
  if (active) {
    const firstPayload: Payload = payload[0]?.payload;
    const formatter = getNumberFormatter(numbersFormat);
    const data = [...payload];
    data.shift();
    return (
      <Container>
        {/*
          // @ts-ignore */}
        <Line
          color={CategoricalColorNamespace.getScale(colorScheme)(
            breakdowns.findIndex(breakdown => breakdown === data?.[0]?.dataKey),
          )}
        >
          {firstPayload.rechartsDataKeyUI}
        </Line>
        {data.map(item => {
          // @ts-ignore
          const name = getMetricName(item?.dataKey, yColumns, zDimension);
          const value = item?.value as number;
          const resultValue = isNaN(value) ? '-' : formatter(value);
          return <Line key={name}>{`${name}: ${resultValue}`}</Line>;
        })}
      </Container>
    );
  }

  return null;
};

export default ScatterChartTooltip;
