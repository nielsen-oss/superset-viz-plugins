import { LegendPosition } from './types';

export const BOTTOM_PADDING = 25;

export const getChartStyles = (legendPosition: LegendPosition, yAxisWidth: number) => {
  let legendStyle: object = {
    paddingBottom: 20,
  };
  let chartMargin: object = { bottom: BOTTOM_PADDING, left: yAxisWidth + 10, right: 50 };
  if (legendPosition === LegendPosition.BOTTOM) {
    legendStyle = {
      paddingTop: BOTTOM_PADDING,
    };
    chartMargin = { left: yAxisWidth + 10, top: 20, right: 50 };
  }
  return {
    legendStyle,
    chartMargin,
  };
};
