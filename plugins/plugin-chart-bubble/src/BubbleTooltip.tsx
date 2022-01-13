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
import { CategoricalColorNamespace, getNumberFormatter, styled } from '@superset-ui/core';
import { TooltipProps } from 'recharts';

const Container = styled.div`
  border: 1px solid #cccccc;
  background-color: white;
  padding: 10px;
`;

const Line = styled.p<{ bold?: boolean; color?: string }>`
  color: ${({ color }) => color};
  ${({ bold }) => bold && 'font-weight: bolder'};
`;

type Payload = {
  [key: string]: number | undefined | string;
};

type BubbleChartTooltipProps = TooltipProps & {
  numbersFormat: string;
  entity: string;
  series: string;
  xAxis: string;
  yAxis: string;
  zAxis: string;
  colorFn: Function;
};

const BubbleTooltip: FC<BubbleChartTooltipProps> = ({
  active,
  numbersFormat,
  payload,
  entity,
  xAxis,
  yAxis,
  zAxis,
  series,
  colorFn,
}) => {
  if (active) {
    const firstPayload: Payload = payload?.[0]?.payload;
    const formatter = getNumberFormatter(numbersFormat);
    let name = firstPayload[entity];
    const color = colorFn(firstPayload[series] as string);

    if (series) {
      name = `${name} (${firstPayload[series]})`;
    }
    return (
      <Container>
        <Line color={color} bold>
          {name}
        </Line>
        <Line>{`${xAxis}: ${xAxis ? formatter(firstPayload[xAxis] as number) : '-'}`}</Line>
        <Line>{`${yAxis}: ${yAxis ? formatter(firstPayload[yAxis] as number) : '-'}`}</Line>
        <Line>{`${zAxis}: ${zAxis ? formatter(firstPayload[zAxis] as number) : '-'}`}</Line>
      </Container>
    );
  }

  return null;
};

export default BubbleTooltip;
