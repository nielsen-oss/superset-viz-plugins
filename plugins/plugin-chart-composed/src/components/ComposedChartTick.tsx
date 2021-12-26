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
import { JsonObject, NumberFormatter } from '@superset-ui/core';

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
  dy: number;
  dx: number;
  index: number;
  visibleTicksCount: number;
  actualWidth?: number;
  actualHeight: number;
  hasTimeSeries?: boolean;
  times?: JsonObject;
};

const ComposedChartTick: FC<ComposedChartTickProps> = ({
  times,
  hasTimeSeries,
  x,
  y,
  angle,
  payload,
  index,
  dy = 0,
  dx = 0,
  textAnchor = 'end',
  verticalAnchor = 'start',
  tickFormatter = value => value,
  actualHeight,
  width,
  actualWidth,
  visibleTicksCount,
}) => {
  let text;
  if (hasTimeSeries) {
    const date = new Date(Number(payload.value));
    text = date.getDate();
  } else if (!isNaN(payload.value)) {
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
  const tickWidth = width / visibleTicksCount;
  const timeSeriesWidth = tickWidth ? times?.[index]?.long * tickWidth : undefined;

  return (
    <g transform={`translate(${x},${y})`} data-test-id={`tick-${text}`}>
      <Text
        angle={angle}
        dx={dx}
        dy={dy}
        fontSize={12}
        verticalAnchor={verticalAnchor}
        textAnchor={textAnchor}
        {...otherProps}
      >
        {text}
      </Text>
      {hasTimeSeries && times?.[index] && (
        <>
          {index !== 0 && (
            <line
              x1={-(tickWidth ?? 0) / 2}
              y1={dy - 5}
              x2={-(tickWidth ?? 0) / 2}
              y2={dy + 35}
              style={{ stroke: 'black', strokeWidth: 1 }}
            />
          )}
          <Text
            className="composed-chart-tick-time-text"
            angle={angle}
            dx={dx + (times?.[index]?.long * (tickWidth ?? 0)) / 2 - (tickWidth ?? 0) / 2}
            dy={dy + 20}
            fontSize={12}
            verticalAnchor={verticalAnchor}
            textAnchor={textAnchor}
            {...otherProps}
            width={times?.[index]?.isBreakText ? 1 : timeSeriesWidth}
          >
            {times?.[index]?.text}
          </Text>
        </>
      )}
    </g>
  );
};

export default ComposedChartTick;
