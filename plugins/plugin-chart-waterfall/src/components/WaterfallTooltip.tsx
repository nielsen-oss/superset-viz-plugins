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

type WaterfallTooltipProps = {
  formatter: Function;
  active?: boolean;
  payload?: {
    value: number[];
    payload: {
      name: string;
      lastPeriod: number;
      thisPeriod: number;
      change: number;
      changePercentage: number;
    };
  }[];
  label?: string;
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: ${({ theme }) => theme.gridUnit * 3}px;
  padding: ${({ theme }) => theme.gridUnit * 3}px;
  background-color: ${({ theme }) => theme.colors.grayscale.light5};
  border: 1px solid ${({ theme }) => theme.colors.grayscale.light1};
`;

const Title = styled.div`
  grid-column: span 2;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
`;

const WaterfallTooltip: FC<WaterfallTooltipProps> = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    const { lastPeriod, thisPeriod, change, changePercentage } = payload[0]?.payload;
    return (
      <Wrapper>
        <Title>{label}</Title>
        {!!lastPeriod && <div>{t('Last Period:')}</div>}
        {!!lastPeriod && <div>{formatter(lastPeriod)}</div>}
        <div>{t('This Period:')}</div>
        <div>{formatter(thisPeriod)}</div>
        {!!lastPeriod && <div>{t('Change:')}</div>}
        {!!lastPeriod && <div>{formatter(change)}</div>}
        {!!lastPeriod && <div>{t('Due-To %:')}</div>}
        {!!lastPeriod && <div>{formatter(changePercentage)}%</div>}
      </Wrapper>
    );
  }

  return null;
};

export default WaterfallTooltip;
