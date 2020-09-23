const __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function (cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, 'raw', { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  };
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const react_1 = require('react');
const style_1 = require('@superset-ui/style');
const recharts_1 = require('recharts');
// eslint-disable-next-line import/no-extraneous-dependencies
const color_1 = require('@superset-ui/color');
// eslint-disable-next-line import/no-extraneous-dependencies
const number_format_1 = require('@superset-ui/number-format');
const BarChartTooltip_1 = require('./BarChartTooltip');
const utils_1 = require('./utils');

const Styles = style_1.default.div(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        '\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: ',
        'px;\n  border-radius: ',
        'px;\n  height: ',
        ';\n  width: ',
        ';\n  overflow-y: scroll;\n  h3 {\n    /* You can use your props to control CSS! */\n    font-size: ',
        ';\n    font-weight: bold;\n  }\n',
      ],
      [
        '\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  padding: ',
        'px;\n  border-radius: ',
        'px;\n  height: ',
        ';\n  width: ',
        ';\n  overflow-y: scroll;\n  h3 {\n    /* You can use your props to control CSS! */\n    font-size: ',
        ';\n    font-weight: bold;\n  }\n',
      ],
    )),
  function (_a) {
    const { theme } = _a;
    return theme.gridUnit * 4;
  },
  function (_a) {
    const { theme } = _a;
    return theme.gridUnit * 2;
  },
  function (_a) {
    const { height } = _a;
    return height;
  },
  function (_a) {
    const { width } = _a;
    return width;
  },
  function (_a) {
    let _b;
    let _c;
    const { theme } = _a;
    return (_c =
      (_b = theme === null || theme === void 0 ? void 0 : theme.typography) === null ||
      _b === void 0
        ? void 0
        : _b.sizes) === null || _c === void 0
      ? void 0
      : _c.xxl;
  },
);
function ComposedChart(props) {
  const { data } = props;
  const { height } = props;
  const { width } = props;
  const { layout } = props;
  const { metrics } = props;
  const { colorScheme } = props;
  const { stackedBars } = props;
  const { xAxis } = props;
  const { yAxis } = props;
  const { labelsColor } = props;
  const { numbersFormat } = props;
  const rootElem = react_1.createRef();
  const _a = react_1.useState(0);
  const exploreCounter = _a[0];
  const setExploreCounter = _a[1];
  const { getColor } = color_1.CategoricalColorNamespace;
  const dataKeyLength =
    utils_1.getMaxLengthOfDataKey(data) * utils_1.MIN_SYMBOL_WIDTH_FOR_TICK_LABEL;
  const metricLength =
    utils_1.getMaxLengthOfMetric(data, metrics, number_format_1.getNumberFormatter(numbersFormat)) *
    utils_1.MIN_SYMBOL_WIDTH_FOR_TICK_LABEL;
  react_1.useEffect(
    function () {
      // In explore need rerender chart when change `renderTrigger` props
      setExploreCounter(exploreCounter + 1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [xAxis, yAxis, labelsColor, numbersFormat, stackedBars, colorScheme, layout],
  );
  return (
    <Styles ref={rootElem} height={height} width={width}>
      <recharts_1.BarChart
        margin={{
          bottom: 30,
          top: 0,
          right: 0,
          left: 30,
        }}
        layout={layout}
        height={height - 40}
        width={width}
        data={data}
      >
        <recharts_1.Legend verticalAlign="top" height={40} iconType="circle" iconSize={10} />
        <recharts_1.CartesianGrid {...utils_1.getCartesianGridProps({ layout })} />
        <recharts_1.XAxis
          {...utils_1.getXAxisProps({
            dataKeyLength,
            metricLength,
            numbersFormat,
            layout,
            angle: xAxis.tickLabelAngle,
            label: xAxis.label,
          })}
        />
        <recharts_1.YAxis
          {...utils_1.getYAxisProps({
            dataKeyLength,
            metricLength,
            numbersFormat,
            layout,
            angle: yAxis.tickLabelAngle,
            label: yAxis.label,
          })}
        />
        <recharts_1.Tooltip content={<BarChartTooltip_1.default />} />
        {metrics.map(function (metric) {
          return (
            <recharts_1.Bar
              key={`${metric}_${exploreCounter}`}
              label={{
                fill: labelsColor,
                position: 'center',
                formatter: number_format_1.getNumberFormatter(numbersFormat),
                content: utils_1.renderLabel,
              }}
              dataKey={metric}
              stackId={stackedBars ? 'metric' : undefined}
              fill={getColor(metric, colorScheme)}
            />
          );
        })}
      </recharts_1.BarChart>
    </Styles>
  );
}
exports.default = ComposedChart;
let templateObject_1;
