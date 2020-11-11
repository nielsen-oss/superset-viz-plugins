import { LegendProps, PieLabelRenderProps, Sector } from 'recharts';
import React from 'react';
import { getNumberFormatter, NumberFormats } from '@superset-ui/number-format';

export const LABELS_MARGIN = 90

export const renderCustomizedLabel = (
  labelProps: Partial<PieLabelRenderProps> & { x: number; groupBy: string; numberFormat: string; pieLabelType: string },
) => {
  let percent = labelProps.percent ? +labelProps.percent : 100;

  const percentFormatter = getNumberFormatter(NumberFormats.PERCENT_2_POINT);
  switch (labelProps.pieLabelType) {
    case 'percent':
      return <tspan>{percentFormatter(percent)}</tspan>;
    case 'key_percent':
      return (
        <tspan>
          <tspan>{`${labelProps[labelProps.groupBy]}: `}</tspan>
          <tspan x={labelProps.x} dy="1.2em" fontWeight="bold">{`${percentFormatter(percent)}`}</tspan>
        </tspan>
      );
    case 'key':
    default:
      return labelProps[labelProps.groupBy];
  }
};

type ActiveShapeProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  pieLabelType: string;
  fill: string;
  groupBy: string;
  payload: {
    [key: string]: string;
  };
  percent: number;
  value: number;
  isDonut?: boolean;
};

export const renderActiveShape = (props: ActiveShapeProps) => {
  const RADIAN = Math.PI / 180;
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius,
    outerRadius = 0,
    startAngle,
    endAngle,
    fill,
    payload,
    groupBy,
    pieLabelType,
    isDonut,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  // const ex = mx + (cos >= 0 ? 1 : -1) * 22; // For beauty label, but no place for it :(
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  const x = mx + (cos >= 0 ? 1 : -1) * 12;
  return (
    <g>
      {isDonut && (
        <>
          <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
            {payload[groupBy]}
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
        {
          // @ts-ignore
          renderCustomizedLabel({ ...props, x, groupBy, pieLabelType })
        }
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

export const getLegendProps = (legendPosition: LegendPosition, height: number): LegendProps => {
  let result = {
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
