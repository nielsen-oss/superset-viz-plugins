import React, { FC } from 'react';
import { ScatterProps, Text } from 'recharts';
import { getNumberFormatter, JsonObject } from '@superset-ui/core';
import { NORM_SIZE, NORM_SPACE, Layout, NumbersFormat } from './types';
import { getMetricFromBreakdown, NORM_SEPARATOR } from './utils';

type ComposedNormProp = Partial<ScatterProps> & {
  numbersFormat?: NumbersFormat;
  breakdown: string;
  firstItem: string;
  xColumns: string[];
  yColumns: string[];
  xAxisClientRect?: ClientRect;
  yAxisClientRect?: ClientRect;
  layout: Layout;
  xAxis?: JsonObject;
  yAxis?: JsonObject;
  [key: string]: string | number | JsonObject | Layout | boolean | undefined;
};

const COLORS = {
  plus: '#29A36A',
  minus: '#D30D4C',
  zero: '#787D91',
};

const ComposedNorm: FC<ComposedNormProp> = props => {
  const {
    x,
    y,
    xAxisClientRect,
    xAxis = {},
    yAxis = {},
    layout,
    breakdown,
    numbersFormat,
    rechartsDataKey,
    firstItem,
  } = props;
  const metric = `${getMetricFromBreakdown(breakdown)}${NORM_SEPARATOR}`;
  const metricName = metric.split(NORM_SEPARATOR)[0];

  const formatter = getNumberFormatter(numbersFormat?.type);
  let sign = '';
  let fill = COLORS.zero;
  if ((props[metric] as number) > 0) {
    sign = '+';
    fill = COLORS.plus;
  } else if ((props[metric] as number) < 0) {
    fill = COLORS.minus;
  }

  let resultWidth = xAxis.width / xAxis?.domain?.length - xAxis.width * 0.025;
  let resultHeight = NORM_SIZE;
  let resultX = x ?? 0;
  let valueX = resultX;
  let resultY = xAxisClientRect?.height + xAxis.y + NORM_SPACE;
  let valueY = resultY + NORM_SIZE / 2;
  let valueTransform = '';
  let transform = `translate(${-resultWidth / 2} 0)`;
  let areaX = resultX - xAxis.width / xAxis?.domain?.length / 2 + xAxis.width / 2;
  let areaY = resultY + (3 * NORM_SIZE) / 2 - 2;
  let areaTransform = ``;

  if (layout === Layout.vertical) {
    resultWidth = NORM_SIZE;
    resultHeight = yAxis.height / yAxis?.domain?.length - yAxis.height * 0.025;
    resultX = NORM_SIZE;
    resultY = y ?? 0;
    valueX = -resultY;
    valueY = resultX + NORM_SIZE / 2;
    valueTransform = 'rotate(-90)';
    transform = `translate(0, ${-resultHeight / 2})`;
    areaY = NORM_SIZE / 2;
    areaX = -resultY - yAxis.height / 2 + yAxis.height / yAxis?.domain?.length / 2;
    areaTransform = 'rotate(-90)';
  }

  return (
    <g>
      {rechartsDataKey === firstItem && (
        <Text
          transform={areaTransform}
          verticalAnchor="middle"
          textAnchor="middle"
          x={areaX}
          y={areaY}
          height={resultHeight * 2}
        >
          {metricName}
        </Text>
      )}
      <rect
        rx="2"
        transform={transform}
        x={resultX}
        y={resultY}
        fill={fill}
        height={resultHeight}
        width={resultWidth}
      />
      <g>
        <Text
          transform={valueTransform}
          fontWeight={600}
          height={resultHeight}
          width={resultWidth}
          x={valueX}
          y={valueY}
          verticalAnchor="middle"
          textAnchor="middle"
          style={{ whiteSpace: 'nowrap', fill: 'white' }}
        >
          {sign + formatter(props[metric] as number)}
        </Text>
      </g>
    </g>
  );
};

export default ComposedNorm;
