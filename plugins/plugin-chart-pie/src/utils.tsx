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
import { LegendProps, PieLabelRenderProps, Sector } from 'recharts';
import React from 'react';
import { getNumberFormatter, NumberFormats, t } from '@superset-ui/core';

export enum LabelTypes {
  percent = 'percent',
  category = 'category',
  categoryPercent = 'category_percent',
}

export const LabelTypeNames = {
  [LabelTypes.percent]: t('Percent'),
  [LabelTypes.category]: t('Category Name'),
  [LabelTypes.categoryPercent]: t('Category and Percentage'),
};

export const renderCustomizedLabel = (
  labelProps: Partial<PieLabelRenderProps> & { x: number; groupBy: string; labelType: string },
) => {
  const percent = labelProps.percent ? +labelProps.percent : 100;

  const percentFormatter = getNumberFormatter(NumberFormats.PERCENT_2_POINT);
  switch (labelProps.labelType) {
    case LabelTypes.percent:
      return <tspan>{percentFormatter(percent)}</tspan>;
    case LabelTypes.categoryPercent:
      return (
        <tspan>
          <tspan>{`${labelProps[labelProps.groupBy]}: `}</tspan>
          <tspan x={labelProps.x} dy="1.2em" fontWeight="bold">{`${percentFormatter(percent)}`}</tspan>
        </tspan>
      );
    case LabelTypes.category:
    default:
      return labelProps[labelProps.groupBy];
  }
};

export type ActiveShapeProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle: number;
  endAngle: number;
  labelType: string;
  fill: string;
  groupBy: string;
  payload?: {
    [key: string]: string;
  };
  percent: number;
  value?: number;
  isDonut?: boolean;
};

export const renderActiveShape = (props: ActiveShapeProps) => {
  const RADIAN = Math.PI / 180;
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle,
    endAngle,
    fill,
    payload,
    groupBy,
    labelType,
    isDonut,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  const x = mx + (cos >= 0 ? 1 : -1) * 12;
  return (
    <g>
      {isDonut && (
        <>
          <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
            {payload && payload[groupBy]}
          </text>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
          />
          <Sector
            cx={cx}
            cy={cy}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={outerRadius + 6}
            outerRadius={outerRadius + 10}
            fill={fill}
          />
        </>
      )}
      <path d={`M${sx},${sy}L${mx},${my}`} stroke={fill} fill="none" />
      <circle cx={mx} cy={my} r={2} fill={fill} stroke="none" />
      <text x={x} y={ey} textAnchor={textAnchor} fill={fill}>
        {renderCustomizedLabel({ ...props, x, groupBy, labelType })}
      </text>
    </g>
  );
};

export enum LegendPosition {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}

type LegendAlign = 'left' | 'center' | 'right';
type LegendVerticalAlign = 'top' | 'middle' | 'bottom';

export const getLegendProps = (
  legendPosition: LegendPosition,
  height: number,
  legendWidth: number | null,
): LegendProps => {
  const result = {
    wrapperStyle: {
      maxHeight: height,
    },
    align: 'center' as LegendAlign,
    verticalAlign: 'middle' as LegendVerticalAlign,
  };
  switch (legendPosition) {
    case LegendPosition.left:
    case LegendPosition.right:
      return {
        ...result,
        align: legendPosition as LegendAlign,
        layout: 'vertical',
        wrapperStyle: {
          ...result.wrapperStyle,
          width: legendWidth,
        },
      };
    case LegendPosition.bottom:
    case LegendPosition.top:
    default:
      return {
        ...result,
        layout: 'horizontal',
        verticalAlign: legendPosition as LegendVerticalAlign,
      };
  }
};
