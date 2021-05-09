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
import { Text } from 'recharts';
import { NumberFormatter } from '@superset-ui/core';

export type ComposedChartTickProps = {
  x: number;
  y: number;
  angle?: number;
  textAnchor: 'start' | 'middle' | 'end';
  verticalAnchor: 'start' | 'middle' | 'end';
  width: number;
  tickFormatter?: NumberFormatter;
  payload: {
    value: number;
  };
  dy?: number;
  dx?: number;
  actualWidth?: number;
  actualHeight: number;
};

const ComposedChartTick: FC<ComposedChartTickProps> = ({
  x,
  y,
  angle,
  payload,
  dy,
  dx,
  textAnchor = 'end',
  verticalAnchor = 'start',
  tickFormatter = value => value,
  actualHeight,
  actualWidth,
}) => {
  let text;
  if (!isNaN(payload.value)) {
    text = `${tickFormatter(payload.value)}`;
  } else {
    text = `${payload.value}`;
  }
  const otherProps: { width?: number; height?: number } = {};
  if (actualHeight) {
    otherProps.height = actualHeight;
  }
  if (actualWidth) {
    otherProps.width = actualWidth;
  }
  return (
    <g transform={`translate(${x},${y})`} data-test-id={`tick-${text}`}>
      <Text
        angle={angle}
        dy={dy}
        dx={dx}
        fontSize={12}
        verticalAnchor={verticalAnchor}
        textAnchor={textAnchor}
        {...otherProps}
      >
        {text}
      </Text>
    </g>
  );
};

export default ComposedChartTick;
