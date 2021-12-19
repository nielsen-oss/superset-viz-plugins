import { LegendPosition } from './types';

export const EXTRA_PADDING = 25;

export const getChartStyles = (legendPosition: LegendPosition, yAxisWidth: number) => {
  let legendStyle: object = {
    paddingBottom: 20,
  };
  let chartMargin: object = { bottom: EXTRA_PADDING, left: yAxisWidth + 10, right: 50 };
  if (legendPosition === LegendPosition.BOTTOM) {
    legendStyle = {
      paddingTop: EXTRA_PADDING,
    };
    chartMargin = { left: yAxisWidth + 10, top: 20, right: 50 };
  }
  if (legendPosition === LegendPosition.RIGHT) {
    legendStyle = {
      paddingLeft: EXTRA_PADDING,
    };
  }
  if (legendPosition === LegendPosition.RIGHT || legendPosition === LegendPosition.LEFT) {
    chartMargin = { left: yAxisWidth + 10, top: 30, right: 20, bottom: EXTRA_PADDING };
  }
  return {
    legendStyle,
    chartMargin,
  };
};
