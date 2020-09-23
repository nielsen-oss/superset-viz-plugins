var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
function transformProps(chartProps) {
  const { width } = chartProps;
  const { height } = chartProps;
  const { queryData } = chartProps;
  const { data } = queryData;
  const { formData } = chartProps;
  const metrics = formData.metrics.map(function (metric) {
    return metric.label;
  });
  let resultData = data.map(function (item) {
    return {
      ...item,
      rechartsDataKey: formData.groupby
        .map(function (field) {
          return item[field];
        })
        .join(', '),
    };
  });
  if (formData.stackedBars) {
    resultData = resultData.map(function (item) {
      return {
        ...item,
        rechartsTotal: metrics.reduce(function (total, metric) {
          return total + item[metric];
        }, 0),
      };
    });
  }
  const result = {
    width,
    height,
    layout: formData.layout,
    colorScheme: formData.colorScheme,
    stackedBars: formData.stackedBars,
    numbersFormat: formData.numbersFormat,
    labelsColor: formData.labelsColor,
    xAxis: {
      label: formData.xAxisLabel,
      tickLabelAngle: -Number(formData.xAxisTickLabelAngle),
    },
    yAxis: {
      label: formData.yAxisLabel,
      tickLabelAngle: -Number(formData.yAxisTickLabelAngle),
    },
    data: resultData,
    metrics,
  };
  return result;
}
exports.default = transformProps;
