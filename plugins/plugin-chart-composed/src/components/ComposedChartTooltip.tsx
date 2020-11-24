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
import { TooltipProps } from 'recharts';

const Container = styled.div`
  border: 1px solid #cccccc;
  background-color: white;
  padding: 10px;
`;

const Line = styled.p`
  color: ${({ color }) => color};
`;

type TPayload = {
  [key: string]: number | undefined;
  rechartsTotal?: number | undefined;
};

const ComposedChartTooltip: FC<TooltipProps> = ({ active, payload = [], label, ...otherProps }) => {
  if (active) {
    const firstPayload = payload[0]?.payload as TPayload;
    const total = firstPayload?.rechartsTotal;
    return (
      <Container>
        <p>{label}</p>
        {payload.map(item => (
          <Line key={item.name} color={item.color}>{`${item.name} : ${item.value}`}</Line>
        ))}
        {total && <Line color="black">{`${t('Total')} : ${total}`}</Line>}
      </Container>
    );
  }

  return null;
};

export default ComposedChartTooltip;
