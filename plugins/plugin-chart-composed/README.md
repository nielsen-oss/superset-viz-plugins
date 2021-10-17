## @superset-viz-plugins/plugin-chart-composed

[![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-composed.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-composed.svg?style=flat-square)

This plugin provides Composed for Superset.

(Storybook)[https://5fec4c81935a8c002151e85f-abrnxxsiuy.chromatic.com/?path=/docs/plugins-composed-chart-playground--bars]


### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import ComposedChartPlugin from '@superset-viz-plugins/plugin-chart-composed';

new ComposedChartPlugin()
  .configure({ key: 'nielsen-oss-composed' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-composed) for more details.

```js
<SuperChart
  chartType="nielsen-oss-composed"
  width={600}
  height={600}
  formData={...}
  queriesData={[{
    data: {...},
  }]}
/>
```


