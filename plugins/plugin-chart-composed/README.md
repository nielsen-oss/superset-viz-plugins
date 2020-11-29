## @superset-viz-plugins/plugin-chart-composed

[![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-composed.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-composed.svg?style=flat-square)
[![David (path)](https://img.shields.io/david/apache-superset/superset-ui.svg?path=packages%2Fsuperset-ui-plugin-chart-composed&style=flat-square)](https://david-dm.org/apache-superset/superset-ui?path=packages/superset-ui-plugin-chart-composed)

This plugin provides Composed for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import ComposedChartPlugin from '@superset-viz-plugins/plugin-chart-composed';

new ComposedChartPlugin()
  .configure({ key: 'composed' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-composed) for more details.

```js
<SuperChart
  chartType="composed"
  width={600}
  height={600}
  formData={...}
  queryData={{
    data: {...},
  }}
/>
```

### File structure generated

```
├── README.md
├── package.json
├── src
│   ├── Composed.tsx
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