const __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        (Array.isArray({ __proto__: [] }) &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (const p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
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
const translation_1 = require('@superset-ui/translation');
const chart_1 = require('@superset-ui/chart');
const buildQuery_1 = require('./buildQuery');
const controlPanel_1 = require('./controlPanel');
const transformProps_1 = require('./transformProps');
const thumbnail_png_1 = require('../images/thumbnail.png');

const metadata = new chart_1.ChartMetadata({
  description: 'Bar Chart',
  name: translation_1.t('Bar Chart'),
  thumbnail: thumbnail_png_1.default,
});
const BarChartPlugin = /** @class */ (function (_super) {
  __extends(BarChartPlugin, _super);
  /**
   * The constructor is used to pass relevant metadata and callbacks that get
   * registered in respective registries that are used throughout the library
   * and application. A more thorough description of each property is given in
   * the respective imported file.
   *
   * It is worth noting that `buildQuery` and is optional, and only needed for
   * advanced visualizations that require either post processing operations
   * (pivoting, rolling aggregations, sorting etc) or submitting multiple queries.
   */
  function BarChartPlugin() {
    return (
      _super.call(this, {
        buildQuery: buildQuery_1.default,
        controlPanel: controlPanel_1.default,
        loadChart() {
          return Promise.resolve().then(function () {
            return require('../components/BarChart');
          });
        },
        metadata,
        transformProps: transformProps_1.default,
      }) || this
    );
  }
  return BarChartPlugin;
})(chart_1.ChartPlugin);
exports.default = BarChartPlugin;
