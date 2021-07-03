## @superset-viz-plugins/plugin-sdk



This plugin provides SDK Plugin for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import { SdkPluginRoot } from '@superset-viz-plugins/plugin-sdk';

new SdkPluginRoot()
  .configure({ key: 'plugin-sdk' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-plugin-super-plugin) for more details.

```js
<SuperChart
  chartType="plugin-sdk"
  width={600}
  height={600}
  formData={...}
  queriesData={[{
    data: {...},
  }]}
/>
