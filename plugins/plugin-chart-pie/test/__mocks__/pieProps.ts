const formDataLegendTopPercent = {
  groupby: 'period',
  metric: {
    label: 'AVG(efficiency)',
  },
  labelType: 'percent',
  showLegend: true,
  legendPosition: 'top',
  showLabels: true,
  labelColors: {},
};
const queryData = {
  data: [
    { period: '2020', 'AVG(efficiency)': 0.0566666666666667 },
    {
      period: '2018',
      'AVG(efficiency)': 0.038,
    },
    { period: '2019', 'AVG(efficiency)': 0.0162068965517241 },
    {
      period: 'Total Period',
      'AVG(efficiency)': 0.0138888888888889,
    },
    { period: '2017', 'AVG(efficiency)': 0.011304347826087 },
  ],
};

export const legendTopPercentage = {
  formData: formDataLegendTopPercent,
  height: 400,
  queriesData: [queryData],
  width: 800,
};

export const legendLeftWithoutLabels = {
  formData: {
    ...formDataLegendTopPercent,
    legendPosition: 'left',
    showLabels: false,
  },
  height: 400,
  queriesData: [queryData],
  width: 800,
};

export const categoryPercentageDonutNoLegend = {
  formData: {
    ...formDataLegendTopPercent,
    labelType: 'categoryPercent',
    showLegend: false,
    isDonut: true,
  },
  height: 400,
  queriesData: [queryData],
  width: 800,
};
