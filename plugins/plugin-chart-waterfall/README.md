## @superset-viz-plugins/plugin-chart-waterfall

[![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-waterfall.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-waterfall.svg?style=flat-square)
[![David (path)](https://img.shields.io/david/apache-superset/superset-ui.svg?path=packages%2Fsuperset-ui-plugin-chart-waterfall&style=flat-square)](https://david-dm.org/apache-superset/superset-ui?path=packages/superset-ui-plugin-chart-waterfall)

This plugin provides Waterfall for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import WaterfallChartPlugin from '@superset-viz-plugins/plugin-chart-waterfall';

new WaterfallChartPlugin()
  .configure({ key: 'waterfall' })
  .register();
```

### File structure generated

```
├── README.md
├── package.json
├── src
│   ├── Waterfall.tsx
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