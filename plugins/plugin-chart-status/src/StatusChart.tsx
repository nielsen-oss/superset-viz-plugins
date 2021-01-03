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
import { SupersetTheme, styled } from '@superset-ui/core';
import { StatusColorsMap } from './types';

interface StatusStylesProps {
  height: number;
  width: number;
}

export type StatusProps = {
  height: number;
  width: number;
  data: [string, string];
  statusColorsMap: StatusColorsMap;
};

const Styles = styled.div<StatusStylesProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
`;

const ObjectName = styled.div<{ theme: SupersetTheme }>`
  font-size: ${({ theme }) => theme.typography.sizes.xl}px;
`;

const StatusName = styled.div<{ col: string; theme: SupersetTheme }>`
  font-size: ${({ theme }) => theme.typography.sizes.xxl}px;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ col }) => col};
`;

export default function StatusChart(props: StatusProps) {
  const { data, height, width, statusColorsMap } = props;
  return (
    <Styles height={height} width={width} data-testid="status">
      <ObjectName>{data[0]}</ObjectName>
      <StatusName col={statusColorsMap[data[1]]}>{data[1]}</StatusName>
    </Styles>
  );
}
