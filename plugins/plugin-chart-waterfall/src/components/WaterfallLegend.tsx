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
import React from 'react';
import { t, supersetTheme, styled } from '@superset-ui/core';

const LEGEND = [
  { label: t('Increase'), color: supersetTheme.colors.success.base },
  { label: t('Decrease'), color: supersetTheme.colors.error.base },
  { label: t('Total'), color: supersetTheme.colors.info.base },
  { label: t('Other'), color: supersetTheme.colors.alert.base },
];

const Legend = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
  & > * {
    margin-left: 10px;
  }
`;

const LegendItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
`;

const LegendIcon = styled.div`
  margin-right: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

const LegendLabel = styled.div`
  line-height: 0;
  font-size: ${({ theme }) => theme?.typography?.sizes?.l};
`;

const WaterfallLegend = () => (
  <Legend data-test-id="legend">
    {LEGEND.map(item => (
      <LegendItem key={item.label}>
        <LegendIcon color={item.color} />
        <LegendLabel>{item.label}</LegendLabel>
      </LegendItem>
    ))}
  </Legend>
);

export default WaterfallLegend;
