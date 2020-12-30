## @superset-viz-plugins/plugin-chart-pie

[![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-pie.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-pie.svg?style=flat-square)

This plugin provides Pie for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import DonutPieChartPlugin from '@superset-viz-plugins/plugin-chart-donut-pie';

new DonutPieChartPlugin()
  .configure({ key: 'nielsen-oss-pie' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-pie) for more details.

```js
<SuperChart
  chartType="nielsen-oss-pie"
  width={600}
  height={600}
  formData={...}
  queriesData={[{
    data: {...},
  }]}
/>
```

### File structure generated

```
├── README.md
├── package.json
├── src
│   ├── DonutPie.tsx
│   ├── images
│   │   └── thumbnail.png
│   ├── index.ts
│   ├── plugin
│   │   ├── buildQuery.ts
│   │   ├── controlPanel.ts
│   │   ├── index.ts
│   │   └── transformProps.ts
│   └── types.ts
├── test
│   └── index.test.ts
└── types
    └── external.d.ts
```