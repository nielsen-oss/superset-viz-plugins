import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getNumberFormatter } from '@superset-ui/number-format';
import { Area, Bar, LabelProps, Legend, LegendProps, Line, Scatter } from 'recharts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NumberFormatFunction } from '@superset-ui/number-format/lib/types';
import { ResultData } from '../plugin/transformProps';
// eslint-disable-next-line import/no-extraneous-dependencies
import ComposedChartTick, { ComposedChartTickProps } from './ComposedChartTick';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CategoricalColorNamespace } from '@superset-ui/color';

export enum Layout {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export const MAX_SYMBOLS_IN_TICK_LABEL = 20;
export const MIN_SYMBOL_WIDTH_FOR_TICK_LABEL = 6;
export const MIN_BAR_SIZE_FOR_LABEL = 18;
export const MIN_SYMBOL_WIDTH_FOR_LABEL = 14;
export const MIN_LABEL_MARGIN = 20;

export enum LegendPosition {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}

export const CHART_TYPES = {
  BAR_CHART: 'BAR_CHART',
  LINE_CHART: 'LINE_CHART',
  SCATTER_CHART: 'SCATTER_CHART',
  AREA_CHART: 'AREA_CHART',
};

export const CHART_SUB_TYPES = {
  CIRCLE: 'circle',
  DIAMOND: 'diamond',
  SQUARE: 'square',
  WYE: 'wye',

  BASIS: 'basis',
  LINEAR: 'linear',
  NATURAL: 'natural',
  MONOTONE: 'monotone',
  STEP: 'step',

  DEFAULT: 'default',
  STACKED: 'stacked',
};

export const CHART_TYPE_NAMES = {
  [CHART_TYPES.BAR_CHART]: 'Bar Chart',
  [CHART_TYPES.LINE_CHART]: 'Line Chart',
  [CHART_TYPES.AREA_CHART]: 'Area Chart',
  [CHART_TYPES.SCATTER_CHART]: 'Scatter Chart',
};

export const CHART_SUB_TYPE_NAMES = {
  [CHART_TYPES.BAR_CHART]: {
    [CHART_SUB_TYPES.DEFAULT]: 'Default Bar Chart',
    [CHART_SUB_TYPES.STACKED]: 'Stacked Bar Chart',
  },
  [CHART_TYPES.SCATTER_CHART]: {
    [CHART_SUB_TYPES.CIRCLE]: 'Circle Scatter Chart',
    [CHART_SUB_TYPES.DIAMOND]: 'Diamond Scatter Chart',
    [CHART_SUB_TYPES.SQUARE]: 'Square Scatter Chart',
    [CHART_SUB_TYPES.WYE]: 'Wye Scatter Chart',
  },
  [CHART_TYPES.LINE_CHART]: {
    [CHART_SUB_TYPES.BASIS]: 'Basis Line Chart',
    [CHART_SUB_TYPES.LINEAR]: 'Linear Line Chart',
    [CHART_SUB_TYPES.NATURAL]: 'Natural Line Chart',
    [CHART_SUB_TYPES.MONOTONE]: 'Monotone Line Chart',
    [CHART_SUB_TYPES.STEP]: 'Step Line Chart',
  },
  [CHART_TYPES.AREA_CHART]: {
    [CHART_SUB_TYPES.BASIS]: 'Basis Area Chart',
    [CHART_SUB_TYPES.LINEAR]: 'Linear Area Chart',
    [CHART_SUB_TYPES.NATURAL]: 'Natural Area Chart',
    [CHART_SUB_TYPES.MONOTONE]: 'Monotone Area Chart',
    [CHART_SUB_TYPES.STEP]: 'Step Area Chart',
  },
};

type LegendAlign = 'left' | 'center' | 'right';
type LegendVerticalAlign = 'top' | 'middle' | 'bottom';

export const getLegendProps = (legendPosition: LegendPosition, height: number, width: number): LegendProps => {
  let result = {
    wrapperStyle: {
      maxHeight: height,
    },
    align: 'center' as LegendAlign,
    verticalAlign: 'middle' as LegendVerticalAlign,
  };
  if (legendPosition === LegendPosition.left || legendPosition === LegendPosition.right) {
    result = {
      ...result,
      align: legendPosition as LegendAlign,
    };
  }
  switch (legendPosition) {
    case LegendPosition.left:
      return {
        ...result,
        layout: 'vertical',
        wrapperStyle: {
          ...result.wrapperStyle,
          marginLeft: -10,
        },
      };
    case LegendPosition.right:
      return {
        ...result,
        layout: 'vertical',
        wrapperStyle: {
          ...result.wrapperStyle,
          marginRight: -10,
        },
      };
    case LegendPosition.bottom:
      return {
        ...result,
        layout: 'horizontal',
        verticalAlign: legendPosition as LegendVerticalAlign,
        wrapperStyle: {
          ...result.wrapperStyle,
          width: width - 40,
        },
      };
    case LegendPosition.top:
      return {
        ...result,
        layout: 'horizontal',
        verticalAlign: legendPosition as LegendVerticalAlign,
        wrapperStyle: {
          ...result.wrapperStyle,
          width: width - 40,
        },
      };
  }
};

export type ChartsUIItem = ChartLineItem | ChartBarItem | ChartScatterItem;

export type ChartScatterItem = {
  Element: React.ElementType;
  opacity?: number;
  shape?: string;
};

export type ChartLineItem = {
  Element: React.ElementType;
  type?: string;
  strokeOpacity?: string;
  stroke?: string;
  strokeWidth?: number;
};

export type ChartBarItem = {
  Element: React.ElementType;
  fill?: string;
  opacity?: number;
  stackId?: string | boolean;
};

export const getChartElement = (
  chartType: keyof typeof CHART_TYPES,
  chartSubType: keyof typeof CHART_SUB_TYPES,
  metric: string,
  colorScheme: string,
  hasDifferentTypes: boolean,
): ChartsUIItem => {
  const { getColor } = CategoricalColorNamespace;

  const color = getColor(metric, colorScheme);

  let commonProps: Partial<ChartsUIItem> & Pick<ChartsUIItem, 'Element'> = {
    Element: Bar,
  };

  switch (chartType) {
    case CHART_TYPES.LINE_CHART:
      commonProps = {
        Element: Line,
        strokeWidth: 2,
        stroke: color,
        opacity: 0.8,
        type: chartSubType,
      };
      break;
    case CHART_TYPES.AREA_CHART:
      commonProps = {
        Element: Area,
        strokeWidth: 2,
        stroke: color,
        opacity: 0.8,
        type: chartSubType,
      };
      break;
    case CHART_TYPES.SCATTER_CHART:
      commonProps = {
        Element: Scatter,
        fill: color,
        opacity: 0.8,
        shape: chartSubType,
      };
      break;
    case CHART_TYPES.BAR_CHART:
    default:
      commonProps = {
        Element: Bar,
        opacity: hasDifferentTypes ? 0.6 : 1,
        fill: color,
        stackId: chartSubType === CHART_SUB_TYPES.STACKED && 'metric',
      };
  }

  return { ...commonProps };
};

type AxisProps = {
  layout: Layout;
  angle?: number;
  label?: string;
  isSecondAxis?: boolean;
  dataKey?: string;
  dataKeyLength: number;
  metricLength: number;
  numbersFormat: string;
};

export const getXAxisProps = ({ layout, angle, label, dataKeyLength, metricLength, numbersFormat }: AxisProps) => {
  const textAnchor = angle === 0 ? 'middle' : 'end';
  const labelProps: LabelProps = {
    value: label,
    position: 'bottom',
  };
  const params = {
    dy: 5,
    label: labelProps,
    angle,
  };
  switch (layout) {
    case Layout.vertical:
      return {
        ...params,
        tick: (props: ComposedChartTickProps) => (
          <ComposedChartTick {...props} textAnchor={textAnchor} tickFormatter={getNumberFormatter(numbersFormat)} />
        ),
        height: angle === 0 ? MIN_LABEL_MARGIN : metricLength,
        type: 'number' as const,
      };
    case Layout.horizontal:
    default:
      return {
        ...params,
        tick: (props: ComposedChartTickProps) => <ComposedChartTick {...props} textAnchor={textAnchor} />,
        height:
          angle === 0 ? MIN_LABEL_MARGIN : dataKeyLength + (angle === -90 ? MIN_SYMBOL_WIDTH_FOR_TICK_LABEL * 6 : 0),
        interval: 0,
        dataKey: 'rechartsDataKey',
      };
  }
};

export const getYAxisProps = ({
  layout,
  angle,
  label,
  dataKey,
  isSecondAxis,
  dataKeyLength,
  metricLength,
  numbersFormat,
}: AxisProps) => {
  const textAnchor = angle === -90 ? 'middle' : 'end';
  const labelProps: LabelProps = {
    offset: 30,
    value: label,
    angle: 90,
    position: isSecondAxis ? 'right' : 'left',
  };
  const params = {
    tickMargin: isSecondAxis ? 25 : 0,
    dx: isSecondAxis ? 10 : -10,
    angle,
    orientation: isSecondAxis ? ('right' as const) : ('left' as const),
    yAxisId: isSecondAxis ? 'right' : 'left',
    label: labelProps,
  };
  switch (layout) {
    case Layout.vertical:
      return {
        ...params,
        tick: (props: ComposedChartTickProps) => <ComposedChartTick {...props} textAnchor={textAnchor} />,
        width:
          angle === -90 ? MIN_LABEL_MARGIN : dataKeyLength + (angle === 0 ? MIN_SYMBOL_WIDTH_FOR_TICK_LABEL * 6 : 0),
        dataKey: isSecondAxis ? dataKey : 'rechartsDataKey',
        type: 'category' as const,
      };
    case Layout.horizontal:
    default:
      return {
        ...params,
        width: angle === -90 ? MIN_LABEL_MARGIN : metricLength,
        tick: (props: ComposedChartTickProps) => (
          <ComposedChartTick {...props} textAnchor={textAnchor} tickFormatter={getNumberFormatter(numbersFormat)} />
        ),
      };
  }
};

export const getCartesianGridProps = ({ layout }: { layout: Layout }) => {
  switch (layout) {
    case Layout.vertical:
      return {
        horizontal: false,
      };
    case Layout.horizontal:
    default:
      return {
        vertical: false,
      };
  }
};

export const getMaxLengthOfDataKey = (data: ResultData[]) =>
  Math.min(Math.max(...data.map(item => item.rechartsDataKey.length)), MAX_SYMBOLS_IN_TICK_LABEL);

export const getMaxLengthOfMetric = (
  data: ResultData[],
  metrics: string[],
  formatter: NumberFormatFunction = value => `${value}`,
) =>
  Math.max(
    ...data.map(
      item =>
        (formatter(Math.abs(metrics.reduce((total, metric) => total + (item[metric] as number), 0))) as string).length,
    ),
  );

export const renderLabel = ({
  formatter = value => `${value}`,
  value = 0,
  width: labelWidth = 0,
  height: labelHeight = 0,
}: LabelProps) => {
  const formattedValue = formatter(value) as string;
  if (
    Math.abs(labelHeight) < MIN_BAR_SIZE_FOR_LABEL ||
    Math.abs(labelWidth) < formattedValue.length * MIN_SYMBOL_WIDTH_FOR_LABEL
  ) {
    return '';
  }
  return formattedValue;
};
