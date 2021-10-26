import React, { FC } from 'react';
import { ScatterProps, Text } from 'recharts';
import { getNumberFormatter, JsonObject } from '@superset-ui/core';
import { MARK_SIZE, MARK_SPACE, Layout } from './types';
import { layout } from '../plugin/controlPanel';
import { getMetricFromBreakdown } from './utils';

type ComposedMarkProp = Partial<ScatterProps> & {
  numbersFormat: string;
  breakdown: string;
  xAxisHeight: number;
  layout: Layout;
  xAxis?: JsonObject;
  yAxis?: JsonObject;
  [key: string]: string | number | JsonObject | Layout | boolean | undefined;
};

const COLORS = {
  plus: '#29A36A',
  minus: '#D30D4C',
};

const ComposedMark: FC<ComposedMarkProp> = props => {
  const { x, y, xAxisHeight, xAxis = {}, yAxis = {}, layout, breakdown, numbersFormat, rechartsDataKey } = props;
  const metric = getMetricFromBreakdown(breakdown);
  let resultWidth = MARK_SIZE;
  if (layout === Layout.horizontal) {
    resultWidth = xAxis.width / xAxis?.domain?.length - xAxis.width * 0.025;
  }
  let resultHeight = MARK_SIZE;
  if (layout === Layout.vertical) {
    resultHeight = yAxis.height / yAxis?.domain?.length - yAxis.height * 0.025;
  }
  let resultX = x ?? 0;
  if (layout === Layout.vertical) {
    resultX = 0;
  }
  let resultY = y ?? 0;
  if (layout === Layout.horizontal) {
    resultY = xAxisHeight + xAxis.y + MARK_SPACE;
  }

  const formatter = getNumberFormatter(numbersFormat);
  let sign = '';
  if ((props[metric] as number) > 0) {
    sign = '+';
  } else if ((props[metric] as number) < 0) {
    sign = '-';
  }
  return (
    <>
      {rechartsDataKey === xAxis?.domain?.[0] && (
        <g>
          <rect x={0} y={resultY} fill="#F7F7F8" height={resultHeight} width="100%" rx="2" />
          <Text
            fontWeight={600}
            fontSize={18}
            verticalAnchor="middle"
            style={{ fill: '#121118' }}
            x={15}
            y={resultY + MARK_SIZE / 2}
            height={resultHeight}
          >
            {metric}:
          </Text>
        </g>
      )}
      <rect
        rx="2"
        transform={`translate(${-resultWidth / 2}, 0)`}
        x={resultX}
        y={resultY}
        fill={(props[metric] as number) >= 0 ? COLORS.plus : COLORS.minus}
        height={resultHeight}
        width={resultWidth}
      />
      <g>
        <Text
          height={resultHeight}
          width={resultWidth}
          x={resultX}
          y={resultY + MARK_SIZE / 2}
          fontWeight={600}
          fontSize={18}
          verticalAnchor="middle"
          textAnchor="middle"
          style={{ whiteSpace: 'nowrap', fill: 'white' }}
        >
          {sign + formatter(props[metric] as number)}
        </Text>
      </g>
    </>
  );
};

export default ComposedMark;
