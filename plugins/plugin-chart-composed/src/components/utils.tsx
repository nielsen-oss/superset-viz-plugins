import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getNumberFormatter } from '@superset-ui/number-format';
import { Area, Bar, LabelProps, Line, Scatter } from 'recharts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NumberFormatFunction } from '@superset-ui/number-format/lib/types';
import { ResultData } from '../plugin/transformProps';
// eslint-disable-next-line import/no-extraneous-dependencies
import ComposedChartTick, { BarChartTickProps } from './ComposedChartTick';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CategoricalColorNamespace } from '@superset-ui/color';

export enum Layout {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export const MAX_SYMBOLS_IN_TICK_LABEL = 20;
export const MIN_BAR_SIZE_FOR_LABEL = 18;
export const MIN_SYMBOL_WIDTH_FOR_LABEL = 14;
export const MIN_SYMBOL_WIDTH_FOR_TICK_LABEL = 8;
export const MIN_LABEL_MARGIN = 20;

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

export type ChartsUIItem = ChartLineItem | ChartBarItem | ChartScatterItem;

export type ChartScatterItem = {
  Element: React.ElementType;
  shape?: string;
};

export type ChartLineItem = {
  Element: React.ElementType;
  type?: string;
  stroke?: string;
  strokeWidth?: number;
};

export type ChartBarItem = {
  Element: React.ElementType;
  fill?: string;
  stackId?: string;
};

export const getChartElement = (
  chartType: keyof typeof CHART_TYPES,
  chartSubType: keyof typeof CHART_SUB_TYPES,
  metric: string,
  colorScheme: string,
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
        type: chartSubType,
      };
      break;
    case CHART_TYPES.AREA_CHART:
      commonProps = {
        Element: Area,
        strokeWidth: 2,
        stroke: color,
        type: chartSubType,
      };
      break;
    case CHART_TYPES.SCATTER_CHART:
      commonProps = {
        Element: Scatter,
        fill: color,
        shape: chartSubType,
      };
      break;
    case CHART_TYPES.BAR_CHART:
    default:
      commonProps = {
        Element: Bar,
        fill: color,
        stackId: chartSubType === CHART_SUB_TYPES.STACKED && 'metric',
      };
  }

  return { ...commonProps };
};

type TAxisProps = {
  layout: Layout;
  angle: number;
  label: string;
  dataKeyLength: number;
  metricLength: number;
  numbersFormat: string;
};

export const getXAxisProps = ({
  layout,
  angle,
  label,
  dataKeyLength,
  metricLength,
  numbersFormat,
}: TAxisProps) => {
  const textAnchor = angle === 0 ? 'middle' : 'end';
  const labelProps: LabelProps = {
    offset: 30,
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
        tick: (props: BarChartTickProps) => (
          <ComposedChartTick
            {...props}
            textAnchor={textAnchor}
            tickFormatter={getNumberFormatter(numbersFormat)}
          />
        ),
        height: angle === 0 ? MIN_LABEL_MARGIN : metricLength,
        type: 'number' as const,
      };
    case Layout.horizontal:
    default:
      return {
        ...params,
        tick: (props: BarChartTickProps) => (
          <ComposedChartTick {...props} textAnchor={textAnchor} />
        ),
        height: angle === 0 ? MIN_LABEL_MARGIN : dataKeyLength,
        interval: 0,
        dataKey: 'rechartsDataKey',
      };
  }
};

export const getYAxisProps = ({
  layout,
  angle,
  label,
  dataKeyLength,
  metricLength,
  numbersFormat,
}: TAxisProps) => {
  const textAnchor = angle === -90 ? 'middle' : 'end';
  const labelProps: LabelProps = {
    offset: 30,
    value: label,
    angle: 90,
    position: 'left',
  };
  const params = {
    dx: -5,
    angle,
    label: labelProps,
  };
  switch (layout) {
    case Layout.vertical:
      return {
        ...params,
        tick: (props: BarChartTickProps) => (
          <ComposedChartTick {...props} textAnchor={textAnchor} />
        ),
        width: angle === -90 ? MIN_LABEL_MARGIN : dataKeyLength,
        dataKey: 'rechartsDataKey',
        type: 'category' as const,
      };
    case Layout.horizontal:
    default:
      return {
        ...params,
        width: angle === -90 ? MIN_LABEL_MARGIN : metricLength,
        tick: (props: BarChartTickProps) => (
          <ComposedChartTick
            {...props}
            textAnchor={textAnchor}
            tickFormatter={getNumberFormatter(numbersFormat)}
          />
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
        (formatter(
          Math.abs(metrics.reduce((total, metric) => total + (item[metric] as number), 0)),
        ) as string).length,
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
