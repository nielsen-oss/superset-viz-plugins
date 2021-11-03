## @superset-ui/plugin-chart-bubble

[![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-bubble.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-ui/plugin-chart-bubble.svg?style=flat-square)
[![David (path)](https://img.shields.io/david/apache-superset/superset-viz-plugins.svg?path=packages%2Fsuperset-viz-plugin-chart-bubble&style=flat-square)](https://david-dm.org/apache-superset/superset-ui?path=packages/superset-ui-plugin-chart-bubble)

This plugin provides Bubble for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import BubbleChartPlugin from '@superset-viz-plugins/plugin-chart-bubble';

new BubbleChartPlugin()
  .configure({ key: 'bubble' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-viz-plugins/?selectedKind=plugin-chart-bubble) for more details.

```js
<SuperChart
  chartType="bubble"
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
│   ├── Bubble.tsx
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