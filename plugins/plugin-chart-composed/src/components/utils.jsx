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
exports.renderLabel = exports.getMaxLengthOfMetric = exports.getMaxLengthOfDataKey = exports.getCartesianGridProps = exports.getYAxisProps = exports.getXAxisProps = exports.MIN_LABEL_MARGIN = exports.MIN_SYMBOL_WIDTH_FOR_TICK_LABEL = exports.MIN_SYMBOL_WIDTH_FOR_LABEL = exports.MIN_BAR_SIZE_FOR_LABEL = exports.MAX_SYMBOLS_IN_TICK_LABEL = exports.ELayout = void 0;
const react_1 = require('react');
// eslint-disable-next-line import/no-extraneous-dependencies
const number_format_1 = require('@superset-ui/number-format');
const BarChartTick_1 = require('./BarChartTick');

let ELayout;
(function (ELayout) {
  ELayout.horizontal = 'horizontal';
  ELayout.vertical = 'vertical';
})((ELayout = exports.ELayout || (exports.ELayout = {})));
exports.MAX_SYMBOLS_IN_TICK_LABEL = 20;
exports.MIN_BAR_SIZE_FOR_LABEL = 18;
exports.MIN_SYMBOL_WIDTH_FOR_LABEL = 14;
exports.MIN_SYMBOL_WIDTH_FOR_TICK_LABEL = 8;
exports.MIN_LABEL_MARGIN = 20;
exports.getXAxisProps = function (_a) {
  const { layout } = _a;
  const { angle } = _a;
  const { label } = _a;
  const { dataKeyLength } = _a;
  const { metricLength } = _a;
  const { numbersFormat } = _a;
  const textAnchor = angle === 0 ? 'middle' : 'end';
  const labelProps = {
    offset: 10,
    value: label,
    position: 'bottom',
  };
  const params = {
    dy: 5,
    label: labelProps,
    angle,
  };
  switch (layout) {
    case ELayout.vertical:
      return {
        ...params,
        tick(props) {
          return (
            <BarChartTick_1.default
              {...props}
              textAnchor={textAnchor}
              tickFormatter={number_format_1.getNumberFormatter(numbersFormat)}
            />
          );
        },
        height: angle === 0 ? exports.MIN_LABEL_MARGIN : metricLength,
        type: 'number',
      };
    case ELayout.horizontal:
    default:
      return {
        ...params,
        tick(props) {
          return <BarChartTick_1.default {...props} textAnchor={textAnchor} />;
        },
        height: angle === 0 ? exports.MIN_LABEL_MARGIN : dataKeyLength,
        interval: 0,
        dataKey: 'rechartsDataKey',
      };
  }
};
exports.getYAxisProps = function (_a) {
  const { layout } = _a;
  const { angle } = _a;
  const { label } = _a;
  const { dataKeyLength } = _a;
  const { metricLength } = _a;
  const { numbersFormat } = _a;
  const textAnchor = angle === -90 ? 'middle' : 'end';
  const labelProps = {
    offset: 10,
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
    case ELayout.vertical:
      return {
        ...params,
        tick(props) {
          return <BarChartTick_1.default {...props} textAnchor={textAnchor} />;
        },
        width: angle === -90 ? exports.MIN_LABEL_MARGIN : dataKeyLength,
        dataKey: 'rechartsDataKey',
        type: 'category',
      };
    case ELayout.horizontal:
    default:
      return {
        ...params,
        width: angle === -90 ? exports.MIN_LABEL_MARGIN : metricLength,
        tick(props) {
          return (
            <BarChartTick_1.default
              {...props}
              textAnchor={textAnchor}
              tickFormatter={number_format_1.getNumberFormatter(numbersFormat)}
            />
          );
        },
      };
  }
};
exports.getCartesianGridProps = function (_a) {
  const { layout } = _a;
  switch (layout) {
    case ELayout.vertical:
      return {
        horizontal: false,
      };
    case ELayout.horizontal:
    default:
      return {
        vertical: false,
      };
  }
};
exports.getMaxLengthOfDataKey = function (data) {
  return Math.min(
    Math.max.apply(
      Math,
      data.map(function (item) {
        return item.rechartsDataKey.length;
      }),
    ),
    exports.MAX_SYMBOLS_IN_TICK_LABEL,
  );
};
exports.getMaxLengthOfMetric = function (data, metrics, formatter) {
  if (formatter === void 0) {
    formatter = function (value) {
      return `${value}`;
    };
  }
  return Math.max.apply(
    Math,
    data.map(function (item) {
      return formatter(
        Math.abs(
          metrics.reduce(function (total, metric) {
            return total + item[metric];
          }, 0),
        ),
      ).length;
    }),
  );
};
exports.renderLabel = function (_a) {
  const _b = _a.formatter;
  const formatter =
    _b === void 0
      ? function (value) {
          return `${value}`;
        }
      : _b;
  const _c = _a.value;
  const value = _c === void 0 ? 0 : _c;
  const _d = _a.width;
  const labelWidth = _d === void 0 ? 0 : _d;
  const _e = _a.height;
  const labelHeight = _e === void 0 ? 0 : _e;
  const formattedValue = formatter(value);
  if (
    Math.abs(labelHeight) < exports.MIN_BAR_SIZE_FOR_LABEL ||
    Math.abs(labelWidth) < formattedValue.length * exports.MIN_SYMBOL_WIDTH_FOR_LABEL
  ) {
    return '';
  }
  return formattedValue;
};
