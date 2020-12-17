## @superset-viz-plugins/plugin-chart-table-pivot-new

[![Version](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-table-pivot-new.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-viz-plugins/plugin-chart-table-pivot-new.svg?style=flat-square)
[![David (path)](https://img.shields.io/david/apache-superset/superset-ui.svg?path=packages%2Fsuperset-ui-plugin-chart-table-pivot-new&style=flat-square)](https://david-dm.org/apache-superset/superset-ui?path=packages/superset-ui-plugin-chart-table-pivot-new)

This plugin provides Table Pivot New for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import TablePivotNewChartPlugin from '@superset-viz-plugin/plugin-chart-table-pivot-new';

new TablePivotNewChartPlugin()
  .configure({ key: 'table-pivot-new' })
  .register();
```


### File structure generated

```
├── README.md
├── package.json
├── src
│   ├── TablePivotNew.tsx
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