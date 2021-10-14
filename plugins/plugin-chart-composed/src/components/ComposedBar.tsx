import React, { FC, RefObject, useEffect } from 'react';
import { BarProps } from 'recharts';
import { JsonObject } from '@superset-ui/core';
import { BREAKDOWN_SEPARATOR } from '../plugin/utils';
import { getBreakdownsOnly } from './utils';

type ComposedBarProp = Partial<BarProps> & {
  rechartsDataKey: string;
  breakdown: string;
  barsUIPositionsRef: RefObject<JsonObject>;
};

const ComposedBar: FC<ComposedBarProp> = props => {
  const { x, y, height, width, fill, opacity, rechartsDataKey, breakdown, barsUIPositionsRef } = props;
  useEffect(() => {
    // @ts-ignore
    barsUIPositionsRef.current[`${rechartsDataKey}${BREAKDOWN_SEPARATOR}${getBreakdownsOnly(breakdown).join()}`] = {
      x,
      y,
      width,
      height,
    };
  }, [barsUIPositionsRef, breakdown, height, rechartsDataKey, width, x, y]);
  return <rect x={x} y={y} height={height} width={width} fill={fill} opacity={opacity} />;
};

export default ComposedBar;
