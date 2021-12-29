import { JsonObject } from '@superset-ui/core';
import { AxisInterval } from 'recharts';

export type BarChartValue = { id: string; value: number; name: string; color: string };
export type BarChartValueMap = { [key: string]: BarChartValue };

export enum Layout {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export type Data = { [key: string]: string | number };

export type LegendType = {
  position?: LegendPosition;
};

export type LabelColors = 'black' | 'white';
export type Deepness = JsonObject &
  {
    label: string;
    value: string;
  }[];

export enum LegendPosition {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left',
}

export type LegendAlign = 'left' | 'center' | 'right';
export type LegendVerticalAlign = 'top' | 'middle' | 'bottom';

export const MIN_BAR_SIZE_FOR_LABEL = 18;
export const MIN_SYMBOL_WIDTH_FOR_LABEL = 14;

export const NORM_SIZE = 40;
export const NORM_SPACE = NORM_SIZE;

export enum ChartType {
  barChart = 'barChart',
  lineChart = 'lineChart',
  scatterChart = 'scatterChart',
  areaChart = 'areaChart',
  bubbleChart = 'bubbleChart',
  normChart = 'normChart',
}

export enum BarChartSubType {
  default = 'default',
  stacked = 'stacked',
}

export enum LineChartSubType {
  basis = 'basis',
  linear = 'linear',
  natural = 'natural',
  monotone = 'monotone',
  step = 'step',
}

export enum NormChartSubType {
  default = 'default',
}

export enum ScatterChartSubType {
  circle = 'circle',
  diamond = 'diamond',
  square = 'square',
  wye = 'wye',
  arrowUp = 'arrowUp',
  arrowDown = 'arrowDown',
}

export enum StickyScatters {
  start = 'start',
  center = 'center',
  end = 'end',
}

export type ChartConfig =
  | {
      chartType: ChartType.areaChart;
      chartSubType: LineChartSubType;
    }
  | {
      chartType: ChartType.lineChart;
      chartSubType: LineChartSubType;
    }
  | {
      chartType: ChartType.barChart;
      chartSubType: BarChartSubType;
    }
  | {
      chartType: ChartType.bubbleChart;
      chartSubType: ScatterChartSubType;
    }
  | {
      chartType: ChartType.scatterChart;
      chartSubType: ScatterChartSubType;
    }
  | {
      chartType: ChartType.normChart;
      chartSubType: NormChartSubType;
    };

export type ColorSchemeByItem = JsonObject;
export type ColorSchemes = {
  __DEFAULT_COLOR_SCHEME__?: string;
  metric?: ColorSchemeByItem;
  breakdown?: ColorSchemeByItem;
};

export type NumbersFormat = {
  type: string;
  digits?: number;
};

export type XAxisProps = {
  label: string;
  tickLabelAngle: number;
  interval: AxisInterval;
  hiddenTickLabels: HiddenTickLabels;
};

export type YColumnsMeta = {
  [key: string]: YColumnsMetaData;
};

export type YColumnsMetaData = {
  hideLegend?: boolean;
} & ChartConfig;

export enum SortingType {
  asc = 'asc',
  desc = 'desc',
}

export type ResultData = {
  orderedBarsDataMap?: JsonObject;
  rechartsDataKey: string;
  rechartsDataKeyUI: string;
  rechartsTotal?: number;
  color?: string;
  [key: string]: BarChartValue | string | number | undefined | JsonObject;
};

export type ResetProps = { xAxisTicks?: boolean };

export type HiddenTickLabels = { [key: string]: boolean };

export type YAxisProps = {
  label?: string;
  tickLabelAngle?: number;
  labelAngle?: number;
};

export type BubbleChart = {
  size: number;
  zDimension: string;
};

export type NormChart = {
  data: Data[];
};
