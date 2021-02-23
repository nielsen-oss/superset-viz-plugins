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
import { supersetTheme, styled } from '@superset-ui/core';
import { BarProps } from 'recharts';

interface WaterfallBarProps extends Partial<BarProps> {
  __TOTAL__?: boolean;
  numberOfBars?: number;
  index?: number;
}

const ClickableRect = styled.rect`
  cursor: pointer;
`;

const WaterfallBar: FC<WaterfallBarProps> = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  __TOTAL__,
  index = 0,
  numberOfBars = 0,
}) => {
  const isNegative = height < 0;
  let newHeight = height;
  let newY = y;
  let fill = !isNegative ? supersetTheme.colors.success.base : supersetTheme.colors.error.base;
  if (__TOTAL__) {
    fill = supersetTheme.colors.info.base;
  }
  if (isNegative) {
    newY += height;
    newHeight = Math.abs(newHeight);
  }
  return (
    <>
      {index !== numberOfBars - 1 && (
        <line
          x1={x + 0.1 * width}
          y1={y}
          x2={x + 2 * width - 0.1 * width}
          y2={y}
          style={{
            stroke: supersetTheme.colors.grayscale.base,
            strokeWidth: 1,
          }}
        />
      )}
      <ClickableRect
        data-test-id="bar"
        x={x + 0.1 * width}
        y={newY}
        width={width - 0.2 * width}
        height={newHeight}
        fill={fill}
      />
    </>
  );
};

export default WaterfallBar;
