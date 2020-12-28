## @superset-viz-plugins/plugin-chart-waterfall

[![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-waterfall.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-waterfall.svg?style=flat-square)

This plugin provides Waterfall for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import WaterfallChartPlugin from '@superset-viz-plugins/plugin-chart-waterfall';

new WaterfallChartPlugin()
  .configure({ key: 'nielsen-oss-waterfall' })
  .register();
```

```js
<SuperChart
  chartType="nielsen-oss-waterfall"
  width={600}
  height={600}
  formData={...}
  queriesData={[{
    data: {...},
  }]}
/>
```