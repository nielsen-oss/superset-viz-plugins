Object.defineProperty(exports, '__esModule', { value: true });
const react_1 = require('react');
const recharts_1 = require('recharts');
const utils_1 = require('./utils');

const ComposedChartTick = function (_a) {
  const { x } = _a;
  const { y } = _a;
  const { angle } = _a;
  const { payload } = _a;
  const { dy } = _a;
  const { dx } = _a;
  const _b = _a.textAnchor;
  const textAnchor = _b === void 0 ? 'end' : _b;
  const _c = _a.tickFormatter;
  const tickFormatter =
    _c === void 0
      ? function (value) {
          return value;
        }
      : _c;
  let text = tickFormatter(payload.value);
  text =
    text.length > utils_1.MAX_SYMBOLS_IN_TICK_LABEL
      ? `${text.slice(0, utils_1.MAX_SYMBOLS_IN_TICK_LABEL)}...`
      : text;
  return (
    <g transform={`translate(${x},${y})`}>
      <recharts_1.Text
        data-test-id={`tick-${payload.value}`}
        angle={angle}
        dy={dy}
        dx={dx}
        fontSize={12}
        verticalAnchor="middle"
        textAnchor={textAnchor}
      >
        {text}
      </recharts_1.Text>
    </g>
  );
};
exports.default = ComposedChartTick;
