## @superset-viz-plugins/plugin-chart-table-pivot

[![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-table-pivot.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-table-pivot-new.svg?style=flat-square)

This plugin provides Table Pivot New for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import TablePivotNewChartPlugin from '@superset-viz-plugin/plugin-chart-table-pivot';

new TablePivotNewChartPlugin()
  .configure({ key: 'nielsen-oss-table-pivot' })
  .register();
```

```js
<SuperChart
  chartType="nielsen-oss-pivot-table"
  width={600}
  height={600}
  formData={...}
  queriesData={[{
    data: {...},
  }]}
/>
```